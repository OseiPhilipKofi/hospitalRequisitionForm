const styles = {
  Pending: 'bg-amber-100 text-amber-900',
  Approved: 'bg-emerald-100 text-emerald-900',
  Declined: 'bg-red-100 text-red-900',
  pending: 'bg-amber-100 text-amber-900',
  approved: 'bg-emerald-100 text-emerald-900',
  declined: 'bg-red-100 text-red-900',
  Drug: 'bg-primary-container text-primary-onContainer',
  'Non-Drug': 'bg-slate-200 text-slate-800',
};

export default function StatusChip({ value }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[value] || 'bg-surface-highest text-slate-700'}`}>
      {value}
    </span>
  );
}
