// Firebase configuration
// ─────────────────────────────────────────────────────────────────
// STEP (after UI is confirmed working):
//   1. Go to https://console.firebase.google.com
//   2. Create a new project called "CampusConnect"
//   3. Add a Web app → copy the firebaseConfig object below
//   4. Enable Authentication → Google provider + Email/Password provider
//   5. Replace the placeholder values below with your real config
// ─────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID',
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
