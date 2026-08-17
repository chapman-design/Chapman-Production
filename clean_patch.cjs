const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// The file is currently broken with extra curly braces. Let's fix it by carefully removing them.
code = code.replace(`        )}
        )}`, `        )}`);
        
code = code.replace(`          )})}
        </div>`, `          )}
        </div>`);
        
fs.writeFileSync('components/SectionRenderer.tsx', code);
