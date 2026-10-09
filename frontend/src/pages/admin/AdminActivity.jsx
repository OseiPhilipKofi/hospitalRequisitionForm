import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

const roleNames = { user: 'Unit User', store: 'Store Personnel', admin: 'Administrator' };

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${value.replace(' ', 'T')}Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminActivity() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedUserId = searchParams.get('user_id') || '';
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const query = selectedUserId ? `?user_id=${encodeURIComponent(selectedUserId)}` : '';
    setError('');
    api(`/activity${query}`)
      .then((data) => {
        setActivities(data.activities);
        setRequisitions(data.requisitions);
      })
      .catch((err) => setError(err.message));
  }, [selectedUserId]);

  const selectedUser = users.find((user) => String(user.id) === selectedUserId);

  return (
    <div className="space-y-7">
      <header className="rounded-[2rem] bg-gradient-to-br from-[#173b50] via-[#245e68] to-primary px-7 py-8 text-white shadow-m3 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Audit & accountability</p>
        <h1 className="mt-2 text-3xl font-semibold">Activity history</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
          Review workspace visits, account changes, inventory updates, and requisition decisions recorded by the system.
        </p>
      </header>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold">Filter by account</h2>
          <p className="mt-1 text-sm text-outline">Choose a user or store account to view its activity and request history.</p>
        </div>
        <label className="block w-full sm:max-w-sm">
          <span className="mb-1.5 block text-xs font-medium text-outline">Account</span>
          <select
            value={selectedUserId}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) next.set('user_id', event.target.value);
              else next.delete('user_id');
              setSearchParams(next);
            }}
            className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm"
          >
            <option value="">All account activity</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username} · {roleNames[user.role] || user.role}</option>
            ))}
          </select>
        </label>
      </Card>

      {error && <p role="alert" className="rounded-xl bg-[#fff0ef] px-4 py-3 text-sm text-[#9f3529]">{error}</p>}

      {selectedUser && (
        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="border border-outline/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-outline">Account</p>
            <p className="mt-2 font-semibold">{selectedUser.username}</p>
            <p className="mt-1 text-sm text-outline">{selectedUser.email}</p>
          </Card>
          <Card className="border border-outline/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-outline">Assigned role</p>
            <p className="mt-2 font-semibold">{roleNames[selectedUser.role] || selectedUser.role}</p>
          </Card>
          <Card className="border border-outline/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-outline">Approval</p>
            <div className="mt-2"><StatusChip value={selectedUser.approval_status} /></div>
          </Card>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">System record</p>
            <h2 className="mt-1 text-xl font-semibold">{selectedUser ? `${selectedUser.username}'s activity` : 'Recent activity'}</h2>
          </div>
          <span className="text-xs text-outline">Latest 500 events</span>
        </div>
        {activities.length === 0 && !error ? (
          <Card className="text-sm text-outline">No activity recorded for this view yet.</Card>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="flex flex-col gap-3 border border-outline/10 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary ring-4 ring-primary/10" />
                  <div>
                    <p className="font-medium">{activity.summary}</p>
                    <p className="mt-1 text-sm text-outline">
                      {activity.actor_username || 'Former account'} · {roleNames[activity.actor_role] || activity.actor_role}
                    </p>
                    {activity.page && <p className="mt-1 text-xs text-outline">Page: {activity.page}</p>}
                  </div>
                </div>
                <time className="shrink-0 text-xs text-outline">{formatDate(activity.created_at)}</time>
              </Card>
            ))}
          </div>
        )}
      </section>

      {selectedUser && (
        <section className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Request record</p>
            <h2 className="mt-1 text-xl font-semibold">Requisition history</h2>
          </div>
          {requisitions.length === 0 ? (
            <Card className="text-sm text-outline">This account has no requisitions.</Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-outline/10 bg-surface-lowest shadow-m3">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-surface-container text-xs uppercase tracking-wider text-outline">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Item</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Qty</th>
                    <th className="px-5 py-4 font-semibold">Requested</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Review notes</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitions.map((request) => (
                    <tr key={request.id} className="border-t border-outline/10">
                      <td className="px-5 py-4 font-medium">{request.item_name}</td>
                      <td className="px-5 py-4">{request.item_category}</td>
                      <td className="px-5 py-4">{request.quantity}</td>
                      <td className="px-5 py-4 text-outline">{formatDate(request.created_at)}</td>
                      <td className="px-5 py-4"><StatusChip value={request.status} /></td>
                      <td className="max-w-[220px] px-5 py-4 text-outline">{request.admin_notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
