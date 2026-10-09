import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { dashboardPath, useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import TextField from '../../components/ui/TextField';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const next = await login(email, password);
      navigate(dashboardPath(next.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-outline">Use an approved hospital account.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-secondary">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Signing in…' : 'Continue'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-outline">
        No account? <Link to="/register" className="text-primary">Register as Emergency Unit staff</Link>
      </p>
      <div className="mt-6 rounded-2xl bg-surface-container p-4 text-xs leading-5 text-slate-600">
        Seeded access for local setup: admin@hospital.local / Admin@12345 · store@hospital.local / Store@12345 ·
        unit@hospital.local / Unit@12345
      </div>
    </Card>
  );
}
