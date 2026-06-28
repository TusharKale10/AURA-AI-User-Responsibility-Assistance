import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PANEL_BG = { background: 'linear-gradient(145deg, #0a1628 0%, #0d2d5e 28%, #1255b0 58%, #0284c7 80%, #06b6d4 100%)' };

const PERKS = [
  { title: 'AI Planner',          desc: 'Convert any goal into a step-by-step plan.' },
  { title: 'Productivity DNA',    desc: 'Learns your peak hours and personalizes plans.' },
  { title: 'Decision Advisor',    desc: 'AI tells you what to work on next.' },
  { title: 'Life Balance Score',  desc: 'Track all life dimensions in one view.' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 relative overflow-hidden" style={PANEL_BG}>
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)', top: '5%', right: '-8%' }}
            animate={{ y: [0, -28, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.14), transparent 70%)', bottom: '8%', left: '-4%' }}
            animate={{ y: [0, 22, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #fff, transparent 60%)' }} />
        </div>

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <img src="/AURA.jpg" alt="AURA" className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5" />
          <div>
            <span className="font-bold text-white text-sm tracking-tight block">AURA</span>
            <span className="text-[9px] text-white/40 font-medium tracking-widest uppercase">AI User Responsibility Assistance</span>
          </div>
        </Link>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Start with a goal.<br />AURA handles the rest.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Join students, professionals and founders who use AURA to plan smarter and finish meaningful work.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {PERKS.map((p) => (
              <div key={p.title} className="rounded-xl p-3.5 border border-white/12 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="text-xs font-semibold text-white mb-1">{p.title}</div>
                <div className="text-[11px] text-white/40 leading-snug">{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['A', 'P', 'R', 'S'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0d2d5e] flex items-center justify-center text-xs font-semibold text-white/80"
                  style={{ background: 'rgba(56,189,248,0.2)' }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40">Join people already using AURA</p>
          </div>
        </div>

        <p className="text-white/20 text-xs relative z-10">© {new Date().getFullYear()} AURA. Free to start.</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-white">
        <motion.div className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}>

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <img src="/AURA.jpg" alt="AURA" className="w-8 h-8 rounded-xl object-contain" />
            <span className="font-bold text-zinc-900 tracking-tight">AURA</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-zinc-500 mt-1.5">Start planning smarter — it's free.</p>
          </div>

          {/* Google btn */}
          <button type="button"
            className="w-full flex items-center justify-center gap-2.5 border border-zinc-200 text-zinc-700 text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-50 transition-colors mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-xs text-zinc-400">or register with email</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Full name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="text" placeholder="Alex Johnson" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="password" placeholder="At least 6 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white transition-all" />
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2.5 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_rgba(2,132,199,0.4)] hover:shadow-[0_6px_20px_rgba(2,132,199,0.5)]"
              style={{ background: 'linear-gradient(135deg, #0d2d5e 0%, #1255b0 40%, #0284c7 70%, #06b6d4 100%)' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Create account <ArrowRight size={15} /></>}
            </button>

            <p className="text-center text-[11px] text-zinc-400 leading-relaxed">
              By creating an account you agree to our{' '}
              <span className="text-zinc-600 cursor-pointer hover:underline">Terms</span> and{' '}
              <span className="text-zinc-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 font-semibold hover:text-sky-700">Sign in</Link>
          </p>

          <p className="text-center mt-6">
            <Link to="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">← Back to homepage</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
