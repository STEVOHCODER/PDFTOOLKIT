'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
    
    console.log("Connecting to Neural Engine at:", apiUrl);

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
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
      
      const response = await fetch(`${apiUrl}/api/compress`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${file.name}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Compression failed. The file might be too complex or corrupt.');
      }
    } catch (error) {
      alert('Connection error. Please ensure the backend is running.');
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
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-orange-500">PDF Compressor</h1>
          </div>
          <div className="px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-[10px] font-black uppercase tracking-widest text-orange-400">
             {backendStatus}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <AdBanner slot="compress-top" className="mb-12 w-full h-24 rounded-2xl border border-white/5" />

        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden text-center">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Shrink Without Loss</h2>
          <p className="text-slate-500 font-medium mb-12">Optimize your PDF file size for fast email delivery and web storage.</p>

          <div className="group relative border-2 border-dashed border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center mb-6 bg-white/[0.01] hover:bg-white/[0.03] hover:border-orange-500/40 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-20 h-20 bg-orange-500/10 rounded-[28px] flex items-center justify-center text-4xl mb-6 group-hover:rotate-12 transition-transform">📉</div>
            <span className="text-xl font-black text-white tracking-tight">
              {file ? file.name : 'Select Heavy PDF'}
            </span>
            {file && <span className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>}
          </div>

          {file && file.size > 10 * 1024 * 1024 && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
              Note: Large files ({">"}10MB) may take up to a minute to process.
            </div>
          )}

          <button 
            onClick={handleCompress}
            disabled={!file || loading}
            className={`w-full py-6 rounded-[24px] text-xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl relative overflow-hidden ${
              !file || loading 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-orange-500/20'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Optimizing... {elapsed}s</span>
              </div>
            ) : 'Compress Document'}
          </button>
          
          {loading && (
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 animate-pulse">
              Heavy neural processing in progress. Do not refresh.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
