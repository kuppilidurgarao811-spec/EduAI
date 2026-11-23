import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const config = {
  projectId: "pristine-sun-1mbw7",
  appId: "1:912169594730:web:5985a6702fa7857c9e3f13",
  apiKey: "AIzaSyBy12ugLlOKfTQj6aSgxoEM624wp_L81RI",
  authDomain: "pristine-sun-1mbw7.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-eduai-9a897363-82ee-48f1-9432-f8f74e565621",
  storageBucket: "pristine-sun-1mbw7.firebasestorage.app",
};

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function runTestSeed() {
  console.log('Seeding Test Data for Step 16...');

  // 1. Subject: ML001
  const subjectRef = doc(db, 'subjects', 'ML001');
  await setDoc(subjectRef, {
    id: 'ML001',
    name: 'Machine Learning',
    code: 'CSML501',
    educationLevel: 'Degree',
    course: 'B.Sc Computer Science',
    semester: 5,
    chaptersCount: 1,
    createdAt: serverTimestamp(),
  }, { merge: true });
  console.log('✅ Subject ML001 created/updated');

  // 2. Chapter: CH001
  const chapterRef = doc(db, 'chapters', 'CH001');
  await setDoc(chapterRef, {
    id: 'CH001',
    subjectId: 'ML001',
    title: 'Linear Regression',
    description: 'Foundations of Ordinary Least Squares regression',
    order: 1,
    isActive: true,
    createdAt: serverTimestamp(),
  }, { merge: true });
  console.log('✅ Chapter CH001 created/updated');

  // 3. Lesson: LES001 (existing published test lesson)
  const lessonRef = doc(db, 'lessons', 'LES001');
  const pdfDownloadUrl = 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2FLES001%2Fpdf%2Flesson.pdf?alt=media';
  const lesVideoDownloadUrl = 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2FLES001%2Fvideo%2Flesson.mp4?alt=media';

  await setDoc(lessonRef, {
    id: 'LES001',
    chapterId: 'CH001',
    subjectId: 'ML001',
    title: 'Simple Linear Regression',
    description: 'Introduction to simple regression modeling',
    content: 'Linear regression is a foundational statistical model used to learn the relationship between features and target outcomes.',
    pdfUrl: pdfDownloadUrl,
    pdfPath: 'lessons/ML001/CH001/LES001/pdf/lesson.pdf',
    pdfName: 'Simple_Linear_Regression.pdf',
    videoUrl: lesVideoDownloadUrl,
    videoPath: 'lessons/ML001/CH001/LES001/video/lesson.mp4',
    order: 1,
    isActive: true,
    isPublished: true,
    createdAt: serverTimestamp(),
  }, { merge: true });
  console.log('✅ Lesson LES001 updated with videoUrl & videoPath');

  // 4. Lesson: lesson001 (canonical Video LMS schema)
  const lesson001Ref = doc(db, 'lessons', 'lesson001');
  const lesson001PdfUrl = 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fpdf%2Flesson.pdf?alt=media';
  const lesson001VideoUrl = 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fvideo%2Flesson.mp4?alt=media';

  await setDoc(lesson001Ref, {
    id: 'lesson001',
    subjectId: 'ML001',
    chapterId: 'CH001',
    title: 'Simple Linear Regression',
    description: 'Introduction to simple regression modeling with video lecture',
    content: 'Linear regression is a foundational statistical model used to learn the relationship between features and target outcomes.',
    pdfUrl: lesson001PdfUrl,
    pdfPath: 'lessons/ML001/CH001/lesson001/pdf/lesson.pdf',
    videoUrl: lesson001VideoUrl,
    videoPath: 'lessons/ML001/CH001/lesson001/video/lesson.mp4',
    order: 2,
    isActive: true,
    isPublished: false,
    createdAt: serverTimestamp(),
  }, { merge: true });
  console.log('✅ Lesson lesson001 created/updated with videoUrl & videoPath');

  // Verify reads
  const sSnap = await getDoc(subjectRef);
  const cSnap = await getDoc(chapterRef);
  const lSnap = await getDoc(lessonRef);
  const l001Snap = await getDoc(lesson001Ref);

  console.log('\n--- VERIFICATION RESULT ---');
  console.log('Subject ML001 exists:', sSnap.exists(), sSnap.data()?.name);
  console.log('Chapter CH001 exists:', cSnap.exists(), cSnap.data()?.title);
  console.log('Lesson LES001 exists:', lSnap.exists(), {
    title: lSnap.data()?.title,
    chapterId: lSnap.data()?.chapterId,
    pdfUrl: lSnap.data()?.pdfUrl,
    videoUrl: lSnap.data()?.videoUrl,
    videoPath: lSnap.data()?.videoPath,
    isActive: lSnap.data()?.isActive,
    isPublished: lSnap.data()?.isPublished,
  });
  console.log('Lesson lesson001 exists:', l001Snap.exists(), {
    id: l001Snap.data()?.id,
    subjectId: l001Snap.data()?.subjectId,
    chapterId: l001Snap.data()?.chapterId,
    title: l001Snap.data()?.title,
    pdfUrl: l001Snap.data()?.pdfUrl,
    videoUrl: l001Snap.data()?.videoUrl,
    videoPath: l001Snap.data()?.videoPath,
    isActive: l001Snap.data()?.isActive,
    isPublished: l001Snap.data()?.isPublished,
  });
}

runTestSeed().then(() => {
  console.log('\n🎉 Step 16 test process completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error('Seed test encountered error:', err);
  process.exit(1);
});
