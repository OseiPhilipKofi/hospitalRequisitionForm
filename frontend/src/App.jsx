import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import PublicLayout from './components/layout/PublicLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Policy from './pages/public/Policy';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';
import UnitDashboard from './pages/unit/UnitDashboard';
import UnitCatalog from './pages/unit/UnitCatalog';
import StoreDashboard from './pages/store/StoreDashboard';
import StoreLogs from './pages/store/StoreLogs';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminActivity from './pages/admin/AdminActivity';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/dashboard/unit"
        element={
          <ProtectedRoute roles={['user']}>
            <AppShell role="user" />
          </ProtectedRoute>
        }
      >
        <Route index element={<UnitDashboard />} />
        <Route path="catalog" element={<UnitCatalog />} />
      </Route>
      <Route
        path="/dashboard/store"
        element={
          <ProtectedRoute roles={['store']}>
            <AppShell role="store" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StoreDashboard />} />
        <Route path="logs" element={<StoreLogs />} />
      </Route>
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AppShell role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="activity" element={<AdminActivity />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
