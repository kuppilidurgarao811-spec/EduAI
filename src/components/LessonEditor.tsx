import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  FileText,
  Video,
  Image as ImageIcon,
  Save,
  Send,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Eye,
  Trash2,
  ArrowRight,
  Database,
  HardDrive,
  FolderTree,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db, setDoc, updateDoc, doc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  buildLessonPdfPath,
  buildLessonVideoPath,
  uploadLessonPdfAtPath,
  uploadLessonVideoAtPath,
  uploadLessonImage,
  deleteLessonMediaAtPath,
} from '../lib/firebaseStorage';

interface LessonEditorProps {
  initialSubject?: string;
  initialChapter?: string;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  initialSubject,
  initialChapter,
}) => {
  const { user, courses } = useAuth();

  // Selection states
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'Machine Learning');
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapter || 'Linear Regression');

  // Form Fields
  const [lessonTitle, setLessonTitle] = useState<string>('Simple Linear Regression');
  const [shortDescription, setShortDescription] = useState<string>(
    'Learn the basics of slope, y-intercept, line of best fit, and residual sum of squares.'
  );
  const [lessonContent, setLessonContent] = useState<string>(
`# Simple Linear Regression

Simple Linear Regression is a fundamental statistical method that allows us to summarize and study relationships between two continuous (quantitative) variables:

- **Independent variable ($X$)**: The predictor or explanatory variable.
- **Dependent variable ($Y$)**: The response or outcome variable.

### Mathematical Formulation
The regression equation is represented as:
$$Y = \\beta_0 + \\beta_1X + \\varepsilon$$

Where:
- $\\beta_0$ is the Y-intercept
- $\\beta_1$ is the slope coefficient
- $\\varepsilon$ is the random error term

### Ordinary Least Squares (OLS)
We determine $\\beta_0$ and $\\beta_1$ by minimizing the sum of squared differences (residuals) between observed and predicted values:
$$SSR = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2$$`
  );

  const [lessonId, setLessonId] = useState<string>('lesson001');

  // Media attachments with Storage metadata
  const [pdfAttachment, setPdfAttachment] = useState<{
    name: string;
    size: string;
    url: string;
    storagePath?: string;
  } | null>({
    name: 'lesson.pdf',
    size: '2.4 MB',
    url: 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fpdf%2Flesson.pdf?alt=media',
    storagePath: 'lessons/ML001/CH001/lesson001/pdf/lesson.pdf',
  });

  const [videoAttachment, setVideoAttachment] = useState<{
    name: string;
    duration: string;
    url: string;
    storagePath?: string;
  } | null>({
    name: 'lesson.mp4',
    duration: '22:15 mins',
    url: 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fvideo%2Flesson.mp4?alt=media',
    storagePath: 'lessons/ML001/CH001/lesson001/video/lesson.mp4',
  });

  const [thumbnailAttachment, setThumbnailAttachment] = useState<{
    url: string;
    storagePath?: string;
  } | null>(null);

  const [order, setOrder] = useState<number>(1);

  // Upload progress states
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState<number | null>(null);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isDeletingUpload, setIsDeletingUpload] = useState<boolean>(false);
  const [lastUpload, setLastUpload] = useState<{
    mediaType: 'pdf' | 'video' | 'thumbnail';
    fileName: string;
    storagePath: string;
    lessonId: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'draft'; text: string } | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Sample Subjects & Chapters
  const availableSubjects = [
    'Machine Learning',
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Artificial Intelligence',
    'Computer Networks',
    'Operating Systems',
  ];

  const availableChapters: Record<string, string[]> = {
    'Machine Learning': [
      'Introduction to Machine Learning',
      'Linear Regression',
      'Logistic Regression',
      'Decision Trees',
      'K-Means Clustering',
      'Neural Networks & Deep Learning',
    ],
    'Data Structures & Algorithms': ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming'],
    'Database Management Systems': ['ER Diagrams', 'Relational Algebra', 'SQL Queries & Joins', 'Normalization'],
    'Artificial Intelligence': ['Search Algorithms', 'Knowledge Representation', 'Game Playing', 'Expert Systems'],
    'Computer Networks': ['OSI Model', 'TCP/IP Architecture', 'Routing Protocols', 'Network Security'],
    'Operating Systems': ['Process Scheduling', 'Deadlocks', 'Memory Management', 'File Systems'],
  };

  const resolveSubjectId = () =>
    selectedSubject === 'Machine Learning'
      ? 'ML001'
      : selectedSubject.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

  const resolveChapterId = () =>
    selectedChapter === 'Linear Regression'
      ? 'CH001'
      : selectedChapter.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

  const reportErrorSafely = (err: unknown, op: OperationType, path: string): string => {
    try {
      handleFirestoreError(err, op, path);
    } catch (wrappedErr: unknown) {
      if (wrappedErr instanceof Error) {
        try {
          const parsed = JSON.parse(wrappedErr.message);
          return parsed.error || 'Firestore permission or network error.';
        } catch {
          return wrappedErr.message;
        }
      }
    }
    return err instanceof Error ? err.message : 'Unexpected Firestore error.';
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    const targetLessonId = lessonId.trim() || `draft-${Date.now()}`;
    try {
      const subjectId = resolveSubjectId();
      const chapterId = resolveChapterId();
      const resolvedPdfPath =
        pdfAttachment?.storagePath ||
        (pdfAttachment?.url ? buildLessonPdfPath(subjectId, chapterId, targetLessonId) : null);
      const resolvedVideoPath =
        videoAttachment?.storagePath ||
        (videoAttachment?.url ? buildLessonVideoPath(subjectId, chapterId, targetLessonId) : null);

      // Firestore ONLY stores metadata, URLs and paths. Binary files remain in Firebase Storage!
      const payload = {
        id: targetLessonId,
        subjectId: subjectId,
        subjectTitle: selectedSubject,
        chapterId: chapterId,
        chapterTitle: selectedChapter,
        title: lessonTitle,
        description: shortDescription,
        content: lessonContent,
        pdfUrl: pdfAttachment?.url || null,
        pdfName: pdfAttachment?.name || null,
        pdfPath: resolvedPdfPath,
        pdfStoragePath: resolvedPdfPath,
        videoUrl: videoAttachment?.url || null,
        videoName: videoAttachment?.name || null,
        videoPath: resolvedVideoPath,
        videoStoragePath: resolvedVideoPath,
        thumbnailUrl: thumbnailAttachment?.url || null,
        thumbnailStoragePath: thumbnailAttachment?.storagePath || null,
        order: Number(order) || 1,
        isActive: true,
        isPublished: false,
        status: 'draft',
        updatedAt: serverTimestamp(),
        authorEmail: user?.email || 'admin@eduai.edu',
      };

      await setDoc(doc(db, 'lessons', targetLessonId), payload, { merge: true });

      setStatusMessage({
        type: 'draft',
        text: `💾 Draft metadata saved to Firestore (lessons/${targetLessonId}) with videoPath "${resolvedVideoPath || 'unset'}".`,
      });
    } catch (err) {
      const errMsg = reportErrorSafely(err, OperationType.WRITE, `lessons/${targetLessonId}`);
      setStatusMessage({
        type: 'error',
        text: `Error saving draft: ${errMsg}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid lesson title before publishing.' });
      return;
    }

    setIsPublishing(true);
    setStatusMessage(null);
    const targetLessonId = lessonId.trim() || `les-${Date.now()}`;
    try {
      const subjectId = resolveSubjectId();
      const chapterId = resolveChapterId();
      const resolvedPdfPath =
        pdfAttachment?.storagePath ||
        (pdfAttachment?.url ? buildLessonPdfPath(subjectId, chapterId, targetLessonId) : null);
      const resolvedVideoPath =
        videoAttachment?.storagePath ||
        (videoAttachment?.url ? buildLessonVideoPath(subjectId, chapterId, targetLessonId) : null);

      // Firestore stores lightweight metadata and Firebase Storage downloadURLs + paths
      const payload = {
        id: targetLessonId,
        subjectId: subjectId,
        subjectTitle: selectedSubject,
        chapterId: chapterId,
        chapterTitle: selectedChapter,
        title: lessonTitle,
        description: shortDescription,
        content: lessonContent,
        pdfUrl: pdfAttachment?.url || null,
        pdfName: pdfAttachment?.name || null,
        pdfPath: resolvedPdfPath,
        pdfStoragePath: resolvedPdfPath,
        videoUrl: videoAttachment?.url || null,
        videoName: videoAttachment?.name || null,
        videoPath: resolvedVideoPath,
        videoStoragePath: resolvedVideoPath,
        thumbnailUrl: thumbnailAttachment?.url || null,
        thumbnailStoragePath: thumbnailAttachment?.storagePath || null,
        order: Number(order) || 1,
        isActive: true,
        isPublished: true,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authorEmail: user?.email || 'admin@eduai.edu',
      };

      await setDoc(doc(db, 'lessons', targetLessonId), payload, { merge: true });

      setStatusMessage({
        type: 'success',
        text: `🚀 Lesson "${lessonTitle}" published live! Firestore holds pdfUrl, videoUrl, and videoPath; Firebase Storage hosts PDFs & Videos.`,
      });
    } catch (err: any) {
      const errMsg = reportErrorSafely(err, OperationType.WRITE, `lessons/${targetLessonId}`);
      setStatusMessage({
        type: 'error',
        text: `Firestore Publish Error: ${errMsg}`,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Upload to Firebase Storage: lessons/{subjectId}/{chapterId}/{lessonId}/pdf/lesson.pdf
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const subjectId = resolveSubjectId();
    const chapterId = resolveChapterId();
    const targetLessonId = lessonId.trim() || 'lesson001';

    setPdfUploadProgress(10);
    try {
      const result = await uploadLessonPdfAtPath(
        subjectId,
        chapterId,
        targetLessonId,
        file,
        pdfAttachment?.storagePath,
        (p) => {
          setPdfUploadProgress(p);
        }
      );

      setPdfAttachment({
        name: file.name,
        size: result.sizeFormatted,
        url: result.downloadUrl,
        storagePath: result.storagePath,
      });
      setLastUpload({
        mediaType: 'pdf',
        fileName: file.name,
        storagePath: result.storagePath,
        lessonId: targetLessonId,
      });
    } catch (err) {
      console.error('PDF upload failure:', err);
    } finally {
      setTimeout(() => setPdfUploadProgress(null), 1200);
    }
  };

  // Upload to Firebase Storage: lessons/{subjectId}/{chapterId}/{lessonId}/video/lesson.mp4
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const subjectId = resolveSubjectId();
    const chapterId = resolveChapterId();
    const targetLessonId = lessonId.trim() || 'lesson001';

    setVideoUploadProgress(10);
    try {
      const result = await uploadLessonVideoAtPath(
        subjectId,
        chapterId,
        targetLessonId,
        file,
        videoAttachment?.storagePath,
        (p) => {
          setVideoUploadProgress(p);
        }
      );

      setVideoAttachment({
        name: file.name,
        duration: `${result.sizeFormatted} (Storage Upload)`,
        url: result.downloadUrl,
        storagePath: result.storagePath,
      });
      setLastUpload({
        mediaType: 'video',
        fileName: file.name,
        storagePath: result.storagePath,
        lessonId: targetLessonId,
      });
    } catch (err) {
      console.error('Video upload failure:', err);
    } finally {
      setTimeout(() => setVideoUploadProgress(null), 1200);
    }
  };

  // Upload to Firebase Storage: lessons/{subjectId}/{chapterId}/images/{filename}
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetLessonId = lessonId.trim() || 'lesson001';
    setThumbnailUploadProgress(10);
    try {
      const result = await uploadLessonImage(selectedSubject, selectedChapter, file, (p) => {
        setThumbnailUploadProgress(p);
      });

      setThumbnailAttachment({
        url: result.downloadUrl,
        storagePath: result.storagePath,
      });
      setLastUpload({
        mediaType: 'thumbnail',
        fileName: file.name,
        storagePath: result.storagePath,
        lessonId: targetLessonId,
      });
    } catch (err) {
      console.error('Thumbnail upload failure:', err);
    } finally {
      setTimeout(() => setThumbnailUploadProgress(null), 1200);
    }
  };

  // Delete an uploaded attachment from Firebase Storage and update Firestore document
  const handleDeleteAttachedMedia = async (
    mediaType: 'pdf' | 'video' | 'thumbnail',
    explicitPath?: string
  ) => {
    const targetLessonId = lessonId.trim() || 'lesson001';
    const storagePath =
      explicitPath ||
      (mediaType === 'pdf'
        ? pdfAttachment?.storagePath
        : mediaType === 'video'
        ? videoAttachment?.storagePath
        : thumbnailAttachment?.storagePath);

    setIsDeletingUpload(true);
    try {
      if (auth.currentUser && storagePath) {
        try {
          await deleteLessonMediaAtPath(storagePath);
        } catch (storageErr: any) {
          if (storageErr?.code === 'storage/unauthorized') {
            setStatusMessage({
              type: 'error',
              text: `Firebase Storage denied deleting "${storagePath}" (admin permissions required).`,
            });
            return;
          }
          console.warn('Storage cleanup notice:', storageErr);
        }
      }

      let firestoreUpdated = false;
      if (auth.currentUser && targetLessonId) {
        const updatePayload =
          mediaType === 'pdf'
            ? {
                pdfUrl: '',
                pdfName: '',
                pdfPath: '',
                pdfStoragePath: '',
                updatedAt: serverTimestamp(),
              }
            : mediaType === 'video'
            ? {
                videoUrl: '',
                videoName: '',
                videoPath: '',
                videoStoragePath: '',
                updatedAt: serverTimestamp(),
              }
            : {
                thumbnailUrl: '',
                thumbnailStoragePath: '',
                updatedAt: serverTimestamp(),
              };

        try {
          await updateDoc(doc(db, 'lessons', targetLessonId), updatePayload);
          firestoreUpdated = true;
        } catch (dbErr: any) {
          if (dbErr?.code !== 'not-found') {
            const errMsg = reportErrorSafely(dbErr, OperationType.UPDATE, `lessons/${targetLessonId}`);
            setStatusMessage({
              type: 'error',
              text: `Firestore update failed: ${errMsg}`,
            });
            return;
          }
        }
      }

      if (mediaType === 'pdf') setPdfAttachment(null);
      else if (mediaType === 'video') setVideoAttachment(null);
      else setThumbnailAttachment(null);

      if (lastUpload?.mediaType === mediaType) {
        setLastUpload(null);
      }

      setStatusMessage({
        type: 'success',
        text: firestoreUpdated
          ? `🗑️ Deleted ${mediaType.toUpperCase()} upload (${storagePath || targetLessonId}) and updated Firestore lessons/${targetLessonId}.`
          : `🗑️ Cleared ${mediaType.toUpperCase()} upload (${storagePath || 'attachment'}).`,
      });
    } finally {
      setIsDeletingUpload(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-[10px] font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3 text-amber-400" /> Primary Admin Screen
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-cyan-300" /> Firebase Storage Active
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Lesson Editor — Create & Publish</h1>
          <p className="text-xs text-indigo-200">
            Firestore stores metadata & URLs • Firebase Storage hosts actual PDF, Video, and Image files.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
            previewMode
              ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
              : 'bg-white/10 text-indigo-100 hover:bg-white/20'
          }`}
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>{previewMode ? 'Exit Student Preview' : 'Student Live Preview'}</span>
        </button>
      </div>

      {/* Storage Architecture Callout */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <FolderTree className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-indigo-950 dark:text-indigo-100">
              Firebase Storage Directory Hierarchy:
            </p>
            <p className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
              Storage ➔ lessons / <span className="font-bold">{resolveSubjectId()}</span> / <span className="font-bold">{resolveChapterId()}</span> / <span className="font-bold">{lessonId || 'lesson001'}</span> / (pdf/lesson.pdf | video/lesson.mp4)
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-[10px] font-black text-indigo-800 dark:text-indigo-200 shrink-0 self-start md:self-auto">
          No Large Blobs in Firestore
        </span>
      </div>

      {/* Status Alerts */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-start gap-3 shadow-md ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : statusMessage.type === 'draft'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' || statusMessage.type === 'draft' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p>{statusMessage.text}</p>
          </div>
        </div>
      )}

      {/* ╔════════════════════════════════════╗
          ║          CREATE LESSON             ║
          ╚════════════════════════════════════╝ */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-xl space-y-7">
        {/* Frame Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                CREATE LESSON
              </h2>
              <p className="text-[11px] text-slate-500 font-bold">Standardized Lesson Publishing Form</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black">
            Order Index: #{order}
          </span>
        </div>

        {previewMode ? (
          /* Student Live Preview Box */
          <div className="space-y-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-900">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                  {selectedSubject} ➔ {selectedChapter}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {lessonTitle || 'Untitled Lesson'}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                Lesson #{order}
              </span>
            </div>

            {thumbnailAttachment?.url && (
              <div className="relative rounded-2xl overflow-hidden aspect-video max-h-64 border border-slate-200 dark:border-slate-700">
                <img
                  src={thumbnailAttachment.url}
                  alt={lessonTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-indigo-500 pl-3">
              "{shortDescription}"
            </p>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
              {lessonContent}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {pdfAttachment && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{pdfAttachment.name}</p>
                      <p className="text-[10px] text-slate-500">{pdfAttachment.size}</p>
                    </div>
                  </div>
                  <a
                    href={pdfAttachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-emerald-600 hover:underline shrink-0 ml-2"
                  >
                    Download PDF
                  </a>
                </div>
              )}

              {videoAttachment && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Video className="w-5 h-5 text-rose-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{videoAttachment.name}</p>
                      <p className="text-[10px] text-slate-500">{videoAttachment.duration}</p>
                    </div>
                  </div>
                  <a
                    href={videoAttachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-rose-600 hover:underline shrink-0 ml-2"
                  >
                    Watch Lecture
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-6">
            {/* Subject Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Subject
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    const chapters = availableChapters[e.target.value] || [];
                    if (chapters.length > 0) setSelectedChapter(chapters[0]);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Chapter
              </label>
              <div className="relative">
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                >
                  {(availableChapters[selectedSubject] || ['Default Chapter']).map((chap) => (
                    <option key={chap} value={chap}>
                      {chap}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lesson ID & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Lesson ID
                </label>
                <input
                  type="text"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  placeholder="e.g. lesson001"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Simple Linear Regression"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Short Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Learn the basics of..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            {/* Lesson Content Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Lesson Content
                </label>
                <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Supports Markdown & Formulas
                </span>
              </div>
              <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden focus-within:border-indigo-500 transition-all">
                <textarea
                  rows={8}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Write lesson content here..."
                  className="w-full p-4 bg-transparent text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none leading-relaxed resize-y"
                  required
                />
              </div>
            </div>

            {/* Media Uploads Grid with Storage Paths */}
            {lastUpload && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="min-w-0">
                  <span className="font-extrabold text-rose-700 dark:text-rose-300">
                    Last Upload ({lastUpload.mediaType.toUpperCase()}): {lastUpload.fileName}
                  </span>
                  <span className="block font-mono text-[10px] text-rose-600/80 dark:text-rose-400 truncate">
                    {lastUpload.storagePath}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isDeletingUpload}
                  onClick={() => handleDeleteAttachedMedia(lastUpload.mediaType, lastUpload.storagePath)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeletingUpload ? 'Updating Database...' : 'Delete Last Upload & Update DB'}</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 📄 Upload PDF */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>📄 Upload PDF</span>
                  </span>
                  {pdfAttachment && (
                    <button
                      type="button"
                      disabled={isDeletingUpload}
                      onClick={() => handleDeleteAttachedMedia('pdf')}
                      title="Delete PDF upload and update Firebase database"
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {pdfUploadProgress !== null ? (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Storage...
                      </span>
                      <span>{pdfUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 transition-all duration-300"
                        style={{ width: `${pdfUploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : pdfAttachment ? (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{pdfAttachment.name}</p>
                    <p className="text-[10px] text-slate-400">{pdfAttachment.size}</p>
                    {pdfAttachment.storagePath && (
                      <p className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 truncate">
                        📁 {pdfAttachment.storagePath}
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-all">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Choose PDF file</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Saves to pdf/lesson.pdf</span>
                    <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* 🎥 Upload Video */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-600" />
                    <span>🎥 Upload Video</span>
                  </span>
                  {videoAttachment && (
                    <button
                      type="button"
                      disabled={isDeletingUpload}
                      onClick={() => handleDeleteAttachedMedia('video')}
                      title="Delete Video upload and update Firebase database"
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {videoUploadProgress !== null ? (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Video to Storage...
                      </span>
                      <span>{videoUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-1.5 transition-all duration-300"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : videoAttachment ? (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-xs space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{videoAttachment.name}</p>
                    <p className="text-[10px] text-slate-400">{videoAttachment.duration}</p>
                    {videoAttachment.storagePath && (
                      <p className="font-mono text-[9px] text-rose-600 dark:text-rose-400 truncate">
                        📁 {videoAttachment.storagePath}
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-rose-500 cursor-pointer transition-all">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Choose Video file</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Saves to video/lesson.mp4</span>
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* 🖼 Upload Thumbnail */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>🖼 Upload Thumbnail</span>
                  </span>
                  {thumbnailAttachment && (
                    <button
                      type="button"
                      disabled={isDeletingUpload}
                      onClick={() => handleDeleteAttachedMedia('thumbnail')}
                      title="Delete Thumbnail upload and update Firebase database"
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {thumbnailUploadProgress !== null ? (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-600">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Thumbnail...
                      </span>
                      <span>{thumbnailUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 transition-all duration-300"
                        style={{ width: `${thumbnailUploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : thumbnailAttachment?.url ? (
                  <div className="space-y-1">
                    <div className="relative rounded-xl overflow-hidden h-14 border border-slate-200 dark:border-slate-700">
                      <img
                        src={thumbnailAttachment.url}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {thumbnailAttachment.storagePath && (
                      <p className="font-mono text-[9px] text-indigo-600 dark:text-indigo-400 truncate">
                        📁 {thumbnailAttachment.storagePath}
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 cursor-pointer transition-all">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Upload cover image</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Saves to Storage ➔ images/</span>
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Order Field */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Order
              </label>
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-black text-indigo-600 dark:text-indigo-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium">Position in chapter sequence</span>
            </div>

            {/* Action Buttons: [ SAVE DRAFT ] [ PUBLISH ] */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving || isPublishing}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs transition-all flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'SAVING DRAFT...' : 'SAVE DRAFT'}</span>
              </button>

              <button
                type="submit"
                disabled={isSaving || isPublishing}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isPublishing ? 'PUBLISHING...' : 'PUBLISH'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

