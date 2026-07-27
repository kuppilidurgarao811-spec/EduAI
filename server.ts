import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

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
3. Language preference: ${language || "English"}. If language is Telugu or Hindi, provide clear translations or explanations in that language or bilingual format where helpful.
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
