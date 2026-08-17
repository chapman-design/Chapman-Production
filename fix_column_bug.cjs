const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// I completely understand what's happening now. The entire layout was designed around the assumption that there is ALWAYS an image.
// When there is NO image, the "text container" still believes it is only supposed to take up 50% of the screen width (lg:w-1/2), leaving the other 50% completely empty!
// The "left/right" alternating logic was also flipping the text container between the left side of the screen and the right side of the screen, even when the other half was empty.

// Let's completely nuke the flex-row layout if there is no image.

// 1. Remove the alternating flex-row direction if there is no image
code = code.replace(
  "className={`flex flex-col ${!section.image ? '' : isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 mb-24 items-center ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''}`}",
  "className={`flex flex-col ${!section.image ? '' : isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 mb-24 ${!section.image ? 'items-start' : 'items-center'} ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''}`}"
);

// 2. Fix the width of the text container. It should be w-full and max-w-4xl if there is no image.
code = code.replace(
  `<div className={\`w-full \${section.image ? 'lg:w-1/2' : 'max-w-4xl mx-auto'} space-y-6\`}>`,
  `<div className={\`w-full \${section.image ? 'lg:w-1/2' : 'max-w-4xl'} space-y-6\`}>`
);

fs.writeFileSync('components/SectionRenderer.tsx', code);
