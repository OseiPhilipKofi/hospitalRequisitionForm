import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const policies = [
  {
    title: 'Account eligibility and approval',
    points: [
      'New registrations begin as Emergency Unit users and remain inactive until an administrator reviews them.',
      'Hospital Administration may approve or decline registrations and assign an appropriate system role.',
      'Keep account credentials private and use only your own approved account.',
    ],
  },
  {
    title: 'Role boundaries',
    points: [
      'Unit Users may submit Emergency requisitions and view their own request history.',
      'Store Personnel may maintain inventory and review completed request logs, but cannot submit Emergency requisitions or access administrator screens.',
      'Administrators review incoming requests, manage access, and oversee inventory and activity records.',
    ],
  },
  {
    title: 'Requests and stock records',
    points: [
      'The requesting unit is recorded as Emergency. Check item and quantity details before submission.',
      'A request remains pending until an administrator records an explicit decision.',
      'Stock is deducted only when a request is approved. Removed catalogue items remain associated with earlier requisition records.',
    ],
  },
  {
    title: 'Privacy and responsible use',
    points: [
      'Activity and access decisions are recorded to support system oversight and accountability.',
      'Do not include patient-identifying or sensitive clinical information in requisition notes or general contact messages.',
      'This platform supports supply coordination; follow approved hospital procedures for urgent clinical communication and escalation.',
    ],
  },
];

export default function Policy() {
  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] bg-gradient-to-br from-[#163f4a] to-[#2e8877] px-7 py-10 text-white shadow-m3 md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Platform policy</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Use the workflow with care.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">
          These guidelines describe how accounts, roles, requisitions, and activity records work within this platform.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {policies.map((policy, index) => (
          <Card key={policy.title} className="border border-outline/10 p-6 md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Guideline 0{index + 1}</p>
            <h2 className="mt-2 text-xl font-semibold">{policy.title}</h2>
            <ul className="mt-4 space-y-3">
              {policy.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6 text-outline">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="rounded-2xl bg-[#eaf4f1] px-5 py-4 text-sm leading-6 text-outline">
        Need help with account access, inventory, or a requisition? <Link to="/contact" className="font-semibold text-primary hover:underline">Contact the appropriate team.</Link>
      </p>
    </div>
  );
}
