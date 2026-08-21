import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Linkedin, Phone, Mail, ChevronDown, Facebook, Twitter, Pin as Pinterest, Globe } from 'lucide-react';
import { SocialLink } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  settings: {
    name: string;
    address: string;
    phone: string;
    email: string;
    tagline: string;
    footer_description: string;
    logo?: string;
    social_links: SocialLink[];
  };
}

const SocialIcon = ({ platform, size = 14 }: { platform: string, size?: number }) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook size={size} />;
    case 'instagram': return <Instagram size={size} />;
    case 'linkedin': return <Linkedin size={size} />;
    case 'twitter': return <Twitter size={size} />;
    case 'pinterest': return <Pinterest size={size} />;
    default: return <Globe size={size} />;
  }
};

const Layout: React.FC<LayoutProps> = ({ children, activePage, settings = { name: '', address: '', phone: '', email: '', tagline: '', footer_description: '', logo: '', social_links: [] } }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const safeSettings = {
    name: settings?.name || 'Studio Name',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    tagline: settings?.tagline || '',
    footer_description: settings?.footer_description || 'A dedication to the residential design heritage of the Bay Area, crafting homes that endure for generations through thoughtful planning and meticulous materiality.',
    logo: settings?.logo || '',
    social_links: settings?.social_links || []
  };

  const navItems = [
    { label: 'home', path: '/' },
    { label: 'about', path: '/about' },
    { 
      label: 'services', 
      path: '/services',
      children: [
        { label: 'design services', path: '/services' },
        { label: 'consultants', path: '/consultants' },
      ]
    },
    { 
      label: 'projects', 
      path: '/projects',
      children: [
        { label: 'featured home', path: '/featured-home' },
        { label: 'new homes', path: '/new-homes' },
        { label: 'adus', path: '/adus' },
        { label: 'remodels', path: '/remodels' },
        { label: 'additions', path: '/additions' },
        { label: 'interiors', path: '/interiors' },
      ]
    },
  ];

  const isItemActive = (item: { label: string; path: string; children?: { label: string; path: string }[] }) => {
    if (item.children) {
      return item.children.some(child => {
        const cleanPath = child.path.replace(/^\//, '');
        return activePage === cleanPath;
      });
    }
    const cleanPath = item.path.replace(/^\//, '');
    return activePage === (cleanPath || 'home');
  };

  const getLogoUrl = (logo: string) => {
    if (!logo) return '';
    if (logo.startsWith('data:') || logo.startsWith('http') || logo.startsWith('/')) return logo;
    return `/${logo}`;
  };

  return (
        <div className="min-h-screen flex flex-col selection:bg-stone-900 selection:text-white">
      {/* Skip to Main Content Link for ADA Keyboard Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-stone-900 focus:text-white focus:outline-none focus:ring-2 focus:ring-stone-400 rounded-sm font-bold text-xs uppercase tracking-wider"
      >
        Skip to main content
      </a>
      {/* Mobile Sticky Header */}
      <div className="md:hidden sticky top-0 z-50 bg-stone-50 border-b border-stone-200 px-6 py-3.5 flex justify-between items-center">
        <a href="/" className="block">
          {safeSettings.logo ? (
            <img 
              src={getLogoUrl(safeSettings.logo)} 
              alt={safeSettings.name} 
              className="h-[45px] w-auto object-contain mix-blend-multiply" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="brand-font text-2xl font-bold tracking-tighter">CDA</span>
          )}
        </a>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          className="p-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <header className="hidden md:block bg-stone-50 pt-10 pb-4">
        <div className="container mx-auto px-12 flex justify-between items-end border-b border-stone-200 pb-8">
          <div className="space-y-4">
            <a href="/" className="block group">
              {safeSettings.logo ? (
                <img 
                  src={getLogoUrl(safeSettings.logo)} 
                  alt={safeSettings.name} 
                  className="h-[65px] lg:h-[80px] w-auto object-contain mb-2 mix-blend-multiply" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-stone-900 group-hover:text-stone-600 transition-colors">
                    {safeSettings.name}
                  </h1>
                  <p className="text-stone-600 text-[11px] uppercase tracking-[0.6em] mt-2 font-bold">{safeSettings.tagline}</p>
                </>
              )}
            </a>
          </div>

          <nav>
            <ul className="flex space-x-10 items-center">
              {navItems.map((item) => (
                <li key={item.label} className="relative group/nav">
                  {item.children ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        aria-haspopup="true" aria-expanded={activeDropdown === item.label} className={`text-[13px] uppercase tracking-[0.35em] font-black transition-all flex items-center gap-1 h-full py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded ${
                          isItemActive(item) ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        {item.label} <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.ul 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 mt-4 w-64 bg-white shadow-xl border border-stone-100 py-4 z-50"
                          >
                            {item.children.map(child => (
                              <li key={child.label}>
                                <a 
                                  href={child.path}
                                  className={`block px-6 py-2 text-[11px] uppercase tracking-[0.25em] font-bold transition-colors whitespace-nowrap ${
                                    activePage === child.path.replace('/', '') ? 'text-stone-900 bg-stone-50' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                                  }`}
                                >
                                  {child.label}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      href={item.path}
                      className={`text-[13px] uppercase tracking-[0.35em] font-black transition-all hover:tracking-[0.45em] flex items-center h-full py-1 ${
                        isItemActive(item) ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col p-12 pt-24 overflow-y-auto"
          >
            <ul className="space-y-8">
              {navItems.map((item) => (
                <li key={item.label} className="space-y-4">
                  {item.children ? (
                    <>
                      <span className="text-3xl font-black uppercase tracking-tighter text-stone-400 block">
                        {item.label}
                      </span>
                      <ul className="pl-6 space-y-4 border-l border-stone-100">
                        {item.children.map(child => (
                          <li key={child.label}>
                            <a
                              href={child.path}
                              onClick={() => setIsMenuOpen(false)}
                              className="text-xl font-bold uppercase tracking-tighter text-stone-900"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <a
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-3xl font-black uppercase tracking-tighter text-stone-900"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-12 pt-12 border-t border-stone-100 space-y-4">
              <p className="text-stone-600 text-[11px] uppercase tracking-widest font-bold">{safeSettings.address}</p>
              <p className="text-stone-900 font-bold">{safeSettings.phone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" tabIndex={-1} className="flex-grow container mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-16 md:pb-24 outline-none">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="bg-stone-50 border-t border-stone-200 py-24">
        <div className="container mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2 space-y-8">
              {safeSettings.logo ? (
                <img 
                  src={getLogoUrl(safeSettings.logo)} 
                  alt={safeSettings.name} 
                  className="h-11 w-auto object-contain opacity-90 mix-blend-multiply" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <h3 className="brand-font text-3xl font-bold tracking-tighter text-stone-900">{safeSettings.name}</h3>
              )}
              <div className="text-stone-700 text-sm max-w-sm leading-relaxed font-light italic prose prose-stone prose-sm">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {(safeSettings.footer_description || '').replace(/(?<!\n)\n(?!\n)/g, '\n\n')}
                </ReactMarkdown>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-stone-600">Location</h3>
              <p className="text-stone-900 text-sm leading-loose font-medium">
                {safeSettings.address}
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-stone-600">Connect</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Phone size={14} className="text-stone-600" />
                  <a href={`tel:${safeSettings.phone}`} className="text-stone-900 hover:text-stone-700 transition-colors font-bold tracking-tighter">{safeSettings.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={14} className="text-stone-600" />
                  <a href={`mailto:${safeSettings.email}`} className="text-stone-900 hover:text-stone-700 transition-colors font-medium">{safeSettings.email}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-stone-500 font-bold">
            <p>© {new Date().getFullYear()} {safeSettings.name}</p>
            <div className="flex space-x-8">
              {safeSettings.social_links.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={`Follow Chapman Design on ${link.platform}`} className="hover:text-stone-900 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded"
                >
                  <SocialIcon platform={link.platform} />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
