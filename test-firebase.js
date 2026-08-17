import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

async function test() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'main'));
    console.log("Success! Document exists?", snap.exists());
  } catch (e) {
    console.error("Failed:", e);
  }
}
test();
