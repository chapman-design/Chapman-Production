const fs = require('fs');

let oldData = JSON.parse(fs.readFileSync('old_db_dump.json', 'utf8'));

// If the old DB dump doesn't have the texts we just wrote, we check if they are in the content.json
let contentData = {};
try {
  contentData = JSON.parse(fs.readFileSync('public/data/content.json', 'utf8'));
} catch(e) {}

// Let's create an amalgamation. We want to preserve the image links from oldData 
// (which are in firebasestorage) but if the text is empty or default, we use contentData.

const finalData = oldData.site_settings ? oldData : contentData;

// Let's inject finalData into App.tsx as the new FALLBACK_DATA so the browser just pushes it!
let code = fs.readFileSync('App.tsx', 'utf8');

const fallbackRegex = /const FALLBACK_DATA = \{[\s\S]*?\};\n\nconst App: React\.FC/m;

const replacement = `const FALLBACK_DATA = ${JSON.stringify(finalData, null, 2)};\n\nconst App: React.FC`;

code = code.replace(fallbackRegex, replacement);
fs.writeFileSync('App.tsx', code);
