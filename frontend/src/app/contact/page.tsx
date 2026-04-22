import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-12">
      <div className="max-w-4xl mx-auto space-y-16 text-center">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:underline font-black tracking-widest uppercase text-xs">
          ← Back to Suite
        </Link>
        
        <header className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tight uppercase">System Support</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Contact Neural Admin Protocols</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[48px] space-y-4 group hover:border-blue-500/30 transition-all">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Support Email</h3>
            <p className="text-blue-500 font-bold text-lg">support@smartpdfpro.app</p>
            <p className="text-sm text-slate-500">24/7 priority response for technical issues and business inquiries.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[48px] space-y-4 group hover:border-emerald-500/30 transition-all">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">API Access</h3>
            <p className="text-emerald-500 font-bold text-lg">api@smartpdfpro.app</p>
            <p className="text-sm text-slate-500">Inquire about enterprise API integration and high-volume processing.</p>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[32px] max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase text-blue-400 tracking-[0.2em]">Response Telemetry: 99.8% within 12 hours</p>
        </div>

        <footer className="pt-20 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Smart PDF Pro • Connected for Support
        </footer>
      </div>
    </div>
  );
}
