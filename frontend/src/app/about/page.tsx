import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:underline font-black tracking-widest uppercase text-xs">
          ← Back to Suite
        </Link>
        
        <header className="space-y-6">
          <h1 className="text-7xl font-black text-white tracking-tighter italic">Engineering <br />The Future of <span className="text-blue-500">PDF.</span></h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">Smart PDF Pro was born from a simple observation: PDF tools should be fast, intelligent, and private. We've built a neural-accelerated suite that processes documents with surgical precision.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px]">
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest">Our Vision</h3>
            <p className="text-sm leading-relaxed">To democratize enterprise-grade PDF manipulation. We believe everyone should have access to deep-scan table extraction and high-fidelity compression without expensive subscriptions.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px]">
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest">Neural Tech</h3>
            <p className="text-sm leading-relaxed">By utilizing a hybrid processing engine (Pikepdf + PDFPlumber), we ensure that your documents are optimized at the object level while maintaining 100% data accuracy.</p>
          </div>
        </section>

        <footer className="pt-20 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Smart PDF Pro • Built for the Modern Web
        </footer>
      </div>
    </div>
  );
}
