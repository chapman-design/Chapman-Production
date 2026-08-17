const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// A highly aggressive string replacement to nuke exactly the syntax error shown in the compiler trace
code = code.replace(`            </ReactMarkdown>
            )}
          </div>`, `            </ReactMarkdown>
          </div>`);

fs.writeFileSync('components/SectionRenderer.tsx', code);
