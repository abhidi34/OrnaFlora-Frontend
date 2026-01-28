// Minimal Firebase configuration.
// 1) Install Firebase: `npm install firebase`
// 2) Add env vars in a .env file at project root (REACT_APP_FIREBASE_*):
//    REACT_APP_FIREBASE_API_KEY=...
//    REACT_APP_FIREBASE_AUTH_DOMAIN=...
//    REACT_APP_FIREBASE_PROJECT_ID=...
//    REACT_APP_FIREBASE_APP_ID=...

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || ''
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // ignore if already initialized in some environments
}

const auth = getAuth();

export default auth;
