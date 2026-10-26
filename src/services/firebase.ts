import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY            ?? 'PLACEHOLDER',
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? 'placeholder.firebaseapp.com',
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID         ?? 'placeholder',
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? 'placeholder.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID          ?? '000000000000',
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID             ?? '1:000:web:000',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase Auth — use default persistence (in-memory on native, localStorage on web)
let auth: ReturnType<typeof getAuth>;
try {
  if (Platform.OS === 'web') {
    auth = initializeAuth(app, { persistence: browserLocalPersistence });
  } else {
    // On native, getAuth() uses in-memory persistence by default.
    // For production, install @react-native-async-storage/async-storage
    // and use getReactNativePersistence(AsyncStorage).
    auth = initializeAuth(app);
  }
} catch {
  // Already initialized
  auth = getAuth(app) as any;
}

const db = getFirestore(app);

export { app, auth, db };
