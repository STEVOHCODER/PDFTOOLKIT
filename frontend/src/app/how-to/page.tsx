import Link from 'next/link';

export default function HowTo() {
  const steps = [
    { title: "Select Neural Tool", desc: "Choose the specific operation (Compress, Merge, or AI Extract) from our suite.", icon: "🎯" },
    { title: "Upload Protocol", desc: "Drag and drop your PDF files. Our system stages them in secure memory.", icon: "🛰️" },
    { title: "Neural Processing", desc: "The engine optimizes your data at the object level for peak performance.", icon: "⚡" },
    { title: "Secure Download", desc: "Retrieve your optimized file instantly. All staged data is purged.", icon: "💾" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:underline font-black tracking-widest uppercase text-xs">
          ← Back to Suite
        </Link>
        
        <header className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase">Usage <span className="text-blue-500">Manual.</span></h1>
          <p className="text-xl text-slate-500 max-w-xl">A technical guide to leveraging the full power of the Smart PDF Pro neural processing suite.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] group hover:bg-white/[0.04] transition-all">
              <div className="text-4xl mb-6">{s.icon}</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Step 0{i+1}</h3>
              <h4 className="text-2xl font-black text-white mb-4 tracking-tight">{s.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-white/[0.03] border border-white/10 p-12 rounded-[48px] space-y-8">
           <h2 className="text-2xl font-black text-white uppercase tracking-widest">Pro Tips</h2>
           <ul className="space-y-4 text-sm font-medium">
             <li className="flex items-center space-x-4"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> <span>Use the **AI Extractor** for complex financial PDFs with nested tables.</span></li>
             <li className="flex items-center space-x-4"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> <span>Compress large documents ({">"}50MB) before emailing to bypass server limits.</span></li>
             <li className="flex items-center space-x-4"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> <span>Multiple files? Use the **Merge** tool to consolidate them into one master file.</span></li>
           </ul>
        </section>

        <footer className="pt-20 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Smart PDF Pro • Document Intelligence
        </footer>
      </div>
    </div>
  );
}
