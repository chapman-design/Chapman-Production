const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = `if (settingsSnap.exists()) {`;
const replacement = `if (settingsSnap.exists()) {`;

const elseTarget = `          try {
            localStorage.setItem('cda_site_data', JSON.stringify(fullData));
          } catch (e) {}
          setLoading(false);
          return;
        }`;

const elseReplacement = `          try {
            localStorage.setItem('cda_site_data', JSON.stringify(fullData));
          } catch (e) {}
          setLoading(false);
          return;
        } else {
          // Database is connected but empty. Fallback immediately to defaults so admin can be accessed to save.
          setSiteData(FALLBACK_DATA);
          setLoading(false);
          return;
        }`;

code = code.replace(elseTarget, elseReplacement);
fs.writeFileSync('App.tsx', code);
