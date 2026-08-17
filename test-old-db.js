import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function extract() {
  try {
    const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
    let data = { site_settings: settingsSnap.exists() ? settingsSnap.data() : null, pages: {} };
    
    const pagesSnap = await getDocs(collection(db, 'pages'));
    pagesSnap.forEach(d => {
      data.pages[d.id] = d.data();
    });
    
    fs.writeFileSync('old_db_dump.json', JSON.stringify(data, null, 2));
    console.log("Successfully dumped old database to old_db_dump.json");
  } catch (e) {
    console.error("Failed to extract:", e);
  }
}
extract();
