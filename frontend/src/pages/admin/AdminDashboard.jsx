import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState('');

  async function load() {
    const data = await api('/requisitions');
    setRows(data.requisitions);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function review(id, status) {
    setError('');
    try {
      await api(`/requisitions/${id}`, {
        method: 'PATCH',
        body: { status, admin_notes: notes[id] || '' },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Active Emergency requisitions</h1>
        <p className="text-sm text-outline">Approve or decline pending unit requests. Approved issues deduct stock immediately.</p>
      </div>
      {error && <p className="text-sm text-secondary">{error}</p>}
      {rows.length === 0 && <Card>No pending requisitions.</Card>}
      {rows.map((row) => (
        <Card key={row.id} className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{row.item_name}</p>
              <p className="text-sm text-outline">
                {row.requester_username} ({row.requester_email}) · Qty {row.quantity} · on-hand {row.item_stock} · {row.created_at}
              </p>
            </div>
            <StatusChip value={row.status} />
          </div>
          <textarea
            className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm"
            placeholder="Optional review notes"
            value={notes[row.id] || ''}
            onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button type="button" onClick={() => review(row.id, 'Approved')}>
              Approve
            </Button>
            <Button type="button" variant="danger" onClick={() => review(row.id, 'Declined')}>
              Decline
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
