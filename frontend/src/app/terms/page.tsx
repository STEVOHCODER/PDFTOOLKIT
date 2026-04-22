import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:underline font-bold mb-10 tracking-widest uppercase text-xs">
          ← Back to Neural Suite
        </Link>
        <h1 className="text-6xl font-black text-white tracking-tighter">Terms of Service</h1>
        <p className="text-xl text-slate-500 font-medium text-blue-500">Usage Protocols</p>
        
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white underline decoration-blue-500/20">1. Acceptance</h2>
          <p className="leading-relaxed">By accessing Smart PDF Pro, you agree to bound by these terms. Our software is provided "as is" for high-performance PDF manipulation and data extraction.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white underline decoration-blue-500/20">2. Usage Limits</h2>
          <p className="leading-relaxed">Users are permitted to process documents within fair use limits. Automated bot scraping of our API endpoints is strictly prohibited unless authorized by neural admin protocols.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white underline decoration-blue-500/20">3. Liabilities</h2>
          <p className="leading-relaxed">Smart PDF Pro is not liable for data loss during processing. Ensure you maintain local backups of all sensitive PDF documents before initiation.</p>
        </section>

        <footer className="pt-20 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Smart PDF Pro • Engineering Excellence
        </footer>
      </div>
    </div>
  );
}
