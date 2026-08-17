const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// Currently, the SectionRenderer forces a 50% width even if there is no image.
// Let's ensure that if a section has NO image, the text takes up the full width (or max-w-4xl for readability).

const target = `<div className="w-full lg:w-1/2 space-y-6">`;
const replacement = `<div className={\`w-full \${section.image ? 'lg:w-1/2' : 'max-w-4xl mx-auto'} space-y-6\`}>`;

code = code.replace(target, replacement);

fs.writeFileSync('components/SectionRenderer.tsx', code);
