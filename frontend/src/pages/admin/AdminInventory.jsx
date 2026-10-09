import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusChip from '../../components/ui/StatusChip';

const emptyForm = { name: '', category: 'Drug', stock: '0' };

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api('/inventory');
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  function edit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, stock: String(item.stock) });
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    try {
      await api(editingId ? `/inventory/${editingId}` : '/inventory', {
        method: editingId ? 'PUT' : 'POST',
        body: { ...form, stock: Number(form.stock) },
      });
      cancelEdit();
      await load();
      setNotice(editingId ? 'Inventory item updated.' : 'Inventory item added.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Remove "${item.name}" from the active catalog? Existing requisition history will be preserved.`)) {
      return;
    }
    setError('');
    setNotice('');
    try {
      await api(`/inventory/${item.id}`, { method: 'DELETE' });
      await load();
      setNotice(`${item.name} was removed from the active catalog.`);
      if (editingId === item.id) cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-7">
      <header className="rounded-[2rem] bg-gradient-to-br from-primary via-[#087d78] to-[#58a99a] px-7 py-8 text-white shadow-m3 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Catalog control</p>
        <h1 className="mt-2 text-3xl font-semibold">Emergency inventory</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
          Maintain the active Drug and Non-Drug catalog. Removing an item keeps its existing requisition records available for audit.
        </p>
      </header>

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit inventory item' : 'Add an inventory item'}</h2>
          <p className="mt-1 text-sm text-outline">Changes are recorded in the administrator activity log.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]" onSubmit={save}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-outline">Item name</span>
            <input
              required
              maxLength="160"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-outline">Category</span>
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm"
            >
              <option>Drug</option>
              <option>Non-Drug</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-outline">Available stock</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) => setForm({ ...form, stock: event.target.value })}
              className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm"
            />
          </label>
          <div className="flex items-end gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add item'}</Button>
            {editingId && <Button type="button" variant="text" onClick={cancelEdit}>Cancel</Button>}
          </div>
        </form>
        {error && <p role="alert" className="mt-4 rounded-xl bg-[#fff0ef] px-4 py-3 text-sm text-[#9f3529]">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-xl bg-[#e7f5ef] px-4 py-3 text-sm text-[#176b51]">{notice}</p>}
      </Card>

      {['Drug', 'Non-Drug'].map((category) => {
        const categoryItems = items.filter((item) => item.category === category);
        return (
          <section key={category} className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{category === 'Drug' ? 'Medication' : 'Equipment & supplies'}</p>
                <h2 className="mt-1 text-xl font-semibold">{category}</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{categoryItems.length} items</span>
            </div>
            {categoryItems.length === 0 ? (
              <Card className="text-sm text-outline">No active {category.toLowerCase()} items.</Card>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {categoryItems.map((item) => (
                  <Card key={item.id} className="flex flex-wrap items-center justify-between gap-4 border border-outline/10 p-5">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusChip value={item.category} />
                        <span className="text-xs text-outline">{item.stock} in stock</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outlined" onClick={() => edit(item)}>Edit</Button>
                      <Button type="button" variant="danger" onClick={() => remove(item)}>Remove</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
