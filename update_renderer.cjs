const fs = require('fs');

let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

// Update StandardSection to accept idx
code = code.replace(
`const StandardSection: React.FC<{ 
  section: Section; 
  logoUrl?: string; 
  siteName?: string; 
  hasScrolled: boolean 
}> = ({ section, logoUrl, siteName, hasScrolled }) => {`,
`const StandardSection: React.FC<{ 
  section: Section; 
  idx: number;
  logoUrl?: string; 
  siteName?: string; 
  hasScrolled: boolean 
}> = ({ section, idx, logoUrl, siteName, hasScrolled }) => {`
);

// Update isLeft logic to alternate based on idx if pos is not set
code = code.replace(
  `const isLeft = section.pos === 'left';`,
  `const isLeft = section.pos ? section.pos === 'left' : idx % 2 === 0;`
);

// Update the map to pass idx to StandardSection
code = code.replace(
  `case 'standard': return <StandardSection key={idx} section={section} logoUrl={logoUrl} siteName={siteName} hasScrolled={hasScrolled} />;`,
  `case 'standard': return <StandardSection key={idx} idx={idx} section={section} logoUrl={logoUrl} siteName={siteName} hasScrolled={hasScrolled} />;`
);

fs.writeFileSync('components/SectionRenderer.tsx', code);
