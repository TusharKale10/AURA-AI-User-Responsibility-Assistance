import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--aura-bg)' }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden off-screen on mobile, always visible on md+ */}
      <div className={`fixed left-0 top-0 z-40 h-full transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen md:ml-60">

        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-black/[0.06]"
          style={{ backgroundColor: 'var(--aura-bg)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors -ml-1"
          >
            <Menu size={20} className="text-zinc-600" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/AURA.jpg" alt="AURA" className="w-6 h-6 rounded-md object-contain" />
            <span className="text-sm font-bold" style={{
              background: 'linear-gradient(135deg, #0d2d5e 0%, #0284c7 60%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>AURA</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
