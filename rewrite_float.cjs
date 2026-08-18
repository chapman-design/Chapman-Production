const fs = require('fs');
let code = fs.readFileSync('components/SectionRenderer.tsx', 'utf8');

const target = `<div className={\`w-full \${section.image ? 'lg:w-1/2' : 'max-w-4xl'} space-y-6\`}>`;

const fullTarget = `  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className={\`flex flex-col \${!section.image ? '' : isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 mb-24 \${!section.image ? 'items-start' : 'items-center'} \${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''}\`}
    >
      {section.image && (
        <motion.div 
          className="w-full lg:w-1/2 overflow-hidden shrink-0"
          viewport={{ once: false, amount: 0.35, margin: "-10% 0px -10% 0px" }}
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
        >
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
            src={getImageUrl(section.image)} 
            alt={section.imageCaption || section.title || "Design project"} 
            className={\`w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] object-cover shadow-sm hybrid-bloom-image \${shouldBloom ? 'in-view' : ''}\`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}
      <div className={\`w-full \${section.image ? 'lg:w-1/2' : 'max-w-4xl'} space-y-6\`}>
        {isHeritage && logoUrl && (
          <div className="mb-6 flex justify-start">
            <img 
              src={logoUrl} 
              alt={siteName || "Chapman Design Associates Logo"} 
              className="h-32 md:h-48 w-auto object-contain select-none mix-blend-multiply" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        {section.title && <h2 className="text-3xl font-bold text-stone-900 tracking-tight">{section.title}</h2>}
        <div 
          className={\`text-stone-800 leading-relaxed text-lg font-light prose prose-stone max-w-none \${!isExpanded && section.content && section.content.length > 600 ? 'line-clamp-6' : ''}\`}
        >
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {(section.content || '').replace(/(?<!\\n)\\n(?!\\n)/g, '\\n\\n')}
          </ReactMarkdown>
        </div>
        {section.content && section.content.length > 600 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs uppercase tracking-[0.3em] font-bold border-b border-stone-900 pb-2 hover:text-stone-600 hover:border-stone-600 transition-colors cursor-pointer"
          >
            {isExpanded ? 'Minimize' : 'Read Full Description'}
          </button>
        )}
      </div>
    </motion.div>
  );`;

const fullReplacement = `  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className={\`mb-24 \${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 lg:-mx-20 lg:px-20 rounded-sm' : ''} clear-both\`}
    >
      <div className="w-full">
        {section.image && (
          <motion.div 
            className={\`w-full lg:w-1/2 lg:mb-6 overflow-hidden shrink-0 \${isLeft ? 'lg:float-left lg:mr-12' : 'lg:float-right lg:ml-12'} mb-8\`}
            viewport={{ once: false, amount: 0.35, margin: "-10% 0px -10% 0px" }}
            onViewportEnter={() => setIsInView(true)}
            onViewportLeave={() => setIsInView(false)}
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
              src={getImageUrl(section.image)} 
              alt={section.imageCaption || section.title || "Design project"} 
              className={\`w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] object-cover shadow-sm hybrid-bloom-image \${shouldBloom ? 'in-view' : ''}\`}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
        
        {isHeritage && logoUrl && (
          <div className="mb-6 flex justify-start">
            <img 
              src={logoUrl} 
              alt={siteName || "Chapman Design Associates Logo"} 
              className="h-32 md:h-48 w-auto object-contain select-none mix-blend-multiply" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        {section.title && <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-6">{section.title}</h2>}
        <div 
          className={\`text-stone-800 leading-relaxed text-lg font-light prose prose-stone max-w-none \${!isExpanded && section.content && section.content.length > 600 ? 'line-clamp-6' : ''}\`}
        >
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {(section.content || '').replace(/(?<!\\n)\\n(?!\\n)/g, '\\n\\n')}
          </ReactMarkdown>
        </div>
        {section.content && section.content.length > 600 && (
          <div className="clear-both pt-6">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs uppercase tracking-[0.3em] font-bold border-b border-stone-900 pb-2 hover:text-stone-600 hover:border-stone-600 transition-colors cursor-pointer"
            >
              {isExpanded ? 'Minimize' : 'Read Full Description'}
            </button>
          </div>
        )}
      </div>
      <div className="clear-both"></div>
    </motion.div>
  );`;

code = code.replace(fullTarget, fullReplacement);
fs.writeFileSync('components/SectionRenderer.tsx', code);
