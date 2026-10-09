import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';
import TextField from '../../components/ui/TextField';

export default function StoreDashboard() {
  const [grouped, setGrouped] = useState({ Drug: [], 'Non-Drug': [] });
  const [form, setForm] = useState({ name: '', category: 'Drug', stock: 0 });
  const [error, setError] = useState('');

  async function load() {
    const data = await api('/inventory');
    setGrouped(data.grouped);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function addItem(event) {
    event.preventDefault();
    setError('');
    try {
      await api('/inventory', {
        method: 'POST',
        body: { name: form.name, category: form.category, stock: Number(form.stock) },
      });
      setForm({ name: '', category: 'Drug', stock: 0 });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveStock(item, stock) {
    await api(`/inventory/${item.id}`, {
      method: 'PUT',
      body: { name: item.name, category: item.category, stock: Number(stock) },
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Store inventory</h1>
        <p className="text-sm text-outline">Add Drug or Non-Drug items and keep available stock current.</p>
      </div>
      <Card>
        <form className="grid gap-4 md:grid-cols-4 md:items-end" onSubmit={addItem}>
          <TextField label="Item name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-wide text-outline">Category</span>
            <select
              className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Drug</option>
              <option>Non-Drug</option>
            </select>
          </label>
          <TextField label="Opening stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <Button type="submit">Add item</Button>
        </form>
        {error && <p className="mt-3 text-sm text-secondary">{error}</p>}
      </Card>
      {['Drug', 'Non-Drug'].map((category) => (
        <section key={category}>
          <h2 className="mb-3 text-lg font-semibold">{category}s</h2>
          <div className="grid gap-3">
            {(grouped[category] || []).map((item) => (
              <Card key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <StatusChip value={item.category} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    defaultValue={item.stock}
                    className="w-24 rounded-xl border border-outline/25 bg-surface-container px-3 py-2 text-sm"
                    onBlur={(e) => {
                      if (Number(e.target.value) !== item.stock) {
                        saveStock(item, e.target.value);
                      }
                    }}
                  />
                  <span className="text-xs text-outline">units</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
