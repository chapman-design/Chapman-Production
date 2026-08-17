const fs = require('fs');
let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

const target = "className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 mb-24 items-center ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''}`}";
const replacement = "className={`flex flex-col ${!section.image ? '' : isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 mb-24 items-center ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''}`}";
code = code.replace(target, replacement);

fs.writeFileSync('components/SectionRenderer.tsx', code);
