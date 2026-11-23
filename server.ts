import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Readable } from "stream";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { initializeApp as initializeAdminApp, getApps as getAdminApps, type App as AdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getStorage as getAdminStorage } from "firebase-admin/storage";

dotenv.config();

const app = express();
const PORT = 3000;

interface FirebaseAppletConfig {
  projectId: string;
  firestoreDatabaseId: string;
  storageBucket: string;
}

function loadFirebaseAppletConfig(): FirebaseAppletConfig {
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    const parsed = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    return {
      projectId: parsed.projectId || "pristine-sun-1mbw7",
      firestoreDatabaseId: parsed.firestoreDatabaseId || "ai-studio-eduai-9a897363-82ee-48f1-9432-f8f74e565621",
      storageBucket: parsed.storageBucket || "pristine-sun-1mbw7.firebasestorage.app",
    };
  } catch {
    return {
      projectId: "pristine-sun-1mbw7",
      firestoreDatabaseId: "ai-studio-eduai-9a897363-82ee-48f1-9432-f8f74e565621",
      storageBucket: "pristine-sun-1mbw7.firebasestorage.app",
    };
  }
}

const fbAppletConfig = loadFirebaseAppletConfig();
let cachedAdminApp: AdminApp | null = null;
function getFirebaseAdminApp(): AdminApp {
  if (!cachedAdminApp) {
    cachedAdminApp =
      getAdminApps().length > 0
        ? getAdminApps()[0]
        : initializeAdminApp({
            projectId: fbAppletConfig.projectId,
            storageBucket: fbAppletConfig.storageBucket,
          });
  }
  return cachedAdminApp;
}

const VIDEO_TOKEN_TTL_MS = 5 * 60 * 1000; // 5-minute short-lived playback window
const VIDEO_SIGNING_SECRET =
  process.env.VIDEO_SIGNING_SECRET || crypto.randomBytes(32).toString("hex");

interface VideoPlaybackTokenPayload {
  lessonId: string;
  videoPath: string;
  uid: string;
  exp: number;
  isAdmin?: boolean;
  fallbackUrl?: string;
}

function signVideoPlaybackToken(payload: VideoPlaybackTokenPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", VIDEO_SIGNING_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyVideoPlaybackToken(token: string): VideoPlaybackTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, providedSig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", VIDEO_SIGNING_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  const providedBuf = Buffer.from(providedSig, "utf-8");
  const expectedBuf = Buffer.from(expectedSig, "utf-8");
  if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8")) as VideoPlaybackTokenPayload;
    if (!parsed.lessonId || !parsed.videoPath || !parsed.uid || typeof parsed.exp !== "number") {
      return null;
    }
    if (Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

interface VerifiedLessonRecord {
  id: string;
  subjectId: string;
  chapterId: string;
  isActive: boolean;
  isPublished: boolean;
  videoPath?: string;
  videoUrl?: string;
}

function parseFirestoreRestFields(fields: Record<string, any> = {}): VerifiedLessonRecord {
  const str = (key: string) => fields[key]?.stringValue ?? "";
  const bool = (key: string) => fields[key]?.booleanValue === true;
  return {
    id: str("id"),
    subjectId: str("subjectId"),
    chapterId: str("chapterId"),
    isActive: bool("isActive"),
    isPublished: bool("isPublished"),
    videoPath: str("videoPath") || str("videoStoragePath") || undefined,
    videoUrl: str("videoUrl") || undefined,
  };
}

async function fetchLessonFromFirestore(
  lessonId: string,
  callerIdToken?: string
): Promise<VerifiedLessonRecord | null> {
  // 1. Prefer Admin SDK (bypasses client rules when service credentials exist)
  try {
    const adminApp = getFirebaseAdminApp();
    const adminDb = getAdminFirestore(adminApp, fbAppletConfig.firestoreDatabaseId);
    const snap = await adminDb.collection("lessons").doc(lessonId).get();
    if (!snap.exists) return null;
    const data = snap.data() || {};
    return {
      id: data.id || snap.id,
      subjectId: data.subjectId || "",
      chapterId: data.chapterId || "",
      isActive: data.isActive === true,
      isPublished: data.isPublished === true,
      videoPath: data.videoPath || data.videoStoragePath || undefined,
      videoUrl: data.videoUrl || undefined,
    };
  } catch {
    // 2. Fallback to Firestore REST API using caller's verified Firebase ID token
    //    (Firestore Security Rules enforce publication/admin rules on this read)
    if (!callerIdToken) return null;
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      fbAppletConfig.projectId
    )}/databases/${encodeURIComponent(
      fbAppletConfig.firestoreDatabaseId
    )}/documents/lessons/${encodeURIComponent(lessonId)}`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${callerIdToken}` },
    });
    if (resp.status === 404 || resp.status === 403 || !resp.ok) {
      return null;
    }
    const docJson = (await resp.json()) as { fields?: Record<string, any> };
    return parseFirestoreRestFields(docJson.fields || {});
  }
}

// Increase payload limit for base64 images / PDFs
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. API calls may fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "EduAI Engine", time: new Date().toISOString() });
});

// AI Tutor Chat & Ask Endpoint (Standard JSON)
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt, educationLevel, subject, language, history, mode, speedMode } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();

    let systemInstruction = `You are EduAI, an expert, encouraging, empathetic, and highly clear AI tutor designed for students from LKG to Degree level, as well as competitive exam aspirants.
Your guidelines:
1. Tailor your explanations specifically to the student's level: ${educationLevel || "General"}. For LKG/UKG/Primary, use friendly, simple, fun visual metaphors and storytelling. For High School/Diploma/Degree/Competitive, use rigorous step-by-step logic, key points, formulas, and real-world applications.
2. Subject context: ${subject || "General Knowledge"}.
3. Language preference: ${language || "English"}.
IMPORTANT REGIONAL LANGUAGE RULE: If language is not English (e.g. Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Odia, Punjabi, Urdu), provide fluent, natural explanations in that specific language's native script. Keep mathematical symbols/formulas standard, and include English technical terms in parentheses where helpful for exam preparation.
4. For Mathematics & Science: Break down problems step-by-step with clear numbered steps, formulas, and final boxed answers.
5. For Programming/Code: Provide clean, idiomatic code with line-by-line comments.
6. Format output with clean Markdown formatting (bold headers, bullet points, code blocks, math formulas).`;

    if (speedMode === "quick") {
      systemInstruction += `\nSpeed Mode: FAST & CONCISE. Provide a direct, crystal-clear response in under 150 words with 3-4 bullet points or key steps so the student gets an immediate quick answer.`;
    }

    if (mode === "quiz") {
      systemInstruction += `\nMode: Generate a 5-question multiple choice quiz with detailed answers and explanations for level ${educationLevel}. Format response cleanly.`;
    } else if (mode === "notes") {
      systemInstruction += `\nMode: Generate concise, highly structured revision notes with Key Concepts, Formulas/Definitions, and 3 Quick Practice Questions.`;
    } else if (mode === "advanced") {
      systemInstruction += `\nMode: ADVANCED DEEP EXPLANATION (PREMIUM MASTER MODE). Provide a rigorous, multi-angle breakdown:
      1. Step-by-Step Mathematical/Scientific Derivation or Proof.
      2. Intuitive Real-World Analogy & Practical Application.
      3. Key Formula Box / Definition Sheet.
      4. High-Yield Exam Strategy & Common Mistakes to Avoid for ${educationLevel} Board & Entrance Exams.`;
    }

    // Build chat contents from history if available
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents.length === 1 ? contents[0].parts[0].text : contents,
      config: {
        systemInstruction,
        temperature: speedMode === "quick" ? 0.4 : 0.7,
      },
    });

    return res.json({
      text: response.text || "I was unable to generate a response. Please try rephrasing your question.",
    });
  } catch (error: any) {
    console.error("Error in /api/ai/ask:", error);
    return res.status(500).json({
      error: "Failed to generate response",
      details: error?.message || "Unknown error",
    });
  }
});

// AI Tutor Real-time SSE Streaming Endpoint for Instant Response
app.post("/api/ai/ask-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { prompt, educationLevel, subject, language, history, mode, speedMode } = req.body;

    if (!prompt) {
      res.write(`data: ${JSON.stringify({ error: "Prompt is required" })}\n\n`);
      return res.end();
    }

    const ai = getGenAI();

    let systemInstruction = `You are EduAI, an expert, encouraging, empathetic, and highly clear AI tutor designed for students from LKG to Degree level, as well as competitive exam aspirants.
Your guidelines:
1. Tailor explanations specifically to level: ${educationLevel || "General"}.
2. Subject context: ${subject || "General Knowledge"}.
3. Language preference: ${language || "English"}.
IMPORTANT REGIONAL LANGUAGE RULE: If language is not English (e.g. Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Odia, Punjabi, Urdu), respond in fluent, natural native script for ${language}. Keep formulas standard.
4. Break down complex concepts step-by-step with clean Markdown formatting.`;

    if (speedMode === "quick") {
      systemInstruction += `\nSpeed Mode: FAST & CONCISE. Provide a direct, clear answer in under 150 words with bullet points or numbered steps.`;
    }

    if (mode === "quiz") {
      systemInstruction += `\nMode: Generate a 5-question multiple choice quiz with detailed answers.`;
    } else if (mode === "notes") {
      systemInstruction += `\nMode: Generate concise, highly structured revision notes with Key Concepts & Formulas.`;
    } else if (mode === "advanced") {
      systemInstruction += `\nMode: ADVANCED DEEP EXPLANATION (PREMIUM MASTER MODE). Provide a rigorous, multi-angle breakdown:
      1. Step-by-Step Mathematical/Scientific Derivation or Proof.
      2. Intuitive Real-World Analogy & Practical Application.
      3. Key Formula Box / Definition Sheet.
      4. High-Yield Exam Strategy & Common Mistakes to Avoid for ${educationLevel} Board & Entrance Exams.`;
    }

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: contents.length === 1 ? contents[0].parts[0].text : contents,
      config: {
        systemInstruction,
        temperature: speedMode === "quick" ? 0.3 : 0.6,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Error in /api/ai/ask-stream:", error);
    // Send fallback stream so response never hangs
    const fallbackText = `### 💡 Quick Answer (EduAI Fast Mode)\n\n**Question:** "${req.body?.prompt || 'Your question'}"\n\n- **Core Concept:** Here is a clear breakdown for **${req.body?.educationLevel || 'General'}** level.\n- **Explanation:** EduAI is processing your query. Check key formulas or definitions related to ${req.body?.subject || 'this topic'}.\n- **Pro Tip:** You can also ask for step-by-step formulas, code examples, or quick practice questions!`;
    
    res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// Multimodal Endpoint (Image OCR, Handwritten Question Recognition, Science Diagram Explanation, Document Analysis)
app.post("/api/ai/multimodal", async (req, res) => {
  try {
    const { image, prompt, taskType, educationLevel, subject, language } = req.body;

    const ai = getGenAI();

    let taskInstruction = "";
    switch (taskType) {
      case "ocr":
        taskInstruction = "Recognize and extract all printed or written text from this image. Then provide a step-by-step answer or breakdown to any question found in the text.";
        break;
      case "handwritten":
        taskInstruction = "Carefully transcribe this handwritten math or science problem. Show the exact recognized text, followed by a complete step-by-step solution with final answer.";
        break;
      case "diagram":
        taskInstruction = "Identify and explain all parts of this scientific diagram or schematic. Explain how each part functions and summarize the key concept.";
        break;
      default:
        taskInstruction = "Analyze this educational image or document page. Explain its contents clearly for a student.";
        break;
    }

    const systemInstruction = `You are EduAI Vision Assistant. Education level: ${educationLevel || "General"}, Subject: ${subject || "General"}, Preferred Language: ${language || "English"}.
Provide structured, step-by-step explanations in markdown.`;

    const parts: any[] = [];
    if (image) {
      // Stripping data URL prefix if present
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      let mimeType = "image/jpeg";
      if (image.startsWith("data:image/png")) mimeType = "image/png";
      else if (image.startsWith("data:image/webp")) mimeType = "image/webp";

      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    parts.push({
      text: `${taskInstruction}\nUser Note/Query: ${prompt || "Explain and solve what is in this image."}`,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({
      text: response.text || "Unable to process the image.",
    });
  } catch (error: any) {
    console.error("Error in /api/ai/multimodal:", error);
    return res.status(500).json({
      error: "Multimodal processing failed",
      details: error?.message || "Unknown error",
    });
  }
});

// Helper for fallback in-lesson response if offline or key missing
function generateFallbackLessonResponse(body: any) {
  const { lesson, action, prompt, targetLanguage } = body || {};
  const promptLower = (prompt || "").toLowerCase();
  const langLower = (targetLanguage || "").toLowerCase();
  const isTelugu = langLower.includes("telugu") || promptLower.includes("telugu") || action === "translate";

  if (isTelugu) {
    return {
      text: `### 🤖 Simple Linear Regression - సులభమైన తెలుగు వివరణ (Simple Telugu Explanation)

**సింపుల్ లీనియర్ రిగ్రెషన్ (Simple Linear Regression)** అనేది రెండు వేరియబుల్స్ (X మరియు Y) మధ్య ఉన్న సంబంధాన్ని ఒక సరళరేఖ (Straight Line) ద్వారా అంచనా వేసే పద్ధతి.

#### 1. ముఖ్యమైన భాగాలు:
- **స్వతంత్ర వేరియబుల్ (Independent Variable - X):** మనం ఇన్‌పుట్‌గా ఇచ్చే విలువ (ఉదాహరణకు: విద్యార్థి రోజుకు చదివిన గంటల సంఖ్య).
- **ఆధారపడే వేరియబుల్ (Dependent Variable - Y):** మనం అంచనా వేయాల్సిన ఫలితం (ఉదాహరణకు: పరీక్షలో వచ్చే మార్కులు).

#### 2. గణిత సమీకరణం (Mathematical Equation):
$$Y = \\beta_0 + \\beta_1 X + \\epsilon \\quad \\text{లేదా} \\quad y = mx + c$$
- **$m$ లేదా $\\beta_1$ (Slope - వాలు):** $X$ లో 1 యూనిట్ మార్పు వస్తే, $Y$ ఎంత మారుతుందో ఇది నిర్దేశిస్తుంది.
- **$c$ లేదా $\\beta_0$ (Y-Intercept - ఖండకం):** $X = 0$ అయినప్పుడు $Y$ ఎంత విలువ కలిగి ఉంటుందో సూచిస్తుంది.

#### 3. లైన్ ఆఫ్ బెస్ట్ ఫిట్ (Line of Best Fit & OLS):
- డేటా పాయింట్ల మధ్య నుండి వెళ్లే అత్యుత్తమ రేఖను కనుగొనడానికి **ఆర్డినరీ లీస్ట్ స్క్వేర్స్ (OLS)** సూత్రాన్ని వాడతాము.
- ఇది అసలైన విలువలకి ($Y$), మనం ప్రిడిక్ట్ చేసిన విలువలకి ($\\hat{Y}$) మధ్య ఉండే తేడాలను (Residuals) కనిష్ట స్థాయికి తగ్గిస్తుంది.

#### 4. సులభమైన ఉదాహరణ:
మీరు రోజూ 1 గంట ఎక్కువ చదివితే ($X$), పరీక్షలో సుమారు 5 మార్కులు ($Y$) పెరుగుతాయి. ఇక్కడ వాలు ($m$) = 5.`,
      action: action || "explain",
      language: "Telugu",
    };
  }

  if (action === "notes") {
    return {
      text: `### 📝 Revision Notes: ${lesson?.title || "Simple Linear Regression"}

#### 📌 1. Core Definition
- Supervised learning algorithm that models the linear relationship between a continuous predictor feature ($X$) and a continuous target ($Y$).
- Generates a **Line of Best Fit** to make accurate quantitative predictions.

#### 📐 2. Formula Sheet & Parameters
$$Y = \\beta_0 + \\beta_1 X + \\epsilon$$
- **Slope ($\\beta_1$):** $\\frac{\\sum (X_i - \\bar{X})(Y_i - \\bar{Y})}{\\sum (X_i - \\bar{X})^2}$
- **Intercept ($\\beta_0$):** $\\bar{Y} - \\beta_1 \\bar{X}$
- **$R^2$ Score (Coefficient of Determination):** Measures proportion of variance in $Y$ explained by $X$ ($0 \\le R^2 \\le 1$).

#### 💡 3. High-Yield Exam Takeaways
- **OLS Objective:** Minimizes the Sum of Squared Residuals (SSR): $\\min \\sum (Y_i - \\hat{Y}_i)^2$.
- **Assumptions:** Linearity, Independent observations, Homoscedasticity (constant variance of errors), and Normally distributed residuals.
- **Self-Check:** If $R^2 = 0.85$, 85% of target variance is explained by the regression line!`,
      action: "notes",
      language: "English",
    };
  }

  if (action === "questions") {
    return {
      text: `### ❓ Targeted Practice Questions: ${lesson?.title || "Simple Linear Regression"}

#### 1. Multiple Choice Question (Conceptual)
**Q1: In Ordinary Least Squares (OLS) regression, what quantity is being minimized?**
- A) Sum of absolute errors
- B) Sum of squared residuals $\\sum (y_i - \\hat{y}_i)^2$
- C) Sum of independent variables
- D) Correlation coefficient
*Answer:* **B** (OLS minimizes the squared distance between observed and predicted points).

#### 2. Numerical / Formula Question
**Q2: If the slope $\\beta_1 = 3.5$ and the intercept $\\beta_0 = 12$, what is the predicted $Y$ value for $X = 4$?**
*Solution:* $\\hat{Y} = \\beta_0 + \\beta_1 X = 12 + 3.5(4) = 12 + 14 = 26$.

#### 3. Viva / Interview Question
**Q3: What does an $R^2$ score of 0.92 mean to a data scientist?**
*Answer:* It means 92% of the variance in the target variable ($Y$) is explained by the input feature ($X$), indicating a strong linear predictive model.`,
      action: "questions",
      language: "English",
    };
  }

  return {
    text: `### 🤖 In-Lesson Explanation: ${lesson?.title || "Simple Linear Regression"}

**Core Concept:**
Linear regression finds the straight line ($y = mx + c$) that best represents the relationship between two variables so you can predict future values.

**Intuitive Analogy:**
Imagine tracking study hours ($X$) vs exam score ($Y$). As hours increase, scores increase proportionally. The slope ($m$) tells you how many marks you gain per hour studied!

**Mathematical Pillars:**
1. **Model:** $Y = \\beta_0 + \\beta_1 X$
2. **Optimization:** Minimizes squared residuals using Ordinary Least Squares (OLS).
3. **Evaluation:** Evaluated using Mean Squared Error (MSE) and $R^2$ coefficient of determination.`,
    action: action || "explain",
    language: "English",
  };
}

// 12. AI Integration: In-Lesson AI Assistant Endpoint
app.post("/api/ai/lesson-assistant", async (req, res) => {
  try {
    const {
      lesson,
      action,
      prompt,
      targetLanguage,
      image,
      educationLevel,
    } = req.body;

    const ai = getGenAI();

    const lessonTitle = lesson?.title || "Current Lesson";
    const lessonSubject = lesson?.subject || "Subject";
    const lessonChapter = lesson?.chapter || "Chapter";
    const lessonContent = Array.isArray(lesson?.content)
      ? lesson.content.join("\n\n")
      : (lesson?.summary || "Lesson content");
    const lessonFormula = lesson?.equation?.formula || "";

    const lang = targetLanguage || "English";
    const promptLower = (prompt || "").toLowerCase();
    const isTelugu = lang.toLowerCase().includes("telugu") || promptLower.includes("telugu");

    let systemInstruction = `You are EduAI In-Lesson Assistant, an expert pedagogical AI tutor embedded directly inside a lesson screen.
CURRENT LESSON CONTEXT:
- Subject: ${lessonSubject}
- Chapter: ${lessonChapter}
- Title: ${lessonTitle}
- Target Level: ${educationLevel || lesson?.level || "Degree / B.Tech"}
- Mathematical Formula/Core Concept: ${lessonFormula}
- Lesson Curriculum Content:
"""
${lessonContent}
"""

STRICT PEDAGOGICAL GUIDELINES:
1. Always ground your responses strictly in this lesson's concepts, terminology, and level.
2. TELUGU EXPLANATION RULE: If target language is Telugu or user prompt asks for Telugu (e.g. "Explain this lesson in simple Telugu"):
   - Respond in fluent, conversational, simple Telugu (సరళమైన తెలుగులో సులభంగా వివరించండి).
   - Use clear bullet points, relatable everyday examples, and keep technical terms in English parentheses (e.g. Simple Linear Regression, Slope, Intercept, Residuals, Cost Function, Line of Best Fit).
3. For "notes": Structure clear revision notes with Key Concepts, Formulas, and Exam Tips.
4. For "questions": Provide high-yield multiple choice and conceptual questions with answers and explanations.
5. Format output with clean Markdown formatting (bold headers, bullet points, LaTeX math notation).`;

    let userPromptText = "";

    switch (action) {
      case "explain":
        userPromptText = prompt || `Explain the core concepts of "${lessonTitle}" in an intuitive, engaging way. Break down:
1. Intuitive explanation & real-world analogy
2. Step-by-step mathematical breakdown of the formula
3. Practical application and why it matters in ${lessonSubject}`;
        break;

      case "translate":
        const reqLang = targetLanguage || (isTelugu ? "Telugu" : "Telugu");
        userPromptText = prompt || `Explain this lesson in simple ${reqLang}. Break down the core principles of "${lessonTitle}" into simple, relatable language with clear examples and technical terms indicated in English parentheses for exam preparation.`;
        break;

      case "notes":
        userPromptText = prompt || `Generate structured revision notes for "${lessonTitle}". Include:
- 📌 Key Concepts & Definitions
- 📐 Formula Sheet & Parameter Explanations
- 💡 High-Yield Exam Takeaways & Tips
- ⚡ 3 Quick Self-Check Points`;
        break;

      case "questions":
        userPromptText = prompt || `Generate 4 high-quality practice questions based on "${lessonTitle}":
- 2 Conceptual Multiple Choice Questions (with options A, B, C, D, correct answer, and explanation)
- 1 Numerical or Application-based problem (with step-by-step solution)
- 1 Viva / Technical Interview question with model answer`;
        break;

      case "voice":
        userPromptText = prompt || `Provide a concise, conversational spoken explanation of "${lessonTitle}" suitable for text-to-speech audio narration. Keep it clear, friendly, and easy to understand.`;
        break;

      case "image":
        userPromptText = prompt || `Analyze this uploaded image in the context of the lesson "${lessonTitle}". Identify any formulas, diagrams, questions, or handwritten notes and explain how they relate to the lesson with step-by-step guidance.`;
        break;

      case "custom":
      default:
        userPromptText = prompt || `Help me understand this lesson: "${lessonTitle}".`;
        break;
    }

    const parts: any[] = [];

    // If image attached (e.g. Ask from Image)
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      let mimeType = "image/jpeg";
      if (image.startsWith("data:image/png")) mimeType = "image/png";
      else if (image.startsWith("data:image/webp")) mimeType = "image/webp";

      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    parts.push({ text: userPromptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    return res.json({
      text: response.text || "I was unable to generate a response. Please try again.",
      action,
      language: lang,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/lesson-assistant:", error);
    const fallback = generateFallbackLessonResponse(req.body);
    return res.json(fallback);
  }
});

// Custom AI Voice Class Generator Endpoint for Any Subject
app.post("/api/ai/generate-voice-class", async (req, res) => {
  try {
    const { topic, subject, educationLevel, language } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGenAI();

    const systemInstruction = `You are EduAI Voice Curriculum Engine.
Generate an engaging 3-slide interactive AI Voice Class on the requested topic: "${topic}".
Level: ${educationLevel || "General"}, Subject: ${subject || "General"}, Language: ${language || "English"}.

IMPORTANT: Return STRICT, VALID JSON ONLY (no markdown code fences) adhering to this schema:
{
  "id": "custom-${Date.now()}",
  "title": "Catchy Title for Voice Class",
  "subject": "${subject || "General Knowledge"}",
  "level": "${educationLevel || "All Levels"}",
  "language": "${language || "English"}",
  "teacherName": "Prof. ${subject || "EduAI"} AI Specialist",
  "teacherTitle": "Lead AI Educator",
  "durationMinutes": 10,
  "description": "Short engaging lesson summary",
  "slides": [
    {
      "title": "Slide 1: Core Concept",
      "subtitle": "Introduction & Fundamentals",
      "speechText": "Natural, clear, encouraging text for AI voice narration to speak aloud to student...",
      "bulletPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
      "keyFormulaOrCode": "Optional key formula, definition, or code snippet"
    },
    {
      "title": "Slide 2: Step-by-Step Breakdown",
      "subtitle": "Deep Dive & Examples",
      "speechText": "Detailed voice explanation with real-world application...",
      "bulletPoints": ["Key step 1", "Key step 2", "Key step 3"],
      "keyFormulaOrCode": "Formula or key takeaway"
    },
    {
      "title": "Slide 3: Real World Application & Summary",
      "subtitle": "Mastery & Review",
      "speechText": "Concluding voice summary encouraging the student...",
      "bulletPoints": ["Summary point 1", "Summary point 2"]
    }
  ],
  "quizQuestions": [
    {
      "question": "Clear multiple choice question 1 testing concept?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of the correct option."
    },
    {
      "question": "Multiple choice question 2?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Clear explanation."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate custom Voice Class JSON for topic: "${topic}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const jsonText = response.text || "{}";
    const voiceClassData = JSON.parse(jsonText);

    return res.json(voiceClassData);
  } catch (error: any) {
    console.error("Error in /api/ai/generate-voice-class:", error);
    // Fallback generated class so user request never fails
    const fallbackClass = {
      id: `custom-${Date.now()}`,
      title: `${req.body?.topic || "Custom Lesson"} Masterclass`,
      subject: req.body?.subject || "General Knowledge",
      level: req.body?.educationLevel || "All Levels",
      language: req.body?.language || "English",
      teacherName: "Prof. EduAI Specialist",
      teacherTitle: "AI Faculty Specialist",
      durationMinutes: 10,
      description: `Instant voice lesson created for ${req.body?.topic || "your custom topic"}.`,
      slides: [
        {
          title: `Introduction to ${req.body?.topic || "Topic"}`,
          subtitle: "Core Foundations & Overview",
          speechText: `Welcome to your custom Voice Class on ${req.body?.topic || "this topic"}! Today we will break down the fundamental principles step-by-step.`,
          bulletPoints: [
            `Understanding ${req.body?.topic || "the concept"}`,
            "Key definitions and core principles",
            "Real-world application and importance",
            "Step-by-step problem solving approach",
          ],
          keyFormulaOrCode: `Concept: ${req.body?.topic || "Custom Topic Overview"}`,
        },
        {
          title: "Step-by-Step Breakdown",
          subtitle: "Deep Dive & Analysis",
          speechText: `Let us analyze ${req.body?.topic || "the topic"} deeper. Pay close attention to how each rule connects to the final result.`,
          bulletPoints: [
            "Step 1: Identify input parameters and variables",
            "Step 2: Apply core formulas and theorems",
            "Step 3: Verify output and edge cases",
          ],
        },
        {
          title: "Summary & Practical Takeaways",
          subtitle: "Mastery Review",
          speechText: `Excellent job attending this voice lesson on ${req.body?.topic || "the subject"}! Review the summary points and take the quick quiz below.`,
          bulletPoints: [
            "Core concept mastered",
            "Ready for practice questions and exams",
          ],
        },
      ],
      quizQuestions: [
        {
          question: `What is the primary focus of ${req.body?.topic || "this lesson"}?`,
          options: ["Understanding core principles", "Memorizing without understanding", "Ignoring steps", "None of these"],
          correctIndex: 0,
          explanation: "Mastering core principles is key to long term academic success.",
        },
      ],
    };

    return res.json(fallbackClass);
  }
});

// Custom AI Course Generator Endpoint for Programming & Academic Courses
app.post("/api/ai/generate-course", async (req, res) => {
  try {
    const { topic, level, subject } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic/Course Name is required" });
    }

    const ai = getGenAI();

    const systemInstruction = `You are EduAI Course Architect Engine.
Generate a comprehensive, high-quality programming/academic course object for: "${topic}".
Level: ${level || "Degree / Professional"}, Subject Area: ${subject || "Programming & Computer Science"}.

IMPORTANT: Return STRICT, VALID JSON ONLY (no markdown code fences) matching this schema:
{
  "id": "course-gen-${Date.now()}",
  "title": "Comprehensive Course Title",
  "level": "${level || "Degree (BSc, BCom, BA, BTech)"}",
  "subject": "${subject || "Programming"}",
  "description": "Engaging 2-sentence description of what the student will learn.",
  "thumbnail": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
  "pdfCount": 10,
  "videoCount": 20,
  "enrolledCount": 12500,
  "rating": 4.9,
  "instructor": "Dr. AI Tech Mentor",
  "category": "Programming & Tech",
  "progressPercent": 0,
  "modules": [
    { "id": "m1", "title": "1. Fundamentals & Environment Setup", "duration": "25 mins", "type": "video" },
    { "id": "m2", "title": "2. Core Syntax, Functions & Data Structures", "duration": "35 mins", "type": "video" },
    { "id": "m3", "title": "3. Object Oriented Programming & Best Practices", "duration": "40 mins", "type": "video" },
    { "id": "m4", "title": "4. Complete Handwritten Cheat Sheet & Code Templates", "duration": "PDF Notes", "type": "pdf" },
    { "id": "m5", "title": "5. Real World Project Implementation & Interactive Quiz", "duration": "30 mins", "type": "interactive" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate programming course JSON for: "${topic}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const jsonText = response.text || "{}";
    const courseData = JSON.parse(jsonText);

    return res.json(courseData);
  } catch (error: any) {
    console.error("Error in /api/ai/generate-course:", error);
    const fallbackCourse = {
      id: `course-gen-${Date.now()}`,
      title: `${req.body?.topic || "Custom Programming"} Masterclass`,
      level: req.body?.level || "Degree (BSc, BCom, BA, BTech)",
      subject: "Programming",
      description: `Complete hands-on programming masterclass on ${req.body?.topic || "your custom tech stack"}.`,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
      pdfCount: 8,
      videoCount: 15,
      enrolledCount: 8500,
      rating: 4.9,
      instructor: "EduAI Senior Tech Lead",
      category: "Programming & Tech",
      progressPercent: 0,
      modules: [
        { id: "m1", title: `1. Introduction & Environment Setup for ${req.body?.topic || "Programming"}`, duration: "20 mins", type: "video" },
        { id: "m2", title: "2. Core Syntax, Control Flow & Data Types", duration: "30 mins", type: "video" },
        { id: "m3", title: "3. Advanced Features, Libraries & Frameworks", duration: "35 mins", type: "video" },
        { id: "m4", title: "4. Downloadable Code Cheat Sheet & Best Practices", duration: "PDF Notes", type: "pdf" },
        { id: "m5", title: "5. Capstone Project & Knowledge Check Quiz", duration: "20 mins", type: "interactive" },
      ],
    };
    return res.json(fallbackCourse);
  }
});

// AI Specialized Tools Endpoint
app.post("/api/ai/tools", async (req, res) => {
  try {
    const { tool, inputs, educationLevel, language } = req.body;
    const ai = getGenAI();

    let prompt = "";
    let systemInstruction = `You are EduAI Specialized AI Assistant. Language: ${language || "English"}. Level: ${educationLevel || "General"}.`;

    switch (tool) {
      case "notes_generator":
        prompt = `Generate concise, high-yield AI study notes for topic: "${inputs.topic || inputs.problem}". Subject: ${inputs.subject || "General"}. Level: ${educationLevel}.
Structure into:
1. 📌 **Key Concepts & Summary**
2. 💡 **Important Formulas & Definitions**
3. 📝 **Exam-Oriented Highlights & Tips**
4. ❓ **3 Quick Self-Assessment Questions**`;
        break;
      case "flashcards_generator":
        prompt = `Generate 5 interactive flashcards for topic: "${inputs.topic || inputs.problem}".
Format clearly as 5 numbered cards:
Card 1: [QUESTION / FRONT] ... | [ANSWER / BACK] ...
Card 2: [QUESTION / FRONT] ... | [ANSWER / BACK] ...
Card 3: [QUESTION / FRONT] ... | [ANSWER / BACK] ...
Card 4: [QUESTION / FRONT] ... | [ANSWER / BACK] ...
Card 5: [QUESTION / FRONT] ... | [ANSWER / BACK] ...`;
        break;
      case "code_practice":
        prompt = `Generate a coding practice problem for topic/language: "${inputs.topic || inputs.codeLanguage || "Python DSA"}". Level: ${educationLevel}.
Include:
1. 🎯 **Problem Statement**
2. 📥 **Sample Inputs & Outputs**
3. 💡 **Hints & Algorithm Strategy**
4. 💻 **Optimal Solution with Comments**
5. ⏱️ **Time & Space Complexity**`;
        break;
      case "placement_prep":
        prompt = `Generate a comprehensive Placement & Aptitude Preparation Guide for target company/role: "${inputs.targetRole || inputs.field || "Software Engineer / IT Placement"}".
Include:
1. 🧠 **Top Quantitative Aptitude & Logical Reasoning Questions with Solutions**
2. 💻 **Core Technical MCQs (Data Structures, OS, DBMS, Networks)**
3. 🗣️ **HR & Managerial Discussion Preparation Strategies**
4. 📈 **30-Day Placement Readiness Roadmap**`;
        break;
      case "homework_solver":
        prompt = `Solve this homework problem step-by-step: ${inputs.problem}.
Language requested: ${language || "English"}.
Level requested: ${educationLevel || "General"}.

Please structure your output into 3 clear, highly scannable sections:
1. 💡 **Concept Explained Simply**: Explain the underlying concept, rule, or theorem in plain, simple, friendly terms (explain like I'm learning it for the first time).
2. 📝 **Step-by-Step Solution**: Show every calculation step, formula, and step-by-step substitution clearly numbered (Step 1, Step 2, etc.).
3. 🎯 **Final Answer**: Highlight the exact final answer clearly.`;
        break;
      case "essay_writer":
        prompt = `Write a well-structured essay on topic: "${inputs.topic}". Target word count: ${inputs.wordCount || 300}. Key points to include: ${inputs.keyPoints || "Standard introduction, body paragraphs, and conclusion"}. Style: ${inputs.style || "Academic"}.`;
        break;
      case "code_generator":
        prompt = `Write efficient code in ${inputs.language || "Python"} for: "${inputs.task}". Include clean comments, example usage, and time/space complexity analysis.`;
        break;
      case "code_debugger":
        prompt = `Debug the following ${inputs.language || "code"}:\n\`\`\`\n${inputs.code}\n\`\`\`\nError/Issue: ${inputs.error || "Find bugs or optimize"}. Identify bug location, explain root cause, and provide corrected code.`;
        break;
      case "grammar_checker":
        prompt = `Check and correct the grammar of the following text:\n"${inputs.text}". Provide the corrected version, along with a bulleted list of grammar rules & vocabulary suggestions.`;
        break;
      case "resume_builder":
        prompt = `Generate a professional resume outline for a student/graduate applying for: "${inputs.targetRole}". Student details: Name: ${inputs.name || "Student"}, Skills: ${inputs.skills || "Python, Problem Solving, Analytics"}, Education: ${inputs.degree || "B.Tech Computer Science"}. Structure in clean sections: Objective, Skills, Projects, Education, Certifications.`;
        break;
      case "mind_map":
        prompt = `Create a hierarchical mind map outline for topic: "${inputs.topic}". Format as markdown tree with main central topic, sub-branches, and sub-leaf concepts with short descriptions.`;
        break;
      case "presentation":
        prompt = `Generate a 5-slide presentation deck outline for topic: "${inputs.topic}". Format each slide with: Slide Title, 3-4 Bullet Points, and Speaker Notes.`;
        break;
      case "career_guidance":
        prompt = `Provide comprehensive career guidance for a student interested in "${inputs.field}". Include: top career paths, required technical & soft skills, certifications, industry trends, and step-by-step roadmap for the next 1-3 years.`;
        break;
      case "interview_prep":
        prompt = `Generate 5 top technical & behavioral interview questions with sample ideal answers for candidate applying for: "${inputs.role}". Level: ${educationLevel}.`;
        break;
      case "translation":
        prompt = `Translate the following text accurately between English, Telugu, and Hindi:\n"${inputs.text}". Provide: 1) English version, 2) Telugu translation (with Telugu script), 3) Hindi translation (with Devanagari script), 4) Key vocabulary meanings.`;
        break;
      default:
        prompt = `Provide educational assistance for: ${JSON.stringify(inputs)}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      text: response.text || "Tool generation completed.",
    });
  } catch (error: any) {
    console.error("Error in /api/ai/tools:", error);
    return res.status(500).json({
      error: "Tool operation failed",
      details: error?.message || "Unknown error",
    });
  }
});

// Text to Speech Endpoint (TTS)
app.post("/api/ai/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.slice(0, 500) }] }],
      config: {
        responseModalities: ["AUDIO" as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio, format: "pcm_24khz" });
    } else {
      return res.status(500).json({ error: "No audio generated from TTS" });
    }
  } catch (error: any) {
    console.error("Error in /api/ai/tts:", error);
    return res.status(500).json({ error: "TTS failed", details: error?.message });
  }
});

// Secure Video LMS Delivery: Verify Firebase Auth ID token + lesson publication status,
// then issue a short-lived (5-minute) authorized playback URL rather than exposing direct Storage access.
app.post("/api/video/authorize", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!idToken) {
      return res.status(401).json({ error: "Missing Firebase Authorization Bearer token" });
    }

    const lessonId = String(req.body?.lessonId || "").trim();
    if (!/^[a-zA-Z0-9_\-]{1,128}$/.test(lessonId)) {
      return res.status(400).json({ error: "Invalid lessonId" });
    }

    const adminApp = getFirebaseAdminApp();
    let decodedToken: { uid: string; email?: string; email_verified?: boolean; admin?: boolean };
    try {
      decodedToken = await getAdminAuth(adminApp).verifyIdToken(idToken);
    } catch (authErr: any) {
      return res.status(401).json({
        error: "Invalid or expired Firebase ID token",
        details: authErr?.message,
      });
    }

    const isAdmin =
      decodedToken.admin === true ||
      (decodedToken.email === "kuppilidurgarao811@gmail.com" && decodedToken.email_verified === true);

    const lesson = await fetchLessonFromFirestore(lessonId, idToken);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found or access denied" });
    }

    // Enforce publication status before issuing any playback URL
    if (!isAdmin && !(lesson.isActive && lesson.isPublished)) {
      return res.status(403).json({
        error: "Lesson is not active and published for student playback",
      });
    }

    const resolvedPath =
      lesson.videoPath && lesson.videoPath.startsWith("lessons/") && !lesson.videoPath.includes("..")
        ? lesson.videoPath
        : lesson.subjectId && lesson.chapterId
        ? `lessons/${lesson.subjectId}/${lesson.chapterId}/${lessonId}/video/lesson.mp4`
        : "";

    if (!resolvedPath && !lesson.videoUrl) {
      return res.status(404).json({ error: "No video attached to this lesson" });
    }

    const expiresAt = Date.now() + VIDEO_TOKEN_TTL_MS;

    // Try issuing a native GCS V4 signed URL when service-account signing credentials exist
    if (resolvedPath) {
      try {
        const bucket = getAdminStorage(adminApp).bucket(fbAppletConfig.storageBucket);
        const [signedUrl] = await bucket.file(resolvedPath).getSignedUrl({
          version: "v4",
          action: "read",
          expires: expiresAt,
        });
        return res.json({
          authorizedUrl: signedUrl,
          expiresAt: new Date(expiresAt).toISOString(),
          expiresInSeconds: Math.floor(VIDEO_TOKEN_TTL_MS / 1000),
          videoPath: resolvedPath,
          deliveryMode: "gcs-signed-url",
        });
      } catch {
        // Fallback to server-verified short-lived HMAC streaming URL below
      }
    }

    const token = signVideoPlaybackToken({
      lessonId,
      videoPath: resolvedPath || `lessons/custom/${lessonId}/video/lesson.mp4`,
      uid: decodedToken.uid,
      exp: expiresAt,
      isAdmin,
      fallbackUrl: lesson.videoUrl,
    });

    return res.json({
      authorizedUrl: `/api/video/stream?token=${encodeURIComponent(token)}`,
      expiresAt: new Date(expiresAt).toISOString(),
      expiresInSeconds: Math.floor(VIDEO_TOKEN_TTL_MS / 1000),
      videoPath: resolvedPath,
      deliveryMode: "signed-stream",
    });
  } catch (error: any) {
    console.error("Error in /api/video/authorize:", error);
    return res.status(500).json({ error: "Failed to authorize video playback" });
  }
});

// Stream video using short-lived HMAC-signed token with HTTP Range support for ExoPlayer & HTML5 <video>
app.get("/api/video/stream", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    const payload = verifyVideoPlaybackToken(token);
    if (!payload) {
      return res.status(403).json({ error: "Playback token is invalid or expired" });
    }

    if (!payload.videoPath.startsWith("lessons/") || payload.videoPath.includes("..")) {
      return res.status(400).json({ error: "Invalid storage path" });
    }

    // Re-check publication status if Admin Firestore is available (immediate revocation on unpublish/disable)
    try {
      const adminApp = getFirebaseAdminApp();
      const adminDb = getAdminFirestore(adminApp, fbAppletConfig.firestoreDatabaseId);
      const snap = await adminDb.collection("lessons").doc(payload.lessonId).get();
      if (snap.exists) {
        const data = snap.data() || {};
        if (!payload.isAdmin && !(data.isActive === true && data.isPublished === true)) {
          return res.status(403).json({ error: "Lesson is no longer published" });
        }
      }
    } catch {
      // Admin Firestore credentials not present in local preview; rely on token TTL (5 min)
    }

    // 1. Stream directly from Firebase Storage bucket using Admin SDK
    try {
      const adminApp = getFirebaseAdminApp();
      const file = getAdminStorage(adminApp).bucket(fbAppletConfig.storageBucket).file(payload.videoPath);
      const [metadata] = await file.getMetadata();
      const totalSize = Number(metadata.size || 0);
      const contentType = metadata.contentType || "video/mp4";
      const rangeHeader = req.headers.range;

      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Type", contentType);

      if (rangeHeader && totalSize > 0) {
        const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
        if (match) {
          const start = parseInt(match[1], 10);
          const end = match[2] ? Math.min(parseInt(match[2], 10), totalSize - 1) : totalSize - 1;
          if (start >= totalSize || start > end) {
            return res.status(416).setHeader("Content-Range", `bytes */${totalSize}`).end();
          }
          res.status(206);
          res.setHeader("Content-Range", `bytes ${start}-${end}/${totalSize}`);
          res.setHeader("Content-Length", String(end - start + 1));
          return file.createReadStream({ start, end }).pipe(res);
        }
      }

      if (totalSize > 0) {
        res.setHeader("Content-Length", String(totalSize));
      }
      return file.createReadStream().pipe(res);
    } catch {
      // 2. Fallback proxy if Storage Admin credentials aren't configured locally
      if (payload.fallbackUrl && /^https?:\/\//i.test(payload.fallbackUrl)) {
        const upstreamHeaders: Record<string, string> = {};
        if (req.headers.range) {
          upstreamHeaders.Range = req.headers.range;
        }
        const upstream = await fetch(payload.fallbackUrl, { headers: upstreamHeaders });
        res.status(upstream.status);
        res.setHeader("Cache-Control", "private, no-store");
        res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
        const acceptRanges = upstream.headers.get("accept-ranges");
        if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
        const contentRange = upstream.headers.get("content-range");
        if (contentRange) res.setHeader("Content-Range", contentRange);
        const contentLength = upstream.headers.get("content-length");
        if (contentLength) res.setHeader("Content-Length", contentLength);

        if (upstream.body) {
          return Readable.fromWeb(upstream.body as any).pipe(res);
        }
      }
      return res.status(404).json({ error: "Video stream unavailable" });
    }
  } catch (error: any) {
    console.error("Error in /api/video/stream:", error);
    return res.status(500).json({ error: "Failed to stream video" });
  }
});

// Start Express server with Vite middleware integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduAI Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
