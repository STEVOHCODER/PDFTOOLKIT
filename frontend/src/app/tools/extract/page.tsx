'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function ExtractTool() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/`)
      .then(res => res.ok ? setBackendStatus('online') : setBackendStatus('offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/extract`, { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        alert('Extraction failed. The file might be too complex or the server timed out.');
      }
    } catch (error) {
      alert('Connection error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!result) return;
    
    let csvRows = [];
    
    result.pages.forEach((page: any) => {
      csvRows.push(`PAGE ${page.page}`);
      if (page.tables && page.tables.length > 0) {
        page.tables.forEach((table: any, tIndex: number) => {
          csvRows.push(`TABLE ${tIndex + 1}`);
          table.forEach((row: any) => {
            const escapedRow = row.map((cell: any) => `"${(cell || '').replace(/"/g, '""')}"`);
            csvRows.push(escapedRow.join(','));
          });
          csvRows.push(''); 
        });
      } else {
        csvRows.push('No tables found on this page');
        csvRows.push(`"TEXT PREVIEW: ${(page.text || '').replace(/"/g, '""')}"`);
      }
      csvRows.push('-------------------------------------------');
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AI_Extraction_${file?.name || 'data'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200">
      <nav className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">AI Table Extractor</h1>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
               Backend {backendStatus}
             </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Neural Scan Protocol</h2>
            <p className="text-slate-500 font-medium text-lg">Converting unstructured PDF fragments into high-fidelity datasets.</p>
          </div>

          <div className="group relative border-2 border-dashed border-white/10 rounded-[40px] p-20 flex flex-col items-center justify-center mb-6 bg-white/[0.01] hover:bg-white/[0.03] hover:border-emerald-500/40 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">📂</div>
            <span className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight">
              {file ? file.name : 'Ignite Neural Scanner'}
            </span>
            {file && <span className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>}
          </div>

          <div className="mb-10 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest text-center">
            Note: For speed, only the first 20 pages are processed in depth.
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full py-7 rounded-[28px] text-xl font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl ${
              !file || loading 
                ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Scanning Streams... {elapsed}s</span>
              </div>
            ) : 'Execute Extraction'}
          </button>

          {result && (
            <div className="mt-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/5 rounded-[32px] border border-white/10 gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black text-white">Logic Sequence Complete</h3>
                  <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">{result.total_pages} Pages Synthesized</p>
                </div>
                <button 
                  onClick={downloadCSV}
                  className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-sm hover:bg-emerald-400 transition-all hover:scale-105 shadow-xl"
                >
                  DOWNLOAD DATASET (.CSV)
                </button>
              </div>

              <div className="space-y-8">
                {result.pages.map((page: any) => (
                  <div key={page.page} className="bg-white/[0.03] border border-white/5 rounded-[32px] p-8">
                    <div className="flex items-center justify-between mb-8">
                      <span className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Page {page.page}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{page.table_count} Matrices Isolated</span>
                    </div>
                    
                    {page.tables && page.tables.length > 0 ? (
                      <div className="space-y-8">
                        {page.tables.map((table: any, tIdx: number) => (
                          <div key={tIdx} className="overflow-x-auto rounded-2xl border border-white/5 bg-black/40">
                            <table className="w-full text-left text-[11px] font-semibold border-collapse">
                              <tbody>
                                {table.slice(0, 5).map((row: any, rIdx: number) => (
                                  <tr key={rIdx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    {row.map((cell: any, cIdx: number) => (
                                      <td key={cIdx} className="p-4 text-slate-400 max-w-[200px] truncate">{cell || '---'}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {table.length > 5 && <div className="p-3 text-center text-[9px] text-white/10 uppercase font-black">+{table.length - 5} more rows in export</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic text-sm border-l-2 border-emerald-500/20 pl-4 py-2">
                        No structural matrices detected. Raw text fragment: "{page.text}..."
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <div className="max-w-4xl mx-auto px-6 pb-20">
         <AdBanner slot="extract-footer" className="w-full h-60 rounded-[32px] bg-white/[0.02] border border-white/5" />
      </div>
    </div>
  );
}
