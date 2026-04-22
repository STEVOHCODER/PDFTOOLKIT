'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [token, setToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('username', user);
    formData.append('password', pass);

    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        setIsLoggedIn(true);
        fetchStats(data.access_token);
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const fetchStats = async (t: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${apiUrl}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {}
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6">
        <div className="w-full max-w-md backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[48px] p-12 text-center">
          <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-2">Username</label>
              <input type="text" value={user} onChange={e => setUser(e.target.value)} className="w-full bg-black/40 px-6 py-4 rounded-2xl border border-white/10 text-white outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-2">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-black/40 px-6 py-4 rounded-2xl border border-white/10 text-white outline-none focus:border-blue-500 transition-colors" />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">Login to Dashboard</button>
          </form>
          <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Return to Site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] p-12 text-slate-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter">Command Center</h1>
          <button onClick={() => setIsLoggedIn(false)} className="px-6 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-colors">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-blue-500/20 text-6xl group-hover:scale-110 transition-transform">🛰️</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Global Reach</p>
            <h2 className="text-6xl font-black text-white">{stats?.total_visitors || 0}</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Total Unique Visitors</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-emerald-500/20 text-6xl group-hover:scale-110 transition-transform">⚡</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Success Rate</p>
            <h2 className="text-6xl font-black text-white">{stats?.total_downloads || 0}</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Successful PDF Operations</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-[48px] p-12">
          <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Neural Breakdown</h3>
          <div className="space-y-4">
            {stats?.breakdown && Object.entries(stats.breakdown).map(([tool, count]: any) => (
              <div key={tool} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">{tool.replace('-', ' ')}</span>
                <span className="text-2xl font-black text-white">{count}</span>
              </div>
            ))}
            {(!stats?.breakdown || Object.keys(stats.breakdown).length === 0) && (
              <p className="text-slate-500 italic text-sm">Waiting for initial telemetry data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
