'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function ConvertTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/`)
      .then(res => res.ok ? setBackendStatus('online') : setBackendStatus('offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/img2pdf`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "images_to_pdf.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Conversion failed.');
      }
    } catch (error) {
      alert('Connection error.');
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
            <div className="text-sm font-black uppercase tracking-[0.3em] text-purple-500">Image to PDF</div>
          </div>
          <div className="px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-[10px] font-black uppercase tracking-widest text-purple-400">
             {backendStatus}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <AdBanner slot="img2pdf-top" className="mb-12 w-full h-24 rounded-2xl border border-white/5" />

        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden text-center">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Visual Conversion</h1>
          <p className="text-slate-500 font-medium mb-12">Transform your visual assets into high-performance, industry-standard PDF portfolios.</p>

          <div className="group relative border-2 border-dashed border-white/10 rounded-[40px] p-20 flex flex-col items-center justify-center mb-10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-500/40 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple onChange={handleFileChange} />
            <div className="w-24 h-24 bg-purple-500/10 rounded-[32px] flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">🖼️</div>
            <span className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors tracking-tight">
              {files.length > 0 ? `${files.length} Assets Staged` : 'Upload Visual Assets'}
            </span>
          </div>

          <button 
            onClick={handleConvert}
            disabled={files.length === 0 || loading}
            className={`w-full py-7 rounded-[28px] text-xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl ${
              files.length === 0 || loading 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-purple-500/20'
            }`}
          >
            {loading ? 'Processing Visual Data...' : 'Generate PDF'}
          </button>
        </div>
      </main>
    </div>
  );
}
