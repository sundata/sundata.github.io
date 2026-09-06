import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhGCzphCVVSqsGQe-eK-6u4ebvaUc-Ce8",
  authDomain: "sundata-tools.firebaseapp.com",
  projectId: "sundata-tools",
  storageBucket: "sundata-tools.firebasestorage.app",
  messagingSenderId: "365890802450",
  appId: "1:365890802450:web:f323c88c02ed99e8e999cb",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let authPromise;

export function ensureAnonymousUser() {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  if (!authPromise) {
    authPromise = new Promise((resolve, reject) => {
      const stop = onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            stop();
            resolve(user);
            return;
          }
          try {
            const credential = await signInAnonymously(auth);
            stop();
            resolve(credential.user);
          } catch (error) {
            stop();
            authPromise = undefined;
            reject(error);
          }
        },
        reject,
      );
    });
  }
  return authPromise;
}
