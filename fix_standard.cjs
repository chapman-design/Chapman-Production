const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// The standard section got corrupted in the previous sed attempts. Let's fix those last brackets.
code = code.replace(`            />
            )}
        </div>
        )}`, `            />
          </div>
        )}`);
        
code = code.replace(`          </ReactMarkdown>
            )}
        </div>`, `          </ReactMarkdown>
        </div>`);

fs.writeFileSync('components/SectionRenderer.tsx', code);
