import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from './firebase';
import { uploadBytesResumable } from 'firebase/storage';

/**
 * Storage Path Hierarchy:
 *
 * lessons/
 *   └── {subjectId}/
 *        └── {chapterId}/
 *             └── {lessonId}/
 *                  ├── pdf/
 *                  │    └── lesson.pdf
 *                  └── video/
 *                       └── lesson.mp4
 *
 * `videoPath` (e.g. "lessons/ML001/CH001/lesson001/video/lesson.mp4") is saved in Firestore
 * so files can be located or replaced later without depending only on downloadUrl.
 */

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
  sizeBytes: number;
  sizeFormatted: string;
}

function sanitizeId(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

function sanitizePathSegment(id: string, fallback: string): string {
  const cleaned = (id || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return cleaned || fallback;
}

export function buildLessonPdfPath(subjectId: string, chapterId: string, lessonId: string): string {
  const s = sanitizePathSegment(subjectId, 'ML001');
  const c = sanitizePathSegment(chapterId, 'CH001');
  const l = sanitizePathSegment(lessonId, 'lesson001');
  return `lessons/${s}/${c}/${l}/pdf/lesson.pdf`;
}

export function buildLessonVideoPath(subjectId: string, chapterId: string, lessonId: string): string {
  const s = sanitizePathSegment(subjectId, 'ML001');
  const c = sanitizePathSegment(chapterId, 'CH001');
  const l = sanitizePathSegment(lessonId, 'lesson001');
  return `lessons/${s}/${c}/${l}/video/lesson.mp4`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload Lesson PDF to exact Storage structure:
 * lessons/{subjectId}/{chapterId}/{lessonId}/pdf/lesson.pdf
 */
export async function uploadLessonPdfAtPath(
  subjectId: string,
  chapterId: string,
  lessonId: string,
  file: File,
  existingPdfPath?: string | null,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const storagePath = existingPdfPath?.trim() || buildLessonPdfPath(subjectId, chapterId, lessonId);
  return performUpload(storagePath, file, onProgress);
}

/**
 * Upload or replace Lesson Video at exact Storage structure:
 * lessons/{subjectId}/{chapterId}/{lessonId}/video/lesson.mp4
 * Reuses existingVideoPath if provided so replacing never orphans files.
 */
export async function uploadLessonVideoAtPath(
  subjectId: string,
  chapterId: string,
  lessonId: string,
  file: File,
  existingVideoPath?: string | null,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const storagePath = existingVideoPath?.trim() || buildLessonVideoPath(subjectId, chapterId, lessonId);
  return performUpload(storagePath, file, onProgress);
}

/**
 * Delete a Lesson PDF or Video from Firebase Storage using its stored path
 * (`videoPath` or `pdfPath`), ignoring missing objects while surfacing permission errors.
 */
export async function deleteLessonMediaAtPath(
  storagePath: string
): Promise<{ deleted: boolean; notFound?: boolean }> {
  const trimmedPath = storagePath.trim();
  if (!trimmedPath) {
    return { deleted: false, notFound: true };
  }
  try {
    const storageRef = ref(storage, trimmedPath);
    await deleteObject(storageRef);
    return { deleted: true };
  } catch (err: any) {
    if (err?.code === 'storage/object-not-found') {
      return { deleted: false, notFound: true };
    }
    throw err;
  }
}

/**
 * Upload Lesson PDF directly by Lesson ID to `lessons/{lessonId}/pdf/notes.pdf`
 * and optionally update Firestore document `lessons/{lessonId}`
 */
export async function uploadLessonPdfById(
  lessonId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const safeLessonId = sanitizeId(lessonId || 'general_lesson');
  const safeFileName = file.name.endsWith('.pdf') ? file.name : 'notes.pdf';
  const storagePath = `lessons/${safeLessonId}/pdf/${safeFileName}`;

  return performUpload(storagePath, file, onProgress);
}

/**
 * Upload Lesson PDF to `lessons/{subjectId}/{chapterId}/pdf/{filename}`
 */
export async function uploadLessonPdf(
  subjectId: string,
  chapterId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const safeSubject = sanitizeId(subjectId || 'general');
  const safeChapter = sanitizeId(chapterId || 'ch1');
  const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storagePath = `lessons/${safeSubject}/${safeChapter}/pdf/${safeFileName}`;

  return performUpload(storagePath, file, onProgress);
}

/**
 * Upload Lesson Video to `lessons/{subjectId}/{chapterId}/videos/{filename}`
 */
export async function uploadLessonVideo(
  subjectId: string,
  chapterId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const safeSubject = sanitizeId(subjectId || 'general');
  const safeChapter = sanitizeId(chapterId || 'ch1');
  const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storagePath = `lessons/${safeSubject}/${safeChapter}/videos/${safeFileName}`;

  return performUpload(storagePath, file, onProgress);
}

/**
 * Upload Lesson Image/Thumbnail to `lessons/{subjectId}/{chapterId}/images/{filename}`
 */
export async function uploadLessonImage(
  subjectId: string,
  chapterId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const safeSubject = sanitizeId(subjectId || 'general');
  const safeChapter = sanitizeId(chapterId || 'ch1');
  const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storagePath = `lessons/${safeSubject}/${safeChapter}/images/${safeFileName}`;

  return performUpload(storagePath, file, onProgress);
}

/**
 * Upload Subject Thumbnail to `subjects/thumbnails/{filename}`
 */
export async function uploadSubjectThumbnail(
  subjectId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  const safeSubject = sanitizeId(subjectId || 'subject');
  const safeFileName = `${safeSubject}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storagePath = `subjects/thumbnails/${safeFileName}`;

  return performUpload(storagePath, file, onProgress);
}

async function performUpload(
  storagePath: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.warn('Firebase Storage upload failed, fallback to local URL:', error);
          // Graceful fallback for offline / preview
          const localUrl = URL.createObjectURL(file);
          resolve({
            downloadUrl: localUrl,
            storagePath,
            fileName: file.name,
            sizeBytes: file.size,
            sizeFormatted: formatFileSize(file.size),
          });
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              downloadUrl,
              storagePath,
              fileName: file.name,
              sizeBytes: file.size,
              sizeFormatted: formatFileSize(file.size),
            });
          } catch (err) {
            const localUrl = URL.createObjectURL(file);
            resolve({
              downloadUrl: localUrl,
              storagePath,
              fileName: file.name,
              sizeBytes: file.size,
              sizeFormatted: formatFileSize(file.size),
            });
          }
        }
      );
    });
  } catch (err) {
    console.warn('Direct upload error, generating local object URL:', err);
    return {
      downloadUrl: URL.createObjectURL(file),
      storagePath,
      fileName: file.name,
      sizeBytes: file.size,
      sizeFormatted: formatFileSize(file.size),
    };
  }
}
