import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState('');

  async function load() {
    const data = await api('/users');
    setUsers(data.users);
    const next = {};
    data.users.forEach((user) => {
      next[user.id] = { role: user.role, approval_status: user.approval_status };
    });
    setDrafts(next);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function save(id) {
    setError('');
    try {
      await api(`/users/${id}`, { method: 'PATCH', body: drafts[id] });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Registration review</h1>
        <p className="text-sm text-outline">Approve accounts and assign Unit, Store, or Administrator roles.</p>
      </div>
      {error && <p className="text-sm text-secondary">{error}</p>}
      {users.map((user) => (
        <Card key={user.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-outline">{user.email}</p>
            <div className="mt-2">
              <StatusChip value={user.approval_status} />
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Button type="button" variant="outlined" onClick={() => navigate(`/dashboard/admin/activity?user_id=${user.id}`)}>
              History
            </Button>
            <label className="text-xs text-outline">
              Role
              <select
                className="mt-1 block rounded-xl border border-outline/25 bg-surface-container px-3 py-2 text-sm"
                value={drafts[user.id]?.role || user.role}
                onChange={(e) => setDrafts((d) => ({ ...d, [user.id]: { ...d[user.id], role: e.target.value } }))}
              >
                <option value="user">Unit User</option>
                <option value="store">Store Personnel</option>
                <option value="admin">Hospital Administrator</option>
              </select>
            </label>
            <label className="text-xs text-outline">
              Status
              <select
                className="mt-1 block rounded-xl border border-outline/25 bg-surface-container px-3 py-2 text-sm"
                value={drafts[user.id]?.approval_status || user.approval_status}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [user.id]: { ...d[user.id], approval_status: e.target.value } }))
                }
              >
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="declined">declined</option>
              </select>
            </label>
            <Button type="button" onClick={() => save(user.id)}>
              Save
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
