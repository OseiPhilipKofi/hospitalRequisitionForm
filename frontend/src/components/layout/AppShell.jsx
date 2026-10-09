import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';

const NAV = {
  user: [
    { to: '/dashboard/unit', label: 'Requisitions', icon: 'assignment' },
    { to: '/dashboard/unit/catalog', label: 'Catalog', icon: 'inventory' },
  ],
  store: [
    { to: '/dashboard/store', label: 'Inventory', icon: 'warehouse' },
    { to: '/dashboard/store/logs', label: 'Review logs', icon: 'history' },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Approvals', icon: 'fact_check' },
    { to: '/dashboard/admin/users', label: 'Registrations', icon: 'group' },
    { to: '/dashboard/admin/inventory', label: 'Inventory', icon: 'inventory' },
    { to: '/dashboard/admin/activity', label: 'Activity', icon: 'history' },
  ],
};

const TITLES = {
  user: 'Emergency Unit',
  store: 'Store Personnel',
  admin: 'Hospital Administrator',
};

export default function AppShell({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = NAV[role];
  const [activityError, setActivityError] = useState('');
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    if (lastTrackedPath.current === location.pathname) return;
    lastTrackedPath.current = location.pathname;
    setActivityError('');
    api('/activity', { method: 'POST', body: { page: location.pathname } })
      .catch((err) => setActivityError(`Page activity could not be recorded: ${err.message}`));
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-outline/10 bg-surface-lowest p-4 md:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white">EU</span>
          <div>
            <p className="text-sm font-semibold">{TITLES[role]}</p>
            <p className="text-xs text-outline">Material workspace</p>
          </div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center rounded-full px-4 py-3 text-sm font-medium ${isActive ? 'bg-secondary-container text-secondary' : 'text-slate-700 hover:bg-surface-container'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-outline/10 bg-surface-lowest px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{user?.username}</p>
            <p className="text-xs text-outline">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/" className="rounded-full px-3 py-2 text-sm text-primary">
              Public site
            </NavLink>
            <button
              className="rounded-full bg-surface-container px-4 py-2 text-sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-outline/10 bg-surface-lowest px-4 py-2 md:hidden">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm ${isActive ? 'bg-secondary-container' : 'bg-surface-container'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-8">
          {activityError && <p role="alert" className="mb-5 rounded-xl bg-[#fff0ef] px-4 py-3 text-sm text-[#9f3529]">{activityError}</p>}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
