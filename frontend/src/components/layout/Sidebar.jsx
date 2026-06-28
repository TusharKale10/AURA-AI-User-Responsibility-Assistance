import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Zap, BookOpen, Target, LogOut,
  Sparkles, BarChart2, GitBranch, Library, Activity, Settings,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const primary = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/tasks',      icon: CheckSquare,     label: 'Tasks'      },
  { to: '/planner',    icon: Sparkles,        label: 'AI Planner' },
  { to: '/goals',      icon: Target,          label: 'Goals'      },
  { to: '/reflection', icon: BookOpen,        label: 'Reflection' },
  { to: '/focus',      icon: Zap,             label: 'Focus'      },
];

const intelligence = [
  { to: '/analytics',    icon: BarChart2,  label: 'Analytics'        },
  { to: '/decision',     icon: GitBranch,  label: 'Decision Advisor' },
  { to: '/knowledge',    icon: Library,    label: 'Knowledge'        },
  { to: '/life-balance', icon: Activity,   label: 'Life Balance'     },
  { to: '/dna',          icon: Zap,        label: 'Productivity DNA' },
];

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `aura-nav-item group flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
        isActive ? 'active text-zinc-900' : 'text-zinc-500'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
            style={{ background: 'var(--aura-accent)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Icon
          size={15}
          className={`flex-shrink-0 transition-colors duration-150 ${
            isActive ? 'text-sky-500' : 'text-zinc-400 group-hover:text-zinc-700'
          }`}
        />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

function Avatar({ user }) {
  const initials = (user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-black/[0.06]"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-white text-xs font-bold leading-none tracking-tight">{initials}</span>
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="aura-sidebar w-60 min-h-screen flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src="/AURA.jpg" alt="AURA" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
          <div>
            <span className="text-sm font-bold tracking-tight" style={{
              background: 'linear-gradient(135deg, #0d2d5e 0%, #0284c7 60%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>AURA</span>
            <p className="text-[9px] text-zinc-400 leading-none mt-0.5 font-medium">AI User Responsibility Assistance</p>
          </div>
        </Link>
      </div>

      <div className="mx-4 border-t border-black/[0.06] mb-2" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {primary.map((item) => <NavItem key={item.to} {...item} />)}

        <div className="pt-4 pb-1.5 px-3">
          <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-[0.09em]">Intelligence</p>
        </div>
        {intelligence.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-black/[0.06] flex-shrink-0 mt-2">
        <Link
          to="/profile"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-zinc-50 transition-colors mb-1"
        >
          <Avatar user={user} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-zinc-800 truncate leading-tight">
              {user?.name || 'Loading…'}
            </p>
            <p className="text-[11px] text-zinc-400 truncate leading-tight mt-0.5">
              {user?.email || ''}
            </p>
          </div>
          <Settings size={13} className="text-zinc-300 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
        </Link>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-[10px] text-[13px] font-medium text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-150"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
