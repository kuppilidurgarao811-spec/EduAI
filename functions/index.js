const { onCall, HttpsError } =
  require("firebase-functions/v2/https");

const { initializeApp } =
  require("firebase-admin/app");

const { getFirestore, FieldValue } =
  require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();

exports.submitEduAIQuiz = onCall(
  { enforceAppCheck: true },
  async (request) => {

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Please log in."
      );
    }

    const userId = request.auth.uid;
    const { quizId, answers } = request.data;

    if (
      typeof quizId !== "string" ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      answers.length > 200
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Invalid quiz submission."
      );
    }

    const quizRef = db.collection("quizzes").doc(quizId);
    const quizSnap = await quizRef.get();

    if (!quizSnap.exists) {
      throw new HttpsError("not-found", "Quiz not found.");
    }

    const quiz = quizSnap.data();

    if (!quiz.isActive || !quiz.isPublished) {
      throw new HttpsError(
        "failed-precondition",
        "Quiz is not available."
      );
    }

    const questionsSnap = await quizRef
      .collection("questions")
      .orderBy("order")
      .get();

    const questionDocs = questionsSnap.docs;

    if (
      questionDocs.length === 0 ||
      answers.length !== questionDocs.length
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Submit an answer for every question."
      );
    }

    const answerMap = new Map();

    for (const answer of answers) {
      if (
        !answer ||
        typeof answer.questionId !== "string" ||
        !Number.isInteger(answer.selectedOptionIndex) ||
        answer.selectedOptionIndex < 0 ||
        answer.selectedOptionIndex > 3 ||
        answerMap.has(answer.questionId)
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Invalid or duplicate answer."
        );
      }

      answerMap.set(
        answer.questionId,
        answer.selectedOptionIndex
      );
    }

    let score = 0;
    let totalMarks = 0;

    for (const questionDoc of questionDocs) {

      const question = questionDoc.data();

      const marks = question.marks;

      if (!Number.isInteger(marks) || marks <= 0) {
        throw new HttpsError(
          "failed-precondition",
          "Invalid question marks."
        );
      }

      totalMarks += marks;

      const keySnap = await quizRef
        .collection("answerKeys")
        .doc(questionDoc.id)
        .get();

      if (!keySnap.exists) {
        throw new HttpsError(
          "failed-precondition",
          "An answer key is missing."
        );
      }

      const correctIndex =
        keySnap.data().correctOptionIndex;

      const selectedIndex =
        answerMap.get(questionDoc.id);

      if (selectedIndex === correctIndex) {
        score += marks;
      }
    }

    if (totalMarks !== quiz.totalMarks) {
      throw new HttpsError(
        "failed-precondition",
        "Quiz marks do not match question marks."
      );
    }

    const percentage =
      totalMarks > 0 ? score * 100 / totalMarks : 0;

    const passed = score >= quiz.passMarks;

    const attemptRef = db.collection("quizAttempts").doc();

    await attemptRef.set({
      id: attemptRef.id,
      quizId,
      userId,
      score,
      totalMarks,
      percentage,
      passed,
      submittedAt: FieldValue.serverTimestamp()
    });

    return {
      attemptId: attemptRef.id,
      score,
      totalMarks,
      percentage,
      passed
    };
  }
);
