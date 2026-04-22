import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:underline font-bold mb-10 tracking-widest uppercase text-xs">
          ← Back to Neural Suite
        </Link>
        <h1 className="text-6xl font-black text-white tracking-tighter">Privacy Policy</h1>
        <p className="text-xl text-slate-500 font-medium">Last updated: April 22, 2026</p>
        
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">1. Data Sovereignty</h2>
          <p className="leading-relaxed">Smart PDF Pro (the "Application") operates on a privacy-first principle. We do not store user-uploaded PDF files permanently. Files are processed temporarily in memory or secure temp storage and are automatically deleted via neural cleanup cycles within 60 minutes.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">2. Cookies & Monitoring</h2>
          <p className="leading-relaxed">We use essential cookies to manage sessions and basic analytics for tool optimization. Third-party partners, like Google Adsense, may use cookies to serve personalized advertisements based on your browsing patterns on other websites.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">3. Third Party Ads</h2>
          <p className="leading-relaxed">Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.</p>
        </section>

        <footer className="pt-20 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Smart PDF Pro • Precision Privacy Protocols
        </footer>
      </div>
    </div>
  );
}
