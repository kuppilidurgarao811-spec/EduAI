# EduAI Security Specification (Phase 0 — Payload-First Security TDD)

## 1. Data Invariants
1. **Admin-Only Curriculum Writes**: Only authenticated users with the server-signed `admin: true` custom claim (or verified admin identity) can create, update, or delete `educationLevels`, `courses`, `subjects`, `chapters`, `lessons`, `quizzes`, `quizQuestions`, or upload/delete media in Cloud Storage.
2. **Publication Gate on Lessons**: Students can only read (`get` / `list`) `lessons` where `isActive == true && isPublished == true`. Student queries MUST explicitly include `isActive == true` and `isPublished == true` filters because Firestore rules are not filters.
3. **Admin-Only Direct Storage Video Reads**: Cloud Storage `/lessons/{subjectId}/{chapterId}/{lessonId}/video/{fileName}` allows `read` and `write` (`< 200 MB`, `video/mp4`) ONLY when `request.auth != null && request.auth.token.admin == true`.
4. **Authorized Short-Lived Video Delivery**: Students do not read Storage video files directly and do not rely on static public `getDownloadUrl()` bearer links for unpublished content. Students request a short-lived authorized playback URL from the backend (`/api/video/authorize`), which verifies the Firebase ID token, checks `lessons/{lessonId}` (`isActive == true && isPublished == true`), and issues a short-lived signed/scoped playback URL (`/api/video/stream?token=...` or GCS V4 signed URL).
5. **Owner-Isolated Progress & Profiles**: Users can only read/write their own `users/{userId}` profile (without self-assigning `role: "admin"`) and their own `progress/{progressId}` / `user_progress/{progressId}` documents (`userId == request.auth.uid`).
6. **ID & Payload Size Hardening**: All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), and every string field enforces explicit `.size()` bounds.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Lesson Read**: `GET /lessons/lesson001` with `auth = null` -> `PERMISSION_DENIED`.
2. **Student Reads Draft Lesson**: `GET /lessons/draftLesson` (`isPublished: false`) as student -> `PERMISSION_DENIED`.
3. **Student Reads Inactive Published Lesson**: `GET /lessons/inactiveLesson` (`isActive: false, isPublished: true`) as student -> `PERMISSION_DENIED`.
4. **Unfiltered Student Lesson List Query**: `LIST /lessons` without `where("isActive", "==", true)` and `where("isPublished", "==", true)` as student -> `PERMISSION_DENIED`.
5. **Student Creates/Publishes Lesson**: `CREATE /lessons/lesX` with `isPublished: true` as non-admin -> `PERMISSION_DENIED`.
6. **Self-Privilege Escalation on User Profile**: `CREATE /users/{uid}` with `role: "admin"` as student -> `PERMISSION_DENIED`.
7. **Cross-User PII Scrape**: `GET /users/{otherUid}` as non-admin student -> `PERMISSION_DENIED`.
8. **Cross-User Progress Tampering**: `CREATE /progress/p1` with `userId: "otherUid"` as student -> `PERMISSION_DENIED`.
9. **ID Poisoning**: `CREATE /lessons/` + 500-char ID or invalid characters `../admin` -> `PERMISSION_DENIED`.
10. **Shadow / Ghost Field Injection**: `CREATE /lessons/les1` by admin with undocumented oversized field or invalid types (`order: "one"`) -> `PERMISSION_DENIED`.
11. **Direct Storage Video Read by Student**: `Storage GET lessons/ML001/CH001/lesson001/video/lesson.mp4` as non-admin student -> `PERMISSION_DENIED`.
12. **Oversized or Non-MP4 Storage Upload by Admin**: `Storage WRITE` `250 MB` or `application/x-msdownload` to `/video/lesson.mp4` -> `PERMISSION_DENIED`.
13. **Student Reads Draft or Inactive Quiz / Questions**: `GET /quizzes/draftQuiz`, `GET /quizzes/inactiveQuiz`, or `LIST /quizzes/{quizId}/questions` without `where("isPublished", "==", true)` and `where("isActive", "==", true)` as non-admin student -> `PERMISSION_DENIED`.
14. **Student Creates or Publishes Quiz**: `CREATE /quizzes/q1` or `UPDATE /quizzes/q1` (`isPublished: true`) as non-admin -> `PERMISSION_DENIED`.
15. **Student Reads Answer Keys at Any Time**: `GET /quizzes/{quizId}/answerKeys/{questionId}` or `LIST /quizzes/{quizId}/answerKeys` as any non-admin student account -> `PERMISSION_DENIED`.
16. **Answer Key Leakage Into Questions Subcollection**: `CREATE /quizzes/{quizId}/questions/{q1}` containing `correctOptionIndex` or `correctAnswer` (even by admin) -> `PERMISSION_DENIED` via strict `hasOnly()` allowlist.
17. **Direct Client Writes to Quiz Attempts**: `CREATE`, `UPDATE`, or `DELETE` on `/quizAttempts/{attemptId}` from any client (Android or Web) -> `PERMISSION_DENIED` (`allow create, update, delete: if false;`).

## 3. Quiz Workflow Security Invariants
- **Strict Separation of Questions and Answer Keys**:
  - `quizzes/{quizId}` stores metadata (`id`, `subjectId`, `chapterId`, `lessonId`, `title`, `description`, `totalMarks`, `passMarks`, `durationMinutes`, `isPublished`, `isActive`, `createdAt`). Students can only read where `isPublished == true && isActive == true`.
  - `quizzes/{quizId}/questions/{questionId}` stores ONLY `questionText`, `options` (2–4 strings), `marks`, `order`, and optional `isPublished`/`isActive` flags. `correctOptionIndex` is explicitly disallowed by schema validation so correct answers can never be exposed to students.
  - `quizzes/{quizId}/answerKeys/{questionId}` stores `correctOptionIndex` (`0..3`) and optional `explanation`. Both `get` and `list` (as well as all writes) are strictly admin-only; ordinary student accounts can NEVER read `answerKeys`.
- **Trusted Server-Only Quiz Scoring (`quizAttempts/{attemptId}`)**:
  - Students can only read their own attempts (`resource.data.userId == request.auth.uid`), and admins can read all attempts.
  - All direct client writes (`create`, `update`, `delete`) to `quizAttempts` are denied (`if false`). Attempts are calculated against private `answerKeys` and persisted exclusively by the App Check–enforced `submitEduAIQuiz` Cloud Function (`functions/index.js`).
  - Admin custom claims (`request.auth.token.admin == true`) are assigned exclusively by a trusted server; users can never self-escalate to admin via client apps.


