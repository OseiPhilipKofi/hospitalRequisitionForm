export default function Button({ children, variant = 'filled', className = '', ...props }) {
  const styles = {
    filled: 'bg-primary text-white hover:bg-[#005858]',
    tonal: 'bg-primary-container text-primary-onContainer hover:brightness-95',
    outlined: 'border border-outline/40 text-primary bg-transparent hover:bg-primary/5',
    text: 'text-primary hover:bg-primary/10',
    danger: 'bg-secondary text-white hover:bg-[#823628]',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 ${styles[variant] || styles.filled} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
