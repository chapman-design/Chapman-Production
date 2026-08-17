const fs = require('fs');
let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// We need to conditionally hide the image container entirely if there is no image
const targetImageContainer = `<div className="w-full lg:w-1/2 overflow-hidden shrink-0">`;
const replacementImageContainer = `{section.image && (
          <div className="w-full lg:w-1/2 overflow-hidden shrink-0">`;
code = code.replace(targetImageContainer, replacementImageContainer);

const targetImageEnd = `</div>`;
// We'll replace the first </div> after the image tag with `</div>)}` using regex
code = code.replace(/<img[^>]*>[\s\S]*?<\/div>/, match => match + `\n        )}`);

fs.writeFileSync('components/SectionRenderer.tsx', code);
