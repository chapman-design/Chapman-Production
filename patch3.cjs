const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

const target1 = `className=\`w-full h-[500px] object-cover shadow-sm hybrid-bloom-image \${shouldBloom ? 'in-view' : ''}\``;
const replace1 = `className=\`w-full aspect-[4/3] md:aspect-auto md:h-[600px] object-cover shadow-sm hybrid-bloom-image \${shouldBloom ? 'in-view' : ''}\``;

code = code.replace(target1, replace1);

fs.writeFileSync('components/SectionRenderer.tsx', code);
