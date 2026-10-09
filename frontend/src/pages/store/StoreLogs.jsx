import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function StoreLogs() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/requisitions')
      .then((data) => setRows(data.requisitions))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Approved and declined logs</h1>
        <p className="text-sm text-outline">Store personnel can inspect completed administrator decisions only.</p>
      </div>
      {error && <p className="text-sm text-secondary">{error}</p>}
      {rows.length === 0 && <Card>No reviewed requisitions yet.</Card>}
      {rows.map((row) => (
        <Card key={row.id} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium">{row.item_name}</p>
            <p className="text-sm text-outline">
              {row.requester_username} · Qty {row.quantity} · {row.requesting_unit} · reviewed {row.reviewed_at || '—'}
            </p>
            {row.admin_notes && <p className="mt-1 text-sm">{row.admin_notes}</p>}
          </div>
          <StatusChip value={row.status} />
        </Card>
      ))}
    </div>
  );
}
