import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { Section, GalleryImage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

// Global / shared hook that detects when user has initiated scrolling
const useHasUserScrolled = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Check if page is already scrolled down on load (e.g. refresh)
    if (window.scrollY > 0) {
      setHasScrolled(true);
      return;
    }

    const handleScrollOrTouch = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
        window.removeEventListener('scroll', handleScrollOrTouch);
        window.removeEventListener('touchmove', handleScrollOrTouch);
      }
    };

    window.addEventListener('scroll', handleScrollOrTouch, { passive: true });
    window.addEventListener('touchmove', handleScrollOrTouch, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrTouch);
      window.removeEventListener('touchmove', handleScrollOrTouch);
    };
  }, []);

  return hasScrolled;
};

const StandardSection: React.FC<{ 
  section: Section; 
  logoUrl?: string; 
  siteName?: string; 
  hasScrolled: boolean 
}> = ({ section, logoUrl, siteName, hasScrolled }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const isLeft = section.pos === 'left';
  const isHeritage = section.title === "The Heritage";

  const shouldBloom = isInView && hasScrolled;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 mb-24 items-center ${section.isSpecial ? 'bg-stone-100 -mx-6 px-6 py-16 md:-mx-20 md:px-20 rounded-sm' : ''}`}
    >
      {section.image && (
        <motion.div 
          className="w-full md:w-1/2 overflow-hidden shrink-0"
          viewport={{ once: false, amount: 0.35, margin: "-10% 0px -10% 0px" }}
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
            src={getImageUrl(section.image)}
            alt={section.imageCaption || section.title || "Design project"}
            className={`w-full aspect-[4/3] md:aspect-auto md:h-[600px] object-cover shadow-sm hybrid-bloom-image ${shouldBloom ? 'in-view' : ''}`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}
      <div className="w-full md:w-1/2 space-y-6">
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
          className={`text-stone-800 leading-relaxed text-lg font-light prose prose-stone max-w-none ${!isExpanded && section.content && section.content.length > 600 ? 'line-clamp-6' : ''}`}
        >
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {(section.content || '').replace(/(?<!\n)\n(?!\n)/g, '\n\n')}
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
  );
};

const GalleryCard: React.FC<{ 
  img: GalleryImage; 
  idx: number; 
  hasScrolled: boolean; 
  onSelect: (img: GalleryImage) => void 
}> = ({ img, idx, hasScrolled, onSelect }) => {
  const [isInView, setIsInView] = useState(false);
  const shouldBloom = isInView && hasScrolled;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: idx * 0.08 }}
      className="group relative cursor-pointer overflow-hidden aspect-[3/4] bg-stone-100"
      onClick={() => onSelect(img)}
    >
      <motion.div 
        className="w-full h-full"
        viewport={{ once: false, amount: 0.35, margin: "-10% 0px -10% 0px" }}
        onViewportEnter={() => setIsInView(true)}
        onViewportLeave={() => setIsInView(false)}
      >
        <img 
          src={getImageUrl(img.file)} 
          alt={img.caption} 
          className={`w-full h-full object-cover hybrid-bloom-image ${shouldBloom ? 'in-view' : ''} group-hover:scale-105`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="absolute inset-0 flex items-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
         <div className="bg-white p-4 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl flex justify-between items-center">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-stone-600 mb-1 font-bold">View Detail</p>
              <p className="text-xs font-bold text-stone-900 truncate uppercase tracking-tighter">{img.caption}</p>
            </div>
            <Maximize2 size={16} className="text-stone-400" />
         </div>
      </div>
    </motion.div>
  );
};

const GallerySection: React.FC<{ section: Section; hasScrolled: boolean }> = ({ section, hasScrolled }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (!section.images || section.images.length === 0) {
    return (
      <div className="mb-24 p-12 border-2 border-dashed border-stone-200 text-center">
        <p className="text-stone-500 text-[11px] uppercase tracking-widest font-bold">Gallery Empty - Add photos in Admin</p>
      </div>
    );
  }

  return (
    <div className="mb-24">
      {section.title && <h2 className="text-xl uppercase tracking-[0.4em] font-bold text-center mb-16 text-stone-600">{section.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {section.images.map((img, idx) => (
          <GalleryCard 
            key={idx}
            img={img}
            idx={idx}
            hasScrolled={hasScrolled}
            onSelect={setSelectedImage}
          />
        ))}
      </div>

      {selectedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl w-full relative">
            <button className="absolute -top-12 right-0 text-white hover:text-stone-300 transition-colors">
              <X size={32} strokeWidth={1} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={getImageUrl(selectedImage.file)} 
              alt={selectedImage.caption} 
              className="w-full max-h-[85vh] object-contain shadow-2xl" 
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-8">
              <p className="text-white uppercase tracking-[0.3em] font-medium text-sm">{selectedImage.caption}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const MapSection: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
    >
      <div className="space-y-12 py-8">
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.5em] text-stone-600 font-bold mb-4">The Studio</h3>
          <p className="text-2xl font-bold text-stone-900 leading-tight">2363 Birch Street, Suite A<br />Palo Alto, CA 94306</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.5em] text-stone-600 font-bold mb-4">Voice</h3>
            <p className="text-stone-900 font-bold tracking-tighter">650.327.1234</p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.5em] text-stone-600 font-bold mb-4">Email</h3>
            <p className="text-stone-900 font-bold truncate">studio@chapmandesign.com</p>
          </div>
        </div>
      </div>
      <div className="h-[400px] bg-stone-100 hybrid-bloom-image in-view hover:grayscale-0 transition-all duration-1000 overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.271387600858!2d-122.1465243234177!3d37.43068993110906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbb3697e3a9d7%3A0x63310e30678508e!2s2363%20Birch%20St%20A%2C%20Palo%20Alto%2C%20CA%2094306!5e0!3m2!1sen!2sus!4v1707900000000!5m2!1sen!2sus" 
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Studio Map"
        ></iframe>
      </div>
    </motion.div>
  );
};

export const SectionRenderer: React.FC<{ sections: Section[]; logoUrl?: string; siteName?: string }> = ({ sections, logoUrl, siteName }) => {
  const hasScrolled = useHasUserScrolled();

  return (
    <>
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'standard': return <StandardSection key={idx} section={section} logoUrl={logoUrl} siteName={siteName} hasScrolled={hasScrolled} />;
          case 'gallery': return <GallerySection key={idx} section={section} hasScrolled={hasScrolled} />;
          case 'map': return <MapSection key={idx} />;
          default: return null;
        }
      })}
    </>
  );
};
