import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Sparkles, Brain, Scale, BarChart2, RefreshCw, Target, BookOpen,
  Activity, Calendar, Rocket, ChevronDown, Menu, X, AlertTriangle,
  Zap, Clock, TrendingUp, ArrowRight, Star, Bell, Check,
  GraduationCap, Briefcase, Users, Code, Shield, CheckCircle,
} from 'lucide-react';

// â"€â"€â"€ Scroll-reveal wrapper â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  );
};

// â"€â"€â"€ Data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const AUDIENCES = [
  { icon: GraduationCap, label: 'Students',      desc: 'Exams, placement prep\n& assignments',   color: 'text-sky-600',     bg: 'bg-sky-50',     hoverBg: 'group-hover:bg-sky-100'     },
  { icon: Briefcase,     label: 'Professionals', desc: 'Projects, meetings\n& deadlines',         color: 'text-blue-600',    bg: 'bg-blue-50',    hoverBg: 'group-hover:bg-blue-100'    },
  { icon: Code,          label: 'Freelancers',   desc: 'Clients, invoices\n& deliverables',       color: 'text-cyan-600',    bg: 'bg-cyan-50',    hoverBg: 'group-hover:bg-cyan-100'    },
  { icon: Rocket,        label: 'Entrepreneurs', desc: 'Startups, launches\n& growth goals',      color: 'text-amber-600',   bg: 'bg-amber-50',   hoverBg: 'group-hover:bg-amber-100'   },
  { icon: Users,         label: 'Small Teams',   desc: 'Collaboration\n& shared goals',           color: 'text-emerald-600', bg: 'bg-emerald-50', hoverBg: 'group-hover:bg-emerald-100' },
];

const NAV_LINKS = [
  { label: 'Features',  id: 'features'          },
  { label: 'Analytics', id: 'analytics-preview'  },
  { label: 'About',     id: 'about'              },
  { label: 'FAQ',       id: 'faq'                },
];

const FEATURES = [
  { icon: Sparkles,  color: 'bg-sky-50 text-sky-600',         title: 'AI Planner',        desc: 'Convert any goal into a step-by-step execution plan with timelines and priorities.' },
  { icon: Rocket,    color: 'bg-blue-50 text-blue-600',       title: "Today's Mission",   desc: "One sentence. The single most important thing to act on before anything else today." },
  { icon: Scale,     color: 'bg-blue-50 text-blue-600',       title: 'Decision Advisor',  desc: 'AI compares tasks and recommends the best action with a confidence score and reasoning.' },
  { icon: Brain,     color: 'bg-purple-50 text-purple-600',   title: 'Productivity DNA',  desc: 'Learns your peak hours, best days, and personal patterns to personalize every plan.' },
  { icon: BarChart2, color: 'bg-emerald-50 text-emerald-600', title: 'Smart Analytics',   desc: 'Visual dashboards "" completion rates, focus trends, and AI-powered productivity scores.' },
  { icon: Target,    color: 'bg-amber-50 text-amber-600',     title: 'Goal Intelligence', desc: 'Break goals into milestones, detect deadline conflicts, and track progress automatically.' },
  { icon: BookOpen,  color: 'bg-sky-50 text-sky-600',         title: 'Knowledge Engine',  desc: 'Auto-generate checklists, resources, and timelines for any goal instantly.' },
  { icon: RefreshCw, color: 'bg-teal-50 text-teal-600',       title: 'Adaptive Planner',  desc: 'When schedules change, AURA instantly reorganizes your day with updated priorities.' },
  { icon: Activity,  color: 'bg-rose-50 text-rose-600',       title: 'Life Balance',      desc: 'Monitor career, health, habits, and relationships with AI wellness insights.' },
  { icon: Star,      color: 'bg-orange-50 text-orange-600',   title: 'Reflection',        desc: 'Daily AI reflection captures wins, blockers, and improvements for continuous growth.' },
];

const PROBLEMS = [
  { icon: Clock,         title: 'Missed Deadlines',        desc: 'Tasks slip because there\'s no intelligent prioritization "" just an endless list with no guidance.' },
  { icon: Brain,         title: 'Decision Fatigue',        desc: 'Spending more time deciding what to do than actually doing it.' },
  { icon: Calendar,      title: 'Overloaded Schedule',     desc: 'Everything is marked urgent. Nothing gets the focus it actually deserves.' },
  { icon: Bell,          title: 'Passive Reminders',       desc: 'Apps remind you of what you already know. They never help you actually plan.' },
  { icon: AlertTriangle, title: 'Hidden Conflicts',        desc: 'Two major deadlines on the same day "" discovered only when it\'s too late.' },
  { icon: TrendingUp,    title: 'No Progress Visibility',  desc: 'Hard to see if you\'re moving forward on goals that take weeks or months.' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma',  role: 'CS Student, IIT Bombay',    quote: 'AURA turned "get placed at a top company" into a 60-day execution plan while I balanced 6 courses. Got my offer from Google 3 weeks ahead of schedule.' },
  { name: 'Priya Patel',   role: 'Senior Product Manager',    quote: 'The Decision Advisor saves me 30 minutes every morning. I used to spend the first hour just deciding what to do first. Now I just start.' },
  { name: 'Rahul Mehta',   role: 'Freelance Developer',       quote: 'Running 5 client projects was chaos. AURA detects conflicts before they become problems and tells me exactly what to do first.' },
  { name: 'Sneha Gupta',   role: 'Startup Co-Founder',        quote: 'The Life Balance score showed I had completely neglected my health. That single AI insight changed how I plan my weeks permanently.' },
];

const FAQS = [
  { q: 'What makes AURA different from other task managers?',  a: 'AURA actively plans your day using AI. It detects deadline conflicts, recommends what to do next, generates preparation packs for goals, and learns your productivity patterns "" not just stores tasks.' },
  { q: 'Does AURA replace my calendar?',                       a: 'No. AURA complements your calendar by helping you plan and prioritize. The Adaptive Planner works around your existing commitments.' },
  { q: 'How does AI prioritize my tasks?',                     a: 'AURA uses a multi-factor engine: deadline urgency, estimated effort, your peak focus hours from Productivity DNA, task dependencies, and your personal completion history.' },
  { q: 'Can I use AURA as a student?',                         a: 'Absolutely "" students are a core audience. AURA handles assignments, placement prep, project deadlines, and study schedules while detecting conflicts across all of them.' },
  { q: 'Is my data private?',                                  a: 'Yes. Data is stored securely in your account and never shared with third parties. AI processing uses the Google Gemini API, which does not train on your personal data.' },
];

const CAROUSEL_CARDS = [
  {
    icon: Sparkles, title: 'AI Planner', desc: 'Turn one goal into a complete execution plan.',
    preview: (
      <div className="space-y-2">
        {[['Goal Set', 100], ['Tasks Created', 85], ['Timeline Built', 70], ['Plan Ready', 100]].map(([label, w], i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[8px] font-bold flex-shrink-0">{i+1}</div>
            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${w}%` }} />
            </div>
            <span className="text-[10px] text-zinc-400 w-20 text-right">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Brain, title: 'Productivity DNA', desc: 'AURA learns how you work and personalizes every recommendation.',
    preview: (
      <div className="space-y-2">
        {[
          { label: 'Best Coding Time',    value: '9""11 AM', dot: 'bg-emerald-500' },
          { label: 'Deep Focus Score',    value: 'High',    dot: 'bg-zinc-900'    },
          { label: 'Weekly Improvement',  value: '+18%',    dot: 'bg-zinc-600'    },
          { label: 'Consistency',         value: '92%',     dot: 'bg-zinc-400'    },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
              <span className="text-[10px] text-zinc-500">{item.label}</span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-900">{item.value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Scale, title: 'Decision Advisor', desc: 'AI compares priorities and recommends the best action.',
    preview: (
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 bg-zinc-900 text-white rounded-lg p-2 text-[10px] font-medium text-center">Task A âœ"</div>
          <div className="flex-1 bg-zinc-100 rounded-lg p-2 text-[10px] text-zinc-400 text-center">Task B</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-500">AI Confidence</span>
            <span className="text-[10px] font-bold text-zinc-900">92%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>
        <p className="text-[9px] text-zinc-400 italic">Task A has a closer deadline with higher impact.</p>
      </div>
    ),
  },
  {
    icon: BarChart2, title: 'Smart Analytics', desc: 'AI-powered insights and productivity trend analysis.',
    preview: (
      <div>
        <div className="flex items-end gap-1 h-14 mb-1">
          {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t"
              style={{ height: `${h}%`, background: i===5 ? '#18181B' : i===3 ? '#3f3f46' : '#e4e4e7' }} />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-zinc-400">
          {['M','T','W','T','F','S','S'].map((d,i) => <span key={i}>{d}</span>)}
        </div>
      </div>
    ),
  },
  {
    icon: RefreshCw, title: 'Adaptive Planner', desc: 'Schedules change "" AURA reorganizes your day instantly.',
    preview: (
      <div className="space-y-1.5">
        <div className="bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1.5 text-[10px] text-rose-600 font-medium">
          Meeting cancelled "" 2h freed
        </div>
        <div className="flex justify-center text-zinc-300 text-sm">â†"</div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-500">
          Suggested: Deep Work Session
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 text-[10px] text-emerald-700 font-medium">
          âœ" Plan updated automatically
        </div>
      </div>
    ),
  },
  {
    icon: Target, title: 'Goal Intelligence', desc: 'Goals into milestones, tasks and measurable progress.',
    preview: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-700 font-medium">Google SWE Placement</span>
          <span className="text-[10px] font-bold text-zinc-900">68%</span>
        </div>
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-900 rounded-full" style={{ width: '68%' }} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[['DSA', true], ['Resume', true], ['Mock', false]].map(([m, done]) => (
            <span key={m} className={`text-[9px] px-1.5 py-0.5 rounded-full ${done ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
              {done ? 'âœ"' : 'â—‹'} {m}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: BookOpen, title: 'Knowledge Engine', desc: 'Auto-generate checklists, resources and timelines.',
    preview: (
      <div className="space-y-1">
        <div className="text-[10px] text-zinc-500 font-medium mb-1.5">Google Interview Pack</div>
        {['Resume Polish', 'LeetCode Top 150', 'Week 1: Arrays & Strings', '10 Mock Interviews'].map((item) => (
          <div key={item} className="text-[10px] text-zinc-600 bg-zinc-50 rounded px-2 py-1 border border-zinc-100">{item}</div>
        ))}
      </div>
    ),
  },
  {
    icon: Activity, title: 'Life Balance', desc: 'Monitor all life dimensions with AI wellness insights.',
    preview: (
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Career', h: 78, hi: true }, { label: 'Learn', h: 82, hi: true },
          { label: 'Health', h: 45, hi: false }, { label: 'Finance', h: 60, hi: false },
          { label: 'Habits', h: 55, hi: false }, { label: 'Social', h: 38, hi: false },
        ].map((d) => (
          <div key={d.label} className="text-center">
            <div className="h-10 bg-zinc-100 rounded-lg flex items-end overflow-hidden p-0.5 mb-0.5">
              <div className="w-full rounded" style={{ height: `${d.h}%`, background: d.hi ? '#18181B' : '#a1a1aa' }} />
            </div>
            <div className="text-[9px] text-zinc-500">{d.label}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Rocket, title: 'Mission Control', desc: 'One dashboard that tells you exactly what to do next.',
    preview: (
      <div className="space-y-1.5">
        <div className="bg-zinc-900 rounded-lg p-2 text-white">
          <div className="text-[9px] uppercase tracking-widest opacity-50 mb-0.5">Today's Mission</div>
          <div className="text-[10px] font-semibold">Complete LeetCode Medium Set</div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[['8','Tasks'],['4.2h','Focus'],['62%','Done']].map(([v,l]) => (
            <div key={l} className="bg-zinc-50 rounded p-1.5 text-center border border-zinc-100">
              <div className="text-xs font-bold text-zinc-900">{v}</div>
              <div className="text-[9px] text-zinc-400">{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// â"€â"€â"€ Count-up number â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function CountUp({ to, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) + suffix : Math.round(v) + suffix
  );
  useEffect(() => {
    if (inView) animate(count, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
  }, [inView, count, to]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

// â"€â"€â"€ Nav â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_8px_rgba(0,0,0,0.06)]' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <img src="/AURA.jpg" alt="AURA" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
          <span className="font-bold text-zinc-900 tracking-tight text-sm">AURA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="text-[13px] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80 transition-all font-medium px-3 py-1.5 rounded-lg">
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="text-[13px] font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100/80 transition-all">
            Sign in
          </Link>
          <Link to="/register"
            className="text-[13px] font-semibold bg-zinc-900 text-white px-4 py-2 rounded-[10px] hover:bg-zinc-800 transition-colors shadow-sm">
            Get started
          </Link>
        </div>

        <button className="md:hidden p-1.5 text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/[0.06] overflow-hidden">
            <div className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map(({ label, id }) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors">
                  {label}
                </button>
              ))}
              <div className="flex gap-2 pt-3 border-t border-zinc-100 mt-2">
                <Link to="/login" className="flex-1 text-center border border-zinc-200 text-zinc-700 text-sm py-2.5 rounded-xl font-medium">Sign in</Link>
                <Link to="/register" className="flex-1 text-center bg-zinc-900 text-white text-sm py-2.5 rounded-xl font-medium">Get started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// â"€â"€â"€ Dashboard Mockup â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function DashboardMockup() {
  return (
    <div className="relative select-none">
      <div className="rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.06)] bg-white">
        {/* Browser chrome */}
        <div className="h-8 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="flex-1 mx-3">
            <div className="h-3 bg-zinc-200 rounded-full w-28 mx-auto" />
          </div>
        </div>

        <div className="flex" style={{ height: 340 }}>
          {/* Sidebar mock */}
          <div className="w-36 bg-zinc-50 border-r border-zinc-100 p-3 flex flex-col gap-0.5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <img src="/AURA.jpg" alt="AURA" className="w-5 h-5 rounded-md object-contain flex-shrink-0" />
              <span className="text-[11px] font-bold text-zinc-900">AURA</span>
            </div>
            {['Dashboard', 'Tasks', 'Goals', 'Analytics', 'DNA', 'Planner'].map((item, i) => (
              <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] relative ${
                i === 0 ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-400'
              }`}>
                {i === 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sky-500 rounded-r-full" />}
                <div className={`w-1.5 h-1.5 rounded-sm flex-shrink-0 ${i === 0 ? 'bg-white/40' : 'bg-zinc-200'}`} />
                {item}
              </div>
            ))}
          </div>

          {/* Main content mock */}
          <div className="flex-1 p-4 overflow-hidden bg-[#FAFAF8]">
            <div className="mb-3">
              <div className="h-3.5 bg-zinc-900 rounded w-24 mb-1.5" />
              <div className="h-2 bg-zinc-200 rounded w-16" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[['8','Tasks'], ['5/8','Done'], ['4.2h','Focus']].map(([v,l]) => (
                <div key={l} className="bg-white border border-zinc-100 rounded-xl p-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <div className="text-sm font-bold text-zinc-900">{v}</div>
                  <div className="text-[10px] text-zinc-400">{l}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 mb-2.5 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#18181B,#27272A)' }}>
              <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Today's Mission</div>
              <div className="text-[11px] font-semibold">Complete DSA "" LeetCode Medium</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full"><div className="h-1 w-3/5 bg-white rounded-full" /></div>
                <span className="text-[9px] opacity-50">60%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { t: 'System design review',      done: true,  p: 'high'   },
                { t: 'Submit assignment by 5 PM', done: false, p: 'urgent' },
                { t: 'Team standup call',         done: true,  p: 'medium' },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-zinc-100 bg-white">
                  <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.done ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-300'
                  }`}>
                    {task.done && <Check size={6} strokeWidth={3} className="text-white" />}
                  </div>
                  <span className={`text-[11px] flex-1 truncate ${task.done ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>{task.t}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    task.p === 'urgent' ? 'bg-rose-100 text-rose-600' : task.p === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-500'
                  }`}>{task.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <motion.div className="absolute -top-3 -right-3 bg-white border border-black/[0.07] rounded-xl px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-10"
        animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-zinc-700 whitespace-nowrap">5 tasks completed</span>
        </div>
      </motion.div>
      <motion.div className="absolute -bottom-3 -left-3 bg-white border border-black/[0.07] rounded-xl px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-10"
        animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.8, ease: 'easeInOut' }}>
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-sky-500" />
          <span className="text-xs font-semibold text-zinc-700 whitespace-nowrap">AI plan generated</span>
        </div>
      </motion.div>
    </div>
  );
}

// â"€â"€â"€ Feature Card â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function FeatureCard({ icon: Icon, title, desc, color, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="group aura-card aura-card-interactive p-5 h-full flex flex-col"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${color} transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1.5 group-hover:text-sky-600 transition-colors duration-200">{title}</h3>
        <p className="text-[13px] text-zinc-500 leading-relaxed">{desc}</p>
      </motion.div>
    </Reveal>
  );
}

// â"€â"€â"€ Carousel â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function CarouselCard({ card }) {
  const Icon = card.icon;
  return (
    <motion.div
      className="min-w-[280px] w-72 aura-card p-5 flex-shrink-0 select-none flex flex-col"
      whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center mb-3">
        <Icon size={16} className="text-zinc-800" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 mb-1">{card.title}</h3>
      <p className="text-[12px] text-zinc-500 mb-4 leading-relaxed">{card.desc}</p>
      <div className="bg-zinc-50 rounded-xl p-3 mb-4 flex-1 min-h-[80px]">{card.preview}</div>
      <Link to="/register" className="flex items-center gap-1 text-[12px] font-medium text-zinc-600 hover:text-sky-600 transition-colors group/link">
        Learn more <ArrowRight size={11} className="group-hover/link:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}

function FeatureCarousel() {
  const scrollRef = useRef(null);
  const animRef   = useRef(null);
  const paused    = useRef(false);
  const dragging  = useRef(false);
  const startX    = useRef(0);
  const startSL   = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tick = () => {
      if (!paused.current && el) {
        el.scrollLeft += 0.45;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollLeft = 0;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div ref={scrollRef}
      className="flex gap-4 overflow-x-auto pb-4"
      style={{ scrollbarWidth: 'none', cursor: 'grab' }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; dragging.current = false; if (scrollRef.current) scrollRef.current.style.cursor='grab'; }}
      onMouseDown={(e) => { dragging.current=true; paused.current=true; startX.current=e.clientX; startSL.current=scrollRef.current.scrollLeft; scrollRef.current.style.cursor='grabbing'; }}
      onMouseMove={(e) => { if (!dragging.current) return; scrollRef.current.scrollLeft=startSL.current-(e.clientX-startX.current); }}
      onMouseUp={() => { dragging.current=false; if(scrollRef.current) scrollRef.current.style.cursor='grab'; setTimeout(()=>{paused.current=false;},800); }}
    >
      {CAROUSEL_CARDS.map((card, i) => <CarouselCard key={i} card={card} />)}

      {/* CTA card */}
      <div className="min-w-[280px] w-72 flex-shrink-0 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4"
        style={{ background: 'linear-gradient(135deg,#18181B,#27272A)' }}>
        <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
          <Rocket size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-1.5">Ready to try AURA?</h3>
          <p className="text-[12px] text-white/50 leading-relaxed">Start planning smarter today.</p>
        </div>
        <div className="space-y-2 w-full">
          <Link to="/register" className="block w-full text-center text-sm font-semibold bg-white text-zinc-900 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors">
            Create free account
          </Link>
          <Link to="/login" className="block w-full text-center text-sm text-white/50 hover:text-white transition-colors py-1">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

// â"€â"€â"€ FAQ â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group">
        <span className="text-[13px] font-medium text-zinc-900 group-hover:text-sky-600 transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-zinc-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="text-[13px] text-zinc-500 pb-4 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// â"€â"€â"€ Main Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--aura-bg)', color: 'var(--aura-text-1)' }}>
      <Nav />

      {/* â"€â"€ HERO â"€â"€ */}
      <section id="hero" className="pt-24 pb-20 px-5 sm:px-6 relative overflow-hidden">
        {/* Floating gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute rounded-full"
            style={{ width: 520, height: 520, background: 'radial-gradient(circle, rgba(129,140,248,0.13), transparent 70%)', top: '-12%', right: '-4%' }}
            animate={{ y: [0, -36, 0], x: [0, 18, 0], scale: [1, 1.07, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute rounded-full"
            style={{ width: 340, height: 340, background: 'radial-gradient(circle, rgba(196,181,253,0.10), transparent 70%)', bottom: '8%', left: '-6%' }}
            animate={{ y: [0, 28, 0], x: [0, -12, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
          <motion.div className="absolute rounded-full"
            style={{ width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', top: '45%', left: '28%' }}
            animate={{ y: [0, -18, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full mb-6 tracking-wide">
                <img src="/AURA.jpg" alt="AURA" className="w-4 h-4 rounded object-contain" /> AI User Responsibility Assistance
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.06] tracking-[-0.03em] mb-5"
                style={{
                  background: 'linear-gradient(135deg, #0d2d5e 0%, #1255b0 28%, #0284c7 55%, #06b6d4 76%, #7dd3fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                Meet AURA<br />AI User<br />Responsibility<br />Assistance
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-base sm:text-lg text-zinc-500 leading-relaxed mb-8 max-w-md">
                AURA doesn't remind you what you already know. It plans, prioritizes and guides your day so you finish meaningful work before deadlines slip.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="flex items-center gap-3 flex-wrap">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <Link to="/register"
                    className="relative inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold text-sm px-6 py-3 rounded-[10px] overflow-hidden group/btn
                               shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.12)]">
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
                    Get started free <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 font-medium text-sm px-5 py-3 rounded-[10px] hover:bg-white hover:border-zinc-300 transition-all">
                  See features
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex items-center gap-5 mt-7 text-xs text-zinc-400">
                {['Free to start', 'No credit card', 'AI-powered'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={11} className="text-emerald-500" /> {t}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="relative hidden md:block">
            <DashboardMockup />
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ AUDIENCE CARDS â"€â"€ */}
      <section className="py-14 border-y border-black/[0.05] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <Reveal>
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold text-center mb-8">Built for every kind of achiever</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {AUDIENCES.map(({ icon: Icon, label, desc, color, bg, hoverBg }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  className="group cursor-default rounded-2xl border border-black/[0.06] bg-white p-5 flex flex-col items-center text-center gap-3
                             shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] hover:border-black/[0.1] transition-[box-shadow,border-color] duration-200"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${hoverBg} transition-all duration-200 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={20} className={`${color} transition-transform duration-200`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{label}</p>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug whitespace-pre-line">{desc}</p>
                  </div>
                  <div className={`h-[2px] w-0 group-hover:w-8 rounded-full transition-all duration-300 ${color.replace('text-', 'bg-')}`} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ PROBLEMS â"€â"€ */}
      <section className="py-20 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">The Problem</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">You're not unproductive. You're under-planned.</h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto text-sm">Most apps help you collect tasks. None help you decide what to do with them.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.05}>
                  <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                    className="aura-card aura-card-interactive p-5">
                    <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                      <Icon size={15} className="text-rose-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-1">{p.title}</h3>
                    <p className="text-[13px] text-zinc-500 leading-relaxed">{p.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* â"€â"€ SOLUTION â"€â"€ */}
      <section className="py-20 px-5 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Why AURA is Different</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">From passive reminders to active intelligence</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            <Reveal delay={0.05}>
              <div className="aura-card p-6">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-5">Traditional Apps</p>
                <div className="space-y-3">
                  {['Reminder sent', 'Notification dismissed', 'Task forgotten', 'Deadline missed', 'ðŸ˜ž Stress & regret'].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-[10px] font-bold flex-shrink-0">{i+1}</div>
                      <span className="text-sm text-zinc-500">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#18181B 0%,#27272A 100%)' }}>
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%,#38bdf8 0%,transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles size={13} className="text-sky-400" />
                    <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">AURA</p>
                  </div>
                  <div className="space-y-3">
                    {['AI-generated plan', 'Tasks prioritized by impact', 'Conflict detection', 'Adaptive scheduling', 'âœ" Goal completed on time'].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-[10px] font-bold flex-shrink-0">{i+1}</div>
                        <span className="text-sm text-white/80">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â"€â"€ FEATURES â"€â"€ */}
      <section id="features" className="py-20 px-5 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Features</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">Everything you need, nothing you don't</h2>
            <p className="text-zinc-500 mt-3 text-sm max-w-lg mx-auto">10 AI-powered tools that work together to make you dramatically more effective.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.03} />)}
          </div>
        </div>
      </section>

      {/* â"€â"€ ANALYTICS PREVIEW â"€â"€ */}
      <section id="analytics-preview" className="py-20 px-5 sm:px-6 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Analytics</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">Insights that drive real improvement</h2>
            <p className="text-zinc-500 mt-3 text-sm max-w-lg mx-auto">
              See exactly how you're working "" and where to improve "" with AI-generated analysis.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Completion Rate', to: 82,  suffix: '%',  decimals: 0, change: '+12%',    color: 'text-emerald-600' },
              { label: 'Focus / Day',     to: 4.2, suffix: 'h',  decimals: 1, change: '+0.8h',   color: 'text-emerald-600' },
              { label: 'Weekly Tasks',    to: 34,  suffix: '',   decimals: 0, change: '+5',       color: 'text-emerald-600' },
              { label: 'Active Goals',    to: 3,   suffix: '',   decimals: 0, change: 'On track', color: 'text-sky-600'  },
            ].map((kpi, i) => (
              <Reveal key={kpi.label} delay={i * 0.05}>
                <motion.div whileHover={{ y: -4, scale: 1.015 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                  className="aura-card aura-card-interactive p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[11px] font-medium text-zinc-400">{kpi.label}</span>
                    <span className={`text-[11px] font-semibold ${kpi.color}`}>{kpi.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 tracking-tight">
                    <CountUp to={kpi.to} suffix={kpi.suffix} decimals={kpi.decimals} />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Reveal>
              <div className="aura-card p-5">
                <p className="text-[12px] font-semibold text-zinc-700 mb-4">Weekly Productivity</p>
                <div className="flex items-end gap-1.5 h-20">
                  {[55, 72, 61, 88, 76, 94, 80].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all"
                      style={{ height: `${h}%`, background: i===5?'#18181B':i===3?'#52525B':'#e4e4e7' }} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5">
                  {['M','T','W','T','F','S','S'].map((d,i) => <span key={i}>{d}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="aura-card p-5">
                <p className="text-[12px] font-semibold text-zinc-700 mb-4">Productivity by Category</p>
                <div className="space-y-3">
                  {[
                    { label: 'Work & Career',     pct: 78 },
                    { label: 'Learning & Study',  pct: 92 },
                    { label: 'Health & Habits',   pct: 45 },
                    { label: 'Personal Projects', pct: 61 },
                  ].map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-500">{c.label}</span>
                        <span className="font-semibold text-zinc-900">{c.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-zinc-900 rounded-full"
                          initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                          viewport={{ once: true }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â"€â"€ MINI PREVIEWS â"€â"€ */}
      <section className="py-20 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text tracking-tight">A complete productivity system</h2>
            <p className="text-zinc-500 mt-3 text-sm max-w-lg mx-auto">Every feature is connected. Every insight makes the next one smarter.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Decision Advisor */}
            <Reveal>
              <motion.div whileHover={{ y:-5, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                className="aura-card aura-card-interactive p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center"><Scale size={13} className="text-blue-600" /></div>
                  <p className="text-sm font-semibold text-zinc-900">Decision Advisor</p>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-900 text-white rounded-xl p-2.5 text-center">
                      <div className="text-[11px] font-semibold">Submit Report</div>
                      <div className="text-[10px] text-white/50 mt-0.5">Due: Today</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-2.5 text-center">
                      <div className="text-[11px] font-medium text-zinc-600">Team Meeting</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Due: +3 days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-zinc-500">Confidence</span>
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-900">94%</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 italic">Submit the report first "" it has a hard deadline.</p>
                </div>
              </motion.div>
            </Reveal>

            {/* Knowledge Engine */}
            <Reveal delay={0.06}>
              <motion.div whileHover={{ y:-5, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                className="aura-card aura-card-interactive p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center"><BookOpen size={13} className="text-sky-600" /></div>
                  <p className="text-sm font-semibold text-zinc-900">Knowledge Engine</p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-zinc-400 mb-2">Generated for: <strong className="text-zinc-700">Google SWE Interview</strong></div>
                  {[
                    { label: 'Resume Review & Polish',    color: 'bg-emerald-50 border-emerald-100 text-emerald-700'  },
                    { label: 'LeetCode Top 150 Problems', color: 'bg-blue-50 border-blue-100 text-blue-700'           },
                    { label: 'Week 1: Arrays & Strings',  color: 'bg-zinc-50 border-zinc-200 text-zinc-600'           },
                    { label: 'Think aloud in interviews', color: 'bg-amber-50 border-amber-100 text-amber-700'        },
                  ].map((item) => (
                    <div key={item.label} className={`border rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${item.color}`}>{item.label}</div>
                  ))}
                </div>
              </motion.div>
            </Reveal>

            {/* Life Balance */}
            <Reveal delay={0.12}>
              <motion.div whileHover={{ y:-5, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                className="aura-card aura-card-interactive p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center"><Activity size={13} className="text-rose-600" /></div>
                  <p className="text-sm font-semibold text-zinc-900">Life Balance Score</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Career', v: 82, hi: true }, { label: 'Learn', v: 76, hi: true },
                    { label: 'Health', v: 42, hi: false }, { label: 'Finance', v: 65, hi: false },
                    { label: 'Habits', v: 55, hi: false }, { label: 'Social', v: 38, hi: false },
                  ].map((d) => (
                    <div key={d.label} className="text-center">
                      <div className="relative h-12 bg-zinc-100 rounded-lg overflow-hidden mb-1">
                        <div className="absolute bottom-0 left-0 right-0 rounded-lg"
                          style={{ height: `${d.v}%`, background: d.hi ? '#18181B' : '#a1a1aa' }} />
                      </div>
                      <div className="text-[9px] text-zinc-500">{d.label}</div>
                      <div className="text-[9px] font-bold text-zinc-900">{d.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                  <p className="text-[10px] text-amber-700">âš  Health score below target "" schedule exercise.</p>
                </div>
              </motion.div>
            </Reveal>

            {/* Productivity DNA */}
            <Reveal delay={0.04}>
              <motion.div whileHover={{ y:-5, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                className="aura-card aura-card-interactive p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center"><Brain size={13} className="text-purple-600" /></div>
                  <p className="text-sm font-semibold text-zinc-900">Productivity DNA</p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Peak Focus Hours', value: '9 "" 11 AM', pct: 90 },
                    { label: 'Best Work Days',   value: 'Mon, Tue',  pct: 80 },
                    { label: 'Completion Rate',  value: '82%',       pct: 82 },
                    { label: 'Consistency',      value: '94%',       pct: 94 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-500">{item.label}</span>
                        <span className="font-semibold text-zinc-900">{item.value}</span>
                      </div>
                      <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>

            {/* Adaptive Planner */}
            <Reveal delay={0.1}>
              <motion.div whileHover={{ y:-5, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                className="aura-card aura-card-interactive p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center"><RefreshCw size={13} className="text-teal-600" /></div>
                  <p className="text-sm font-semibold text-zinc-900">Adaptive Planner</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                    <div className="text-[10px] text-rose-600 font-medium">Meeting cancelled @ 2 PM</div>
                    <div className="text-[10px] text-rose-400 mt-0.5">2 hours freed up</div>
                  </div>
                  <div className="flex items-center justify-center text-zinc-300">â†"</div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
                    <div className="text-[10px] text-zinc-500 font-medium">AURA suggests:</div>
                    <div className="text-[10px] text-zinc-800 font-semibold mt-0.5">Deep Work "" System Design Review</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
                    <div className="text-[10px] text-emerald-700 font-medium">âœ" Plan updated automatically</div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Goal Intelligence */}
            <Reveal delay={0.16}>
              <motion.div whileHover={{ y:-5, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                className="aura-card aura-card-interactive p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center"><Target size={13} className="text-amber-600" /></div>
                  <p className="text-sm font-semibold text-zinc-900">Goal Intelligence</p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { title: 'Land a top tech job',  progress: 68, done: 3, total: 5, due: 'Dec 2025' },
                    { title: 'Launch side project',  progress: 35, done: 3, total: 8, due: 'Nov 2025' },
                  ].map((goal) => (
                    <div key={goal.title} className="border border-zinc-100 rounded-xl p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-semibold text-zinc-900">{goal.title}</span>
                        <span className="text-[10px] text-zinc-900 font-bold">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>{goal.done}/{goal.total} milestones</span>
                        <span>Due {goal.due}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* â"€â"€ TESTIMONIALS â"€â"€ */}
      <section className="py-20 px-5 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">People who stopped missing deadlines</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <motion.div whileHover={{ y:-4, scale:1.01 }} transition={{ type:'spring', stiffness:380, damping:26 }}
                  className={`rounded-2xl p-6 ${i===0 ? 'text-white' : 'aura-card aura-card-interactive'}`}
                  style={i===0 ? { background:'linear-gradient(135deg,#18181B,#27272A)' } : undefined}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_,s) => <Star key={s} size={12} className={i===0?'text-white fill-white':'text-amber-400 fill-amber-400'} />)}
                  </div>
                  <p className={`text-sm leading-relaxed mb-5 italic ${i===0?'text-white/75':'text-zinc-600'}`}>"{t.quote}"</p>
                  <div>
                    <div className={`text-sm font-semibold ${i===0?'text-white':'text-zinc-900'}`}>{t.name}</div>
                    <div className={`text-xs mt-0.5 ${i===0?'text-white/40':'text-zinc-400'}`}>{t.role}</div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â"€â"€ FAQ â"€â"€ */}
      <section id="faq" className="py-20 px-5 sm:px-6 scroll-mt-16">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-10">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">Common questions</h2>
          </Reveal>
          <Reveal>
            <div className="aura-card px-6 divide-y divide-zinc-100">
              {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ ABOUT â"€â"€ */}
      <section id="about" className="py-20 px-5 sm:px-6 bg-white scroll-mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <img src="/AURA.jpg" alt="AURA" className="w-12 h-12 rounded-2xl object-contain mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text tracking-tight mb-4">
              Built for people who want to do meaningful work
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
              AURA was created out of frustration with tools that collect tasks but never help you actually finish them. We built an AI that plans with you, not just for you "" understanding context, deadlines, energy, and priorities.
            </p>
            <div className="flex items-center justify-center gap-8 my-8 flex-wrap">
              {[
                { to: 10, suffix: '+', label: 'AI Features', color: 'text-sky-600' },
                { to: 9,  suffix: '',  label: 'Life Dimensions tracked', color: 'text-blue-600' },
                { to: 100, suffix: '%', label: 'Free to start', color: 'text-emerald-600' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-3xl font-bold tracking-tight ${stat.color}`}>
                    <CountUp to={stat.to} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-400 flex-wrap">
              {['Open to all users', 'Privacy-first design', 'Continuously improving AI'].map((t) => (
                <div key={t} className="flex items-center gap-1.5"><Check size={13} className="text-emerald-500" /> {t}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* â"€â"€ FEATURE CAROUSEL â"€â"€ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-10 px-5 sm:px-6">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Why People Choose AURA</span>
            <h2 className="text-2xl sm:text-3xl font-bold aura-gradient-text mt-2 tracking-tight">More than a productivity app</h2>
            <p className="text-zinc-500 mt-3 text-sm max-w-lg mx-auto">
              AI User Responsibility Assistance "" plans, adapts, analyzes and helps you complete meaningful work.
            </p>
          </Reveal>
          <div className="pl-5 sm:pl-6">
            <FeatureCarousel />
          </div>
        </div>
      </section>

      {/* â"€â"€ FINAL CTA â"€â"€ */}
      <section className="py-24 px-5 sm:px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#18181B 0%,#27272A 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 40%,#38bdf8 0%,transparent 60%)' }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Ready to stop missing deadlines?</h2>
            <p className="text-white/50 text-base sm:text-lg mb-8 leading-relaxed">
              Start planning smarter today. Your AI User Responsibility Assistance is ready.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold text-sm px-7 py-3.5 rounded-[10px] hover:bg-zinc-100 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Create free account <ArrowRight size={14} />
              </Link>
              <Link to="/login"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-medium text-sm px-6 py-3.5 rounded-[10px] hover:bg-white/10 transition-colors">
                Sign in
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-white/[0.05] py-12 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/AURA.jpg" alt="AURA" className="w-7 h-7 rounded-lg object-contain flex-shrink-0 bg-white" />
                <span className="font-bold text-white tracking-tight text-sm">AURA</span>
              </div>
              <p className="text-white/35 text-xs max-w-xs leading-relaxed">
                AI User Responsibility Assistance. Plan smarter, focus deeper, achieve more.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[
                { title: 'Product', links: ['Features', 'Analytics', 'Pricing'] },
                { title: 'Company', links: ['About', 'Privacy', 'Terms']        },
                { title: 'Connect', links: ['GitHub', 'LinkedIn', 'Twitter']    },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest mb-3">{col.title}</p>
                  <div className="space-y-2">
                    {col.links.map((l) => (
                      <Link key={l} to="/" className="block text-xs text-white/30 hover:text-white/60 transition-colors">{l}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">&copy; {new Date().getFullYear()} AURA. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/login"    className="text-xs text-white/25 hover:text-white/50 transition-colors">Sign in</Link>
              <Link to="/register" className="text-xs text-white/25 hover:text-white/50 transition-colors">Get started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

