const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// The issue in the screenshots is that the flex container switches from col (mobile) to row (desktop) at 'md' (768px). 
// When it switches to row at exactly 768px, the two columns share the space, but because there isn't enough horizontal room yet, the 4:3 aspect ratio forces the image to shrink heavily, causing it to look squished on intermediate (tablet-sized) screens like iPads in portrait mode.
// Let's change the breakpoint for the side-by-side layout from 'md' (768px) to 'lg' (1024px) so it stays in a nice, large single column until there is actually enough room for the side-by-side layout to breathe.

let target = "className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 mb-24 items-center ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 md:-mx-20 md:px-20 rounded-sm' : ''}`}";
let replacement = "className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 mb-24 items-center ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''}`}";
code = code.replace(target, replacement);

target = `className="w-full md:w-1/2 overflow-hidden shrink-0"`;
replacement = `className="w-full lg:w-1/2 overflow-hidden shrink-0"`;
code = code.replace(target, replacement);

target = `className="w-full md:w-1/2 space-y-6"`;
replacement = `className="w-full lg:w-1/2 space-y-6"`;
code = code.replace(target, replacement);

target = "className={`w-full aspect-[4/3] md:aspect-auto md:h-[600px] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}";
replacement = "className={`w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}";
code = code.replace(target, replacement);

fs.writeFileSync('components/SectionRenderer.tsx', code);
