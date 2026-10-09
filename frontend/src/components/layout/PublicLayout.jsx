import { NavLink, Outlet } from 'react-router-dom';
import { useAuth, dashboardPath } from '../../auth/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'General Services' },
  { to: '/policy', label: 'Policy' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-outline/10 bg-surface-lowest/90 backdrop-blur">
        <div className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid w-10 h-10 text-sm font-bold text-white place-items-center rounded-xl bg-secondary">EU</span>
            <span>
              <span className="block text-sm font-semibold">Emergency Unit</span>
              <span className="block text-xs text-outline">Hospital Requisition Platform</span>
            </span>
          </NavLink>
          <nav className="items-center hidden gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `m3-nav-indicator rounded-full px-4 py-2 text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-surface-container'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <NavLink to={dashboardPath(user.role)} className="px-4 py-2 text-sm font-medium text-white rounded-full bg-primary">
                Open dashboard
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" className="px-4 py-2 text-sm rounded-full text-primary">
                  Sign in
                </NavLink>
                <NavLink to="/register" className="px-4 py-2 text-sm font-medium text-white rounded-full bg-primary">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
        <nav className="flex gap-1 px-4 pb-3 overflow-x-auto md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${isActive ? 'bg-primary-container' : 'bg-surface-container'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl px-4 py-10 mx-auto">
        <Outlet />
      </main>
      <footer className="py-8 text-xs text-center border-t border-outline/10 text-outline">
        Emergency Unit Requisition Platform · Restricted clinical inventory workflow
      </footer>
    </div>
  );
}
