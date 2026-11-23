/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocFromServer, setDoc, updateDoc, collection, onSnapshot, query, where, orderBy, limit, getDocs, deleteDoc, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import { getMessaging, isSupported as isMessagingSupported } from 'firebase/messaging';

// Safe Firebase configuration with fallback for production/CI builds (e.g. Netlify)
const defaultConfig = {
  projectId: "pristine-sun-1mbw7",
  appId: "1:912169594730:web:5985a6702fa7857c9e3f13",
  apiKey: "AIzaSyBy12ugLlOKfTQj6aSgxoEM624wp_L81RI",
  authDomain: "pristine-sun-1mbw7.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-eduai-9a897363-82ee-48f1-9432-f8f74e565621",
  storageBucket: "pristine-sun-1mbw7.firebasestorage.app",
  messagingSenderId: "912169594730",
  measurementId: "",
  oAuthClientId: "912169594730-k86dhlkga0p8pojlljg3dcf3dijggsdh.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const meta = import.meta as unknown as {
  glob: (pattern: string, options?: { eager?: boolean }) => Record<string, { default: Partial<typeof defaultConfig> }>;
  env: Record<string, string | undefined>;
};

const globMatches = meta.glob ? meta.glob('../../firebase-applet-config.json', { eager: true }) : {};
const loadedJson: Partial<typeof defaultConfig> = globMatches['../../firebase-applet-config.json']?.default || {};
const envVars = meta.env || {};

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY || loadedJson.apiKey || defaultConfig.apiKey,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN || loadedJson.authDomain || defaultConfig.authDomain,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID || loadedJson.projectId || defaultConfig.projectId,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET || loadedJson.storageBucket || defaultConfig.storageBucket,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID || loadedJson.messagingSenderId || defaultConfig.messagingSenderId,
  appId: envVars.VITE_FIREBASE_APP_ID || loadedJson.appId || defaultConfig.appId,
  measurementId: envVars.VITE_FIREBASE_MEASUREMENT_ID || loadedJson.measurementId || defaultConfig.measurementId,
  firestoreDatabaseId: envVars.VITE_FIREBASE_DATABASE_ID || loadedJson.firestoreDatabaseId || defaultConfig.firestoreDatabaseId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

let cachedFunctions: Functions | null = null;
export function getFirebaseFunctions(region = 'us-central1'): Functions {
  if (!cachedFunctions) {
    cachedFunctions = getFunctions(app, region);
  }
  return cachedFunctions;
}

export async function callCloudFunction<TRequest, TResponse>(
  name: string,
  payload: TRequest,
  region = 'us-central1'
): Promise<TResponse> {
  try {
    const fns = getFirebaseFunctions(region);
    const callable = httpsCallable<TRequest, TResponse>(fns, name);
    const result = await callable(payload);
    return result.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes('Service functions is not available')) {
      throw err;
    }

    // Fallback to Firebase Callable HTTPS protocol if modular Functions service failed to register
    const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    const url = `https://${region}-${firebaseConfig.projectId}.cloudfunctions.net/${encodeURIComponent(name)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({ data: payload }),
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok || json?.error) {
      throw new Error(json?.error?.message || `Cloud Function "${name}" failed (${response.status})`);
    }
    return (json?.result ?? json?.data) as TResponse;
  }
}

export const googleProvider = new GoogleAuthProvider();

async function testConnection() {
  if (typeof window === 'undefined') return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  httpsCallable,
  getMessaging,
  isMessagingSupported,
};

export type { FirebaseUser };

