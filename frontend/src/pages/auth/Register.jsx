import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { dashboardPath, useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import TextField from '../../components/ui/TextField';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const data = await register(form);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Register</h1>
      <p className="mt-1 text-sm text-outline">New accounts are created as Emergency Unit users and wait for administrator approval.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <TextField label="Username" required value={form.username} onChange={(e) => setField('username', e.target.value)} />
        <TextField label="Email" type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} />
        <TextField label="Password" type="password" required minLength={8} value={form.password} onChange={(e) => setField('password', e.target.value)} />
        {error && <p className="text-sm text-secondary">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Submitting…' : 'Submit registration'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-outline">
        Already approved? <Link to="/login" className="text-primary">Sign in</Link>
      </p>
    </Card>
  );
}
