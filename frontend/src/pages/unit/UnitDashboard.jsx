import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

export default function UnitDashboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await api('/requisitions');
      setRows(data.requisitions);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Emergency requisitions</h1>
        <p className="text-sm text-outline">Status updates automatically as administrators review your requests.</p>
      </div>
      {error && <p className="text-sm text-secondary">{error}</p>}
      <div className="grid gap-4">
        {rows.length === 0 && <Card>No requisitions yet. Open the catalog to submit a request.</Card>}
        {rows.map((row) => (
          <Card key={row.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{row.item_name}</p>
              <p className="text-sm text-outline">
                Qty {row.quantity} · {row.item_category} · {row.requesting_unit} · {row.created_at}
              </p>
              {row.admin_notes && <p className="mt-1 text-sm">Note: {row.admin_notes}</p>}
            </div>
            <StatusChip value={row.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}
