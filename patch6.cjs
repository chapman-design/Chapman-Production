const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// Also update the image class itself to ensure it doesn't get squished
const target = "className={`w-full aspect-[4/3] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}";
const replacement = "className={`w-full aspect-[4/3] md:aspect-auto md:h-[600px] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}";

code = code.replace(target, replacement);

fs.writeFileSync('components/SectionRenderer.tsx', code);
