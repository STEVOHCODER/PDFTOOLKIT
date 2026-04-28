'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState('1');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
    
    console.log("Connecting to Neural Engine at:", apiUrl);

    fetch(`${apiUrl}/`)
      .then(res => res.ok ? setBackendStatus('online') : setBackendStatus('offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ranges', ranges);

    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);

      const response = await fetch(`${apiUrl}/api/split`, { method: 'POST', body: formData });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const contentType = response.headers.get('content-type');
        a.download = contentType && contentType.includes('zip') ? "split_files.zip" : `split_${file.name}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Split failed');
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
            <div className="text-sm font-black uppercase tracking-[0.3em] text-rose-500">PDF Split</div>
          </div>
          <div className="px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-400">
             {backendStatus}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <AdBanner slot="split-top" className="mb-12 w-full h-24 rounded-2xl border border-white/5" />

        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden text-center">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Precision Slicing</h1>
          <p className="text-slate-500 font-medium mb-12 uppercase tracking-widest text-xs">Extract specific ranges into new documents instantly.</p>

          <div className="group relative border-2 border-dashed border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center mb-8 bg-white/[0.01] hover:bg-white/[0.03] hover:border-rose-500/40 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-20 h-20 bg-rose-500/10 rounded-[28px] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">✂️</div>
            <span className="text-xl font-black text-white tracking-tight">
              {file ? file.name : 'Select PDF to Split'}
            </span>
          </div>

          <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 mb-8 text-left">
             <label className="block text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Define Extraction Ranges</label>
             <input 
                type="text" 
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                className="w-full bg-black/40 px-6 py-4 rounded-2xl border border-white/10 focus:border-rose-500 outline-none text-white font-bold text-lg transition-colors"
                placeholder="e.g. 1-3, 5, 8-10"
             />
             <div className="mt-4 flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <span>• 1-5 (Single File)</span>
                <span>• 1, 3, 5 (Separate Files)</span>
             </div>
          </div>

          <button 
            onClick={handleSplit}
            disabled={!file || loading}
            className={`w-full py-6 rounded-[24px] text-xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
              !file || loading 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-rose-500/20'
            }`}
          >
            {loading ? 'Processing Slices...' : 'Split & Download'}
          </button>
        </div>
      </main>
    </div>
  );
}
