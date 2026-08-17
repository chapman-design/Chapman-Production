const fs = require('fs');
const data = JSON.parse(fs.readFileSync('old_db_dump.json', 'utf8'));

Object.keys(data.pages).forEach(pageId => {
  const page = data.pages[pageId];
  console.log(`\n========================================`);
  console.log(`PAGE: ${page.title} (${pageId})`);
  console.log(`========================================`);
  
  if (page.sections && page.sections.length > 0) {
    page.sections.forEach((sec, idx) => {
      console.log(`\n--- Section ${idx + 1}: ${sec.title || 'Untitled'} ---`);
      if (sec.content) {
        console.log(sec.content.substring(0, 1500) + (sec.content.length > 1500 ? '...' : ''));
      } else {
        console.log('(No text content)');
      }
    });
  } else {
    console.log('(No sections)');
  }
});
