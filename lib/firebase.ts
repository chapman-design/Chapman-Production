import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBk68EJpqxADkqVI-5hukAey5-WOKdcqSo",
  authDomain: "chapman-design.firebaseapp.com",
  projectId: "chapman-design",
  storageBucket: "chapman-design.firebasestorage.app",
  messagingSenderId: "993571438590",
  appId: "1:993571438590:web:00370bec90efbafbad0aaf",
  measurementId: "G-KLYL2RJTC9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connectivity check gracefully handles new databases
async function testConnection() {
  try {
    // Just try to connect, if it fails because it's offline we warn
    await getDocFromServer(doc(db, 'settings', 'main'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. Check connection.");
    }
    // We intentionally ignore permission errors because it just means the database is empty/secure
  }
}
testConnection();
