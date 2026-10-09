import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';
import TextField from '../../components/ui/TextField';

export default function UnitCatalog() {
  const [grouped, setGrouped] = useState({ Drug: [], 'Non-Drug': [] });
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const data = await api('/inventory');
    setGrouped(data.grouped);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function submit(item) {
    setError('');
    setMessage('');
    const quantity = Number(quantities[item.id] || 1);
    try {
      await api('/requisitions', { method: 'POST', body: { item_id: item.id, quantity } });
      setMessage(`Submitted Emergency request for ${item.name}.`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Available items</h1>
        <p className="text-sm text-outline">Requesting unit is locked to Emergency.</p>
      </div>
      {error && <p className="text-sm text-secondary">{error}</p>}
      {message && <p className="text-sm text-primary">{message}</p>}
      {['Drug', 'Non-Drug'].map((category) => (
        <section key={category}>
          <h2 className="mb-3 text-lg font-semibold">{category}s</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(grouped[category] || []).map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-outline">Stock {item.stock}</p>
                  </div>
                  <StatusChip value={item.category} />
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <TextField
                    label="Quantity"
                    type="number"
                    min="1"
                    max={item.stock}
                    value={quantities[item.id] ?? 1}
                    onChange={(e) => setQuantities((q) => ({ ...q, [item.id]: e.target.value }))}
                  />
                  <Button type="button" disabled={item.stock < 1} onClick={() => submit(item)}>
                    Request
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
