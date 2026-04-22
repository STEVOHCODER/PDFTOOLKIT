'use client';

import { useState, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [currentApiUrl, setCurrentApiUrl] = useState('');

  useEffect(() => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
    setCurrentApiUrl(apiUrl);
    
    console.log("Telemetry: Connecting to", apiUrl);

    fetch(`${apiUrl}/`)
      .then(res => res.ok ? setBackendStatus('online') : setBackendStatus('offline'))
      .catch((err) => {
        console.error("Link Failure:", err);
        setBackendStatus('offline');
      });
    
    fetch(`${apiUrl}/api/track/visit`).catch(() => {});
  }, []);

  const tools = [
    {
      name: 'Merge PDF',
      description: 'Seamlessly combine multiple PDF documents into one single file while maintaining formatting.',
      icon: '✨',
      href: '/tools/merge',
      color: 'from-blue-500 to-indigo-600',
      category: 'Edit'
    },
    {
      name: 'PDF Split',
      description: 'Extract specific pages or ranges from your PDF into new individual documents.',
      icon: '✂️',
      href: '/tools/split',
      color: 'from-rose-500 to-red-600',
      category: 'Edit'
    },
    {
      name: 'AI Table and Data Extractor',
      description: 'Advanced neural scan to extract structured tables, charts, and text into usable datasets.',
      icon: '🧪',
      href: '/tools/extract',
      color: 'from-emerald-500 to-teal-600',
      category: 'Data'
    },
    {
      name: 'Image to PDF',
      description: 'Convert JPG, PNG, and other image formats into professional, high-quality PDF files.',
      icon: '🖼️',
      href: '/tools/convert',
      color: 'from-violet-500 to-purple-600',
      category: 'Convert'
    },
    {
      name: 'PDF Compressor',
      description: 'Reduce PDF file size for easier sharing without losing essential document quality.',
      icon: '📉',
      href: '/tools/compress',
      color: 'from-orange-500 to-amber-600',
      category: 'Optimize'
    },
    {
      name: 'Image Compressor',
      description: 'Ultra-fast optimization for JPG and PNG images with up to 80% size reduction.',
      icon: '🖼️',
      href: '/tools/compress-image',
      color: 'from-amber-400 to-orange-500',
      category: 'Optimize'
    }
  ];

  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Edit', 'Convert', 'Data', 'Optimize'];

  const filteredTools = activeTab === 'All' 
    ? tools 
    : tools.filter(t => t.category === activeTab);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Smart PDF Pro",
    "operatingSystem": "Web-based",
    "applicationCategory": "UtilitiesApplication",
    "description": "Smart PDF Pro is an advanced suite of PDF utilities including merging, splitting, and data extraction using deep scan technology.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1204"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] overflow-x-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-lg md:text-xl">📄</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-none">
                SMART PDF <span className="text-blue-500">PRO</span>
              </h1>
              <span className="hidden md:block text-[8px] font-black uppercase tracking-[0.3em] text-blue-500/50 mt-1">Enterprise Neural Suite</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className={`hidden lg:flex flex-col items-end`}>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                backendStatus === 'online' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
              }`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${backendStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{backendStatus}</span>
              </div>
              <span className="text-[6px] font-black text-white/20 mt-1 uppercase truncate max-w-[100px]">{currentApiUrl}</span>
            </div>
            
            <Link href="/admin" className="group relative">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 p-1 group-hover:border-blue-500/50 transition-colors overflow-hidden">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-blue-400 transition-colors">
                  AD
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0c10] rounded-full"></div>
            </Link>
            
            <button className="bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
              Premium
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 md:px-6 py-12 text-center">
        <AdBanner slot="home-top" className="mb-8 md:mb-12 mx-auto w-full max-w-[728px] h-[60px] md:h-[90px] rounded-2xl border border-white/5" />

        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-8xl font-black tracking-tight text-white mb-6 uppercase italic leading-[1.1]">
            Smart PDF <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Professional.</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-xl font-medium max-w-2xl mx-auto mb-10 px-4">
            The world's most advanced neural processing suite for ultra-fast PDF manipulation and deep data extraction.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredTools.map((tool) => (
            <Link 
              key={tool.name} 
              href={tool.href}
              className="group relative backdrop-blur-md bg-white/[0.03] border border-white/10 p-8 rounded-[40px] text-left hover:bg-white/[0.06] transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {tool.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{tool.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                {tool.description}
              </p>
              <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-colors mt-auto">
                Execute Process
                <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </Link>
          ))}
        </div>

        <AdBanner slot="home-bottom" className="mt-24 mx-auto w-full max-w-[728px] h-[90px] rounded-2xl border border-white/5" />
      </main>

      <footer className="relative z-10 border-t border-white/5 pt-20 pb-10 bg-black/40 backdrop-blur-3xl">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-2xl mx-auto">
            <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/how-to" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">How To</Link>
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            &copy; 2026 Smart PDF Pro • Precision Document Engineering
          </p>
        </div>
      </footer>
    </div>
  );
}
