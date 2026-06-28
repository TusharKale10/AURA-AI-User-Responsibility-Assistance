import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PANEL_BG = { background: 'linear-gradient(145deg, #0a1628 0%, #0d2d5e 28%, #1255b0 58%, #0284c7 80%, #06b6d4 100%)' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)', top: '-10%', right: '-5%' }}
            animate={{ y: [0, -30, 0], scale: [1, 1.07, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)', bottom: '5%', left: '-5%' }}
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
          <div className="absolute inset-0 opacity-[0.04]"
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

        {/* Dashboard preview */}
        <div className="relative z-10">
          <div className="bg-white/8 border border-white/12 rounded-2xl p-5 mb-8 backdrop-blur-sm">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Today's Mission</div>
            <div className="bg-white/10 rounded-xl p-3 mb-3">
              <div className="text-sm font-semibold text-white mb-2">Complete System Design Review</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full">
                  <div className="h-1 w-4/5 rounded-full" style={{ background: 'linear-gradient(90deg, #38bdf8, #06b6d4)' }} />
                </div>
                <span className="text-[10px] text-white/50">80%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['8', 'Tasks'], ['5/8', 'Done'], ['4.2h', 'Focus']].map(([v, l]) => (
                <div key={l} className="bg-white/8 border border-white/10 rounded-lg p-2 text-center">
                  <div className="text-sm font-bold text-white">{v}</div>
                  <div className="text-[9px] text-white/40">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Your AI assistant is ready.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Sign in to access your personalized productivity workspace. Tasks, goals, and AI insights are waiting.
          </p>
          <div className="space-y-2">
            {['AI-powered daily planning', 'Goal progress tracking', 'Decision advisor', 'Productivity analytics'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-white/70 text-xs">
                <div className="w-4 h-4 rounded-full border border-sky-400/40 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(56,189,248,0.15)' }}>
                  <Check size={9} className="text-sky-300" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative z-10">© {new Date().getFullYear()} AURA</p>
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
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-zinc-500 mt-1.5">Sign in to your AURA workspace</p>
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
            <span className="text-xs text-zinc-400">or continue with email</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-700">Password</label>
                <button type="button" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="password" placeholder="Your password" value={form.password}
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
                : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 font-semibold hover:text-sky-700">Get started free</Link>
          </p>

          <p className="text-center mt-8">
            <Link to="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">← Back to homepage</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
