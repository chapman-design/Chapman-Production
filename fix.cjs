const fs = require('fs');
let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// The replacement script accidentally added two closing braces. Let's fix it by carefully replacing the duplicate block.
const duplicate = `          </div>
         )}
         )}`;
code = code.replace(duplicate, `          </div>
         )}`);
         
fs.writeFileSync('components/SectionRenderer.tsx', code);
