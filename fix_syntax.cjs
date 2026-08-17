const fs = require('fs');
let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

code = code.replace(`          </div>
         )}
         )}`, `          </div>
         )}`);

fs.writeFileSync('components/SectionRenderer.tsx', code);
