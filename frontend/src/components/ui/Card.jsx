export default function Card({ children, className = '' }) {
  return <div className={`rounded-m3 bg-surface-lowest p-6 shadow-m3 ${className}`}>{children}</div>;
}
