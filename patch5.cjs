const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// The issue is the combination of flex-col on mobile and how Tailwind handles aspect ratios inside flex blocks without an explicit width constraint or flex-shrink.
// Let's add shrink-0 to the image container, or just force the image to be fully responsive.
const target = `className="w-full md:w-1/2 overflow-hidden"`;
const replacement = `className="w-full md:w-1/2 overflow-hidden shrink-0"`;

code = code.replace(target, replacement);

fs.writeFileSync('components/SectionRenderer.tsx', code);
