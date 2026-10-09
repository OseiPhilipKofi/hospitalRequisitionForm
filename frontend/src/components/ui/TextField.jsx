export default function TextField({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-outline">{label}</span>
      <input
        className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm outline-none ring-primary/30 transition focus:border-primary focus:ring-2"
        {...props}
      />
    </label>
  );
}
