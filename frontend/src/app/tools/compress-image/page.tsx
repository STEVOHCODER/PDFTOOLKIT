'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function ImageCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/`)
      .then(res => res.ok ? setBackendStatus('online') : setBackendStatus('offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/compress-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${file.name.split('.')[0]}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Image compression failed');
      }
    } catch (error) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200">
      <nav className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-amber-500">Image Compressor</h1>
          </div>
          <div className="px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-black uppercase tracking-widest text-amber-400">
             {backendStatus}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl text-center">
        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Ultra-Light Visuals</h2>
          <p className="text-slate-500 font-medium mb-12">Shrink JPG/PNG files by up to 80% with our high-speed neural optimizer.</p>

          <div className="group relative border-2 border-dashed border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center mb-10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-amber-500/40 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-20 h-20 bg-amber-500/10 rounded-[28px] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🖼️</div>
            <span className="text-xl font-black text-white tracking-tight">
              {file ? file.name : 'Drop Image Asset'}
            </span>
          </div>

          <button 
            onClick={handleCompress}
            disabled={!file || loading}
            className={`w-full py-6 rounded-[24px] text-xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${
              !file || loading 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-amber-500/20'
            }`}
          >
            {loading ? 'Optimizing Pixels...' : 'Execute Compression'}
          </button>
        </div>
      </main>
    </div>
  );
}
