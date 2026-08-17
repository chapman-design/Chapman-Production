import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, ArrowLeft, LogIn, LogOut, Upload, Settings, GripVertical, Undo, Redo, RotateCcw } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { db, storage, auth } from '../lib/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

interface AdminProps {
  initialData: any;
  onSave: (data: any) => void;
}

const Admin: React.FC<AdminProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState(initialData);
  const [history, setHistory] = useState<any[]>([JSON.parse(JSON.stringify(initialData))]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isInternalChange, setIsInternalChange] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activePageKey, setActivePageKey] = useState('home');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storageStatus, setStorageStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const testRef = ref(storage, 'test-connection');
        // Just checking if we can get a URL for a non-existent file to see if the bucket resolves
        await getDownloadURL(testRef).catch(e => {
          if (e.code === 'storage/object-not-found') return; // This is fine, means bucket reachable
          throw e;
        });
        setStorageStatus({ ok: true, message: 'Connected' });
      } catch (err: any) {
        console.warn('Storage check failed:', err);
        setStorageStatus({ 
          ok: false, 
          message: err.code === 'storage/unauthorized' ? 'Permission Denied' : 'Not Initialized' 
        });
      }
    };
    checkStorage();
  }, []);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  
  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Here you could restrict to a specific email
        if (user.email === 'kentrw@gmail.com' || user.email === 'virginia@wjcda.com') {
          setIsAuthenticated(true);
          setCurrentUser(user);
        } else {
          signOut(auth);
          alert('Unauthorized: Only administrators can access this area.');
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const resolveImagePath = (path: string) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    if (path.includes('firebasestorage.googleapis.com')) return path;
    return `/${path}?t=${Date.now()}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Auth error:", error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // History Management
  useEffect(() => {
    setJustSaved(false);
    if (isInternalChange) {
      setIsInternalChange(false);
      return;
    }

    const timer = setTimeout(() => {
      const currentDataStr = JSON.stringify(data);
      const lastHistoryStr = JSON.stringify(history[historyIndex]);

      if (currentDataStr !== lastHistoryStr) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(currentDataStr));
        
        // Limit history size
        const limitedHistory = newHistory.length > 50 ? newHistory.slice(newHistory.length - 50) : newHistory;
        setHistory(limitedHistory);
        setHistoryIndex(limitedHistory.length - 1);
        
        // Auto-save draft to localStorage
        localStorage.setItem('cda_site_draft', currentDataStr);
      }
    }, 500); // Debounce history pushes

    return () => clearTimeout(timer);
  }, [data]);

  // Check for draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('cda_site_draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      if (JSON.stringify(draftData) !== JSON.stringify(initialData)) {
        setHasDraft(true);
      }
    }
  }, [initialData]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setIsInternalChange(true);
      setHistoryIndex(prevIndex);
      setData(JSON.parse(JSON.stringify(history[prevIndex])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setIsInternalChange(true);
      setHistoryIndex(nextIndex);
      setData(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  const restoreDraft = () => {
    const draft = localStorage.getItem('cda_site_draft');
    if (draft) {
      setData(JSON.parse(draft));
      setHasDraft(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const batch = writeBatch(db);

      // Save Site Settings
      const settingsRef = doc(db, 'settings', 'main');
      batch.set(settingsRef, data.site_settings);

      // Save Pages
      Object.keys(data.pages).forEach((pageKey) => {
        const pageRef = doc(db, 'pages', pageKey);
        batch.set(pageRef, data.pages[pageKey]);
      });

      await batch.commit();

      onSave(data);
      try {
        localStorage.setItem('cda_site_data', JSON.stringify(data));
        localStorage.removeItem('cda_site_draft');
      } catch (e) {}
      setHasDraft(false);
      setJustSaved(true);
      alert('Site Updated Successfully (Saved to Firebase)');
    } catch (err: any) {
      console.error(err);
      alert('Critical Error Saving to Firebase: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, sectionIdx: number, isGallery: boolean = false) => {
    e.preventDefault();
    setDragOverZone(null);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Create a fake event object to reuse handleUpload logic or just call a shared function
    // Better to refactor handleUpload to take a FileList directly
    await uploadFiles(files, sectionIdx, isGallery);
  };

  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml') {
        resolve(file); // Don't convert SVGs
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Cap max dimensions for better performance and smaller file sizes
          const MAX_DIM = 2400;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file); // Fallback to original if canvas fails
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Add name property to blob so it behaves like a File
                (blob as any).name = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                resolve(blob);
              } else {
                resolve(file); // Fallback
              }
            },
            'image/webp',
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const uploadFiles = async (files: FileList, sectionIdx: number, isGallery: boolean = false) => {
    if (!isAuthenticated) {
      alert('You must be signed in to upload images.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const totalFiles = files.length;
    let completedFiles = 0;

    try {
      const uploadPromises = Array.from(files).map(async (file: File) => {
        let fileToUpload: File | Blob = file;
        let fileName = file.name;
        
        try {
          fileToUpload = await convertToWebP(file);
          fileName = (fileToUpload as any).name || file.name;
        } catch (e) {
          console.warn('WebP conversion failed, uploading original:', e);
        }

        const storagePath = `uploads/${Date.now()}-${fileName}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round((completedFiles / totalFiles) * 100 + (progress / totalFiles)));
            }, 
            (error: any) => {
              console.error('Storage Upload Error:', error);
              
              if (error.code === 'storage/unauthorized') {
                reject(new Error('Permission denied. Ensure Firebase Storage is initialized and rules allow uploads.'));
              } else if (error.message.includes('CORS') || error.code === 'storage/retry-limit-exceeded' || error.code === 'storage/unknown') {
                reject(new Error('CORS or Connection Error. Make sure Firebase Storage is initialized in the console and CORS is configured. If you see an "Upgrade" button in Firebase Storage, you must click it and follow the steps.'));
              } else {
                reject(error);
              }
            }, 
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                completedFiles++;
                setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
                resolve({ success: true, url: downloadURL });
              } catch (urlError) {
                reject(urlError);
              }
            }
          );
        });
      });

      const results = await Promise.all(uploadPromises) as { success: boolean; url: string }[];
      
      const newUrls = results.filter(r => r.success).map(r => r.url);
      if (newUrls.length === 0) {
        throw new Error('No files were successfully uploaded.');
      }

      setData((prev: any) => {
        const newData = JSON.parse(JSON.stringify(prev));
        
        if (sectionIdx === -1) {
          newData.site_settings.logo = newUrls[0];
        } else {
          const currentPageData = newData.pages[activePageKey];
          if (!currentPageData) {
            console.error('Active page data not found in state:', activePageKey);
            return prev;
          }
          
          const section = currentPageData.sections[sectionIdx];
          if (!section) {
            console.error('Section not found at index:', sectionIdx);
            return prev;
          }

          if (isGallery) {
            if (!section.images) section.images = [];
            newUrls.forEach(url => {
              section.images.push({ file: url, caption: 'New Image' });
            });
          } else {
            section.image = newUrls[0];
          }
        }
        
        return newData;
      });
    } catch (err: any) {
      console.error('Upload Error:', err);
      alert('Upload failed: ' + (err.message || 'Unknown error. Check storage rules or connection.'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    setDragOverZone(zoneId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(null);
  };

  const addSection = (type: string) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const newSection = type === 'standard' 
        ? { type: 'standard', title: 'New Section', content: 'Enter content here...', pos: 'left', image: '', imageCaption: '' }
        : { type: 'gallery', title: 'New Gallery', images: [] };
      
      if (!newData.pages[activePageKey].sections) {
        newData.pages[activePageKey].sections = [];
      }
      newData.pages[activePageKey].sections.push(newSection);
      return newData;
    });
    
    // Optional: Scroll to bottom to show new section
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const removeSection = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setData((prev: any) => {
        const newData = JSON.parse(JSON.stringify(prev));
        newData.pages[activePageKey].sections.splice(idx, 1);
        return newData;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-sm shadow-2xl w-full max-w-md">
          <div className="text-center mb-8 flex flex-col items-center">
            {data?.site_settings?.logo ? (
              <img 
                key={data.site_settings.logo}
                src={resolveImagePath(data.site_settings.logo)} 
                alt="Studio Logo" 
                className="h-16 w-auto object-contain mb-4" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.warn("Logo preview failed to load");
                }}
              />
            ) : (
              <h1 className="brand-font text-3xl font-bold tracking-tighter mb-2 text-stone-900">Studio Admin</h1>
            )}
            <p className="text-stone-400 text-[10px] uppercase tracking-widest">{data?.site_settings?.name}</p>
          </div>
          <div className="space-y-6">
            <button 
              onClick={handleLogin} 
              className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Sign in with Google
            </button>
            <p className="text-stone-400 text-[9px] uppercase tracking-widest text-center">
              Restricted Access • Authorized Administrators Only
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      <header className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/" className="text-stone-400 hover:text-stone-900 transition-colors">
            <ArrowLeft size={20} />
          </a>
          <div className="flex flex-col">
            <h1 className="font-bold tracking-tighter text-xl">CMS Dashboard</h1>
            {currentUser && (
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-stone-500">Signed in as {currentUser.email}</span>
                
                {storageStatus && (
                  <div className={`flex items-center gap-1.5 border rounded-full px-2 py-0.5 ${storageStatus.ok ? 'border-green-100 bg-green-50 text-green-700' : 'border-amber-100 bg-amber-50 text-amber-700'}`}>
                    <div className={`w-1 h-1 rounded-full ${storageStatus.ok ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Storage: {storageStatus.message}</span>
                  </div>
                )}

                <button 
                  onClick={handleSignOut}
                  className="text-[9px] uppercase tracking-widest text-stone-400 hover:text-red-500 font-bold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center border-r border-stone-200 pr-4 mr-2 gap-1">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 text-stone-400 hover:text-stone-900 disabled:opacity-30 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2 text-stone-400 hover:text-stone-900 disabled:opacity-30 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={18} />
            </button>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || justSaved}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${
              justSaved 
                ? 'bg-stone-200 text-stone-500 cursor-default' 
                : 'bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50'
            }`}
          >
            {isSaving ? (
              'Saving...'
            ) : justSaved ? (
              <>Changes Saved</>
            ) : (
              <><Save size={14} /> Save Changes</>
            )}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {hasDraft && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 border-b border-amber-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3 text-amber-800 text-xs font-medium">
                <RotateCcw size={14} />
                <span>You have an unsaved draft from a previous session.</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setHasDraft(false)}
                  className="text-amber-600 hover:text-amber-800 text-[10px] uppercase tracking-widest font-bold"
                >
                  Dismiss
                </button>
                <button 
                  onClick={restoreDraft}
                  className="bg-amber-800 text-white px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-amber-900 transition-colors"
                >
                  Restore Draft
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-r border-stone-200 p-6 space-y-8">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">Studio</h3>
            <button
              onClick={() => setActivePageKey('settings')}
              className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-colors flex items-center gap-3 ${
                activePageKey === 'settings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Settings size={16} />
              Site Settings
            </button>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">Pages</h3>
            <nav className="space-y-2">
              {Object.keys(data.pages).map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePageKey(key)}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                    activePageKey === key ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          {activePageKey !== 'settings' && (
            <div className="pt-8 border-t border-stone-100">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">Add Content</h3>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => addSection('standard')} className="flex items-center gap-3 px-4 py-3 border border-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors">
                  <Plus size={14} /> Standard Section
                </button>
                <button onClick={() => addSection('gallery')} className="flex items-center gap-3 px-4 py-3 border border-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors">
                  <Plus size={14} /> Image Gallery
                </button>
              </div>
            </div>
          )}
        </aside>

        <main className="flex-grow p-6 md:p-12 max-w-5xl mx-auto w-full">
          <div className="mb-12 space-y-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              {activePageKey === 'settings' ? 'Global Site Settings' : `Editing: ${activePageKey}`}
            </h2>
            
            {activePageKey === 'settings' ? (
              <div className="bg-white p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Studio Name</label>
                    <input 
                      type="text" 
                      value={data.site_settings.name}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.site_settings.name = e.target.value;
                        setData(newData);
                      }}
                      className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Tagline (Terminology)</label>
                    <input 
                      type="text" 
                      value={data.site_settings.tagline}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.site_settings.tagline = e.target.value;
                        setData(newData);
                      }}
                      className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Office Address</label>
                    <input 
                      type="text" 
                      value={data.site_settings.address}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.site_settings.address = e.target.value;
                        setData(newData);
                      }}
                      className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={data.site_settings.phone}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.site_settings.phone = e.target.value;
                        setData(newData);
                      }}
                      className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={data.site_settings.email}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.site_settings.email = e.target.value;
                        setData(newData);
                      }}
                      className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Studio Logo</label>
                    <div className="flex items-center gap-6 p-4 border border-stone-100 bg-stone-50/50">
                      <div className="h-24 w-48 bg-white border border-stone-200 flex items-center justify-center overflow-hidden">
                        {data.site_settings.logo ? (
                          <img 
                            key={data.site_settings.logo}
                            src={resolveImagePath(data.site_settings.logo)} 
                            alt="Logo Preview" 
                            className="max-h-full max-w-full object-contain" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[10px] text-stone-300 uppercase font-bold">No Logo</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label 
                          onDragOver={(e) => handleDragOver(e, 'logo')}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, -1)}
                          className={`bg-stone-900 text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:bg-stone-700 transition-all flex items-center gap-2 ${dragOverZone === 'logo' ? 'ring-2 ring-stone-900 ring-offset-2 scale-105' : ''}`}
                        >
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && uploadFiles(e.target.files, -1)} />
                          <Upload size={12} /> {dragOverZone === 'logo' ? 'Drop to Upload' : 'Upload Logo'}
                        </label>
                        {data.site_settings.logo && (
                          <button 
                            onClick={() => {
                              const newData = { ...data };
                              newData.site_settings.logo = '';
                              setData(newData);
                            }}
                            className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors text-left"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">Footer Description</label>
                      <span className="text-[9px] text-stone-300 uppercase tracking-tighter font-medium">Supports Markdown (Double enter for new paragraph)</span>
                    </div>
                    <textarea 
                      value={data.site_settings.footer_description}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.site_settings.footer_description = e.target.value;
                        setData(newData);
                      }}
                      className="w-full text-sm text-stone-700 border border-stone-100 p-4 outline-none focus:border-stone-900 h-24 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Social Links</label>
                    <div className="space-y-3">
                      {data.site_settings.social_links?.map((link: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <select 
                            value={link.platform}
                            onChange={(e) => {
                              const newData = { ...data };
                              newData.site_settings.social_links[idx].platform = e.target.value;
                              setData(newData);
                            }}
                            className="bg-stone-50 border border-stone-100 px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-stone-900"
                          >
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="houzz">Houzz</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="pinterest">Pinterest</option>
                            <option value="twitter">Twitter</option>
                          </select>
                          <input 
                            type="text" 
                            value={link.url}
                            onChange={(e) => {
                              const newData = { ...data };
                              newData.site_settings.social_links[idx].url = e.target.value;
                              setData(newData);
                            }}
                            placeholder="URL"
                            className="flex-grow border-b border-stone-100 py-2 outline-none focus:border-stone-900 text-sm"
                          />
                          <button 
                            onClick={() => {
                              const newData = { ...data };
                              newData.site_settings.social_links.splice(idx, 1);
                              setData(newData);
                            }}
                            className="text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newData = { ...data };
                          if (!newData.site_settings.social_links) newData.site_settings.social_links = [];
                          newData.site_settings.social_links.push({ platform: 'instagram', url: '' });
                          setData(newData);
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-stone-900 flex items-center gap-2 hover:text-stone-600 transition-colors"
                      >
                        <Plus size={12} /> Add Social Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 bg-white p-8 border border-stone-200 shadow-sm">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Page Title</label>
                    <input 
                      type="text" 
                      value={data.pages[activePageKey].page_title}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.pages[activePageKey].page_title = e.target.value;
                        setData(newData);
                      }}
                      className="w-full text-2xl font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">SEO Description</label>
                    <textarea 
                      value={data.pages[activePageKey].meta_description}
                      onChange={(e) => {
                        const newData = { ...data };
                        newData.pages[activePageKey].meta_description = e.target.value;
                        setData(newData);
                      }}
                      className="w-full text-sm text-stone-500 border border-stone-100 p-4 outline-none focus:border-stone-900 h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-12 mt-12">
                  {data.pages[activePageKey].sections.map((section: any, idx: number) => (
                    <div key={idx} className="bg-white border border-stone-200 shadow-sm overflow-hidden group">
                      <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest font-black text-stone-400">Section {idx + 1}: {section.type}</span>
                        <button onClick={() => removeSection(idx)} className="text-stone-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="p-8 space-y-6">
                        {section.type === 'standard' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Title</label>
                                <input 
                                  type="text" 
                                  value={section.title}
                                  onChange={(e) => {
                                    const newData = { ...data };
                                    newData.pages[activePageKey].sections[idx].title = e.target.value;
                                    setData(newData);
                                  }}
                                  className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between items-end mb-2">
                                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">Content</label>
                                  <span className="text-[9px] text-stone-300 uppercase tracking-tighter font-medium">Supports Markdown</span>
                                </div>
                                <textarea 
                                  value={section.content}
                                  onChange={(e) => {
                                    const newData = { ...data };
                                    newData.pages[activePageKey].sections[idx].content = e.target.value;
                                    setData(newData);
                                  }}
                                  className="w-full text-sm text-stone-600 border border-stone-100 p-4 outline-none focus:border-stone-900 h-40 resize-none"
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Image</label>
                              <div 
                                onDragOver={(e) => handleDragOver(e, `section-${idx}`)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, idx)}
                                className={`aspect-video bg-stone-100 relative overflow-hidden group/img transition-all ${dragOverZone === `section-${idx}` ? 'ring-4 ring-stone-900 ring-inset' : ''}`}
                              >
                                {section.image ? (
                                  <img 
                                    src={resolveImagePath(section.image)} 
                                    className="w-full h-full object-cover" 
                                    alt="Section" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-stone-300"><ImageIcon size={48} /></div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 cursor-pointer">
                                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white cursor-pointer hover:text-stone-200">
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && uploadFiles(e.target.files, idx)} />
                                    <Upload size={16} /> {dragOverZone === `section-${idx}` ? 'Drop to Upload' : 'Upload New'}
                                  </label>
                                </div>
                              </div>
                              <div className="mt-2">
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Image Alt Text / Caption</label>
                                <input 
                                  type="text" 
                                  value={section.imageCaption || ''}
                                  onChange={(e) => {
                                    const newData = { ...data };
                                    newData.pages[activePageKey].sections[idx].imageCaption = e.target.value;
                                    setData(newData);
                                  }}
                                  placeholder="Describe the image for accessibility..."
                                  className="w-full text-sm border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'gallery' && (
                          <div className="space-y-8">
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Gallery Title</label>
                              <input 
                                type="text" 
                                value={section.title}
                                onChange={(e) => {
                                  const newData = { ...data };
                                  newData.pages[activePageKey].sections[idx].title = e.target.value;
                                  setData(newData);
                                }}
                                className="w-full font-bold border-b border-stone-100 py-2 outline-none focus:border-stone-900"
                              />
                            </div>
                            <Reorder.Group 
                              axis="y" 
                              values={section.images || []} 
                              onReorder={(newImages) => {
                                setData((prev: any) => {
                                  const newData = JSON.parse(JSON.stringify(prev));
                                  newData.pages[activePageKey].sections[idx].images = newImages;
                                  return newData;
                                });
                              }}
                              className="space-y-2"
                            >
                              {(section.images || []).map((img: any, imgIdx: number) => (
                                <Reorder.Item 
                                  key={img.file} 
                                  value={img}
                                  whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                  className="flex items-center gap-4 bg-white border border-stone-200 p-3 cursor-grab active:cursor-grabbing group/gallery"
                                >
                                  <div className="flex-shrink-0 text-stone-300 group-hover/gallery:text-stone-900 transition-colors">
                                    <GripVertical size={20} />
                                  </div>
                                  <div className="h-40 w-40 bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-100">
                                    <img 
                                      src={resolveImagePath(img.file)} 
                                      className="w-full h-full object-cover" 
                                      alt={img.caption} 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <input 
                                      type="text" 
                                      value={img.caption}
                                      onChange={(e) => {
                                        setData((prev: any) => {
                                          const newData = JSON.parse(JSON.stringify(prev));
                                          newData.pages[activePageKey].sections[idx].images[imgIdx].caption = e.target.value;
                                          return newData;
                                        });
                                      }}
                                      placeholder="Image Caption..."
                                      className="w-full text-xs font-bold uppercase tracking-widest outline-none focus:border-b focus:border-stone-900 py-1"
                                    />
                                    <p className="text-[9px] text-stone-400 mt-1 truncate max-w-xs">{img.file.split('/').pop()}</p>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      setData((prev: any) => {
                                        const newData = JSON.parse(JSON.stringify(prev));
                                        newData.pages[activePageKey].sections[idx].images.splice(imgIdx, 1);
                                        return newData;
                                      });
                                    }}
                                    className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </Reorder.Item>
                              ))}
                              <div className="pt-4">
                                <label 
                                  onDragOver={(e) => handleDragOver(e, `gallery-${idx}`)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, idx, true)}
                                  className={`w-full border-2 border-dashed py-8 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${dragOverZone === `gallery-${idx}` ? 'border-stone-900 bg-stone-100 text-stone-900' : 'border-stone-200 text-stone-400 hover:border-stone-900 hover:text-stone-900'} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    multiple 
                                    disabled={isUploading}
                                    onChange={(e) => e.target.files && uploadFiles(e.target.files, idx, true)} 
                                  />
                                  {isUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
                                      <span className="text-[8px] uppercase tracking-widest font-bold">{uploadProgress}%</span>
                                    </div>
                                  ) : (
                                    <>
                                      <Plus size={24} />
                                      <span className="text-[8px] uppercase tracking-widest font-bold">
                                        {dragOverZone === `gallery-${idx}` ? 'Drop to Upload Photos' : 'Upload New Photos to Gallery'}
                                      </span>
                                    </>
                                  )}
                                </label>
                              </div>
                            </Reorder.Group>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
