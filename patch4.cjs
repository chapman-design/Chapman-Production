const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// The last replace didn't take. Let's do it right.
const target = "className={`w-full h-[500px] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}";
const replacement = "className={`w-full aspect-[4/3] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}";

code = code.replace(target, replacement);

fs.writeFileSync('components/SectionRenderer.tsx', code);
