'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function MergeTool() {
  const [files, setFiles] = useState<File[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/merge`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "merged_document.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Merge failed. Ensure all files are valid PDFs and not password protected.');
      }
    } catch (error) {
      alert('Connection to backend failed. Please check if server is running.');
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
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Merge PDF</h1>
          </div>
          <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
             {backendStatus}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <AdBanner slot="merge-top" className="mb-12 w-full h-24 rounded-2xl border border-white/5" />

        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Unified Documents</h2>
            <p className="text-slate-500 font-medium">Merge multiple PDF layers into a single, high-fidelity master file.</p>
          </div>

          <div className="group relative border-2 border-dashed border-white/10 rounded-[40px] p-12 flex flex-col items-center justify-center mb-10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-blue-500/40 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" multiple onChange={handleFileChange} />
            <div className="w-20 h-20 bg-blue-500/10 rounded-[28px] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">✨</div>
            <span className="text-xl font-black text-white tracking-tight">Add PDF Files</span>
          </div>

          {files.length > 0 && (
            <div className="space-y-3 mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Processing Queue ({files.length})</p>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/[0.03] border border-white/5 p-4 rounded-2xl group hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-black text-white/20">0{idx + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</span>
                      <span className="text-[9px] text-slate-500 font-black">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button onClick={() => removeFile(idx)} className="text-rose-500/40 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={handleMerge}
            disabled={files.length < 2 || loading}
            className={`w-full py-7 rounded-[28px] text-xl font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl ${
              files.length < 2 || loading 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Synthesizing... {elapsed}s</span>
              </div>
            ) : 'Merge & Download'}
          </button>
        </div>
      </main>
    </div>
  );
}
