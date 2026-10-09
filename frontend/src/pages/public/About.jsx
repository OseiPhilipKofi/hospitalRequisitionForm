import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const principles = [
  { title: 'One shared catalogue', body: 'Drug and Non-Drug items are maintained in one inventory so requesting teams can check stock in a consistent place.' },
  { title: 'Clear ownership', body: 'Emergency Unit users submit requests, Store Personnel maintain the catalogue, and administrators make access and issue decisions.' },
  { title: 'Traceable decisions', body: 'Request status, administrator notes, and system activity are retained to support transparent handovers and review.' },
];

export default function About() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-[#143f4a] to-[#248676] px-7 py-10 text-white shadow-m3 md:px-12 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">About the platform</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">A calmer, clearer route from supply need to review.</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/80 md:text-base">
          The Hospital Requisition Platform brings Emergency Unit requests, central inventory, and administrative review into a
          single role-aware workflow. It is designed to make routine coordination easier to follow—not to replace local clinical
          judgement, inventory procedures, or urgent escalation channels.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((principle, index) => (
          <Card key={principle.title} className="border border-outline/10">
            <span className="text-xs font-bold tracking-[0.15em] text-primary">0{index + 1} · PRINCIPLE</span>
            <h2 className="mt-3 text-lg font-semibold">{principle.title}</h2>
            <p className="mt-2 text-sm leading-6 text-outline">{principle.body}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card className="border border-outline/10">
          <h2 className="text-xl font-semibold">How access works</h2>
          <ol className="mt-5 space-y-4">
            {[
              ['Register', 'A new account starts with the Emergency Unit user role and awaits review.'],
              ['Administrator review', 'Hospital Administration verifies the registration, approves or declines it, and can assign a Store or Administrator role.'],
              ['Role-specific workspace', 'Approved users see only the tools provided for their assigned role; the API independently enforces these permissions.'],
            ].map(([title, detail], index) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{index + 1}</span>
                <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-outline">{detail}</p></div>
              </li>
            ))}
          </ol>
        </Card>
        <div className="rounded-[1.75rem] bg-[#e5f2ee] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Built for clear handoffs</p>
          <h2 className="mt-3 text-2xl font-semibold">Every step has a responsible role.</h2>
          <p className="mt-3 text-sm leading-7 text-outline">
            Requesters can follow their submissions. Store Personnel can see completed issue decisions. Administrators can review
            account activity, request history, and changes to the active inventory.
          </p>
          <Link to="/services" className="mt-6 inline-flex font-semibold text-primary hover:underline">Explore the services →</Link>
        </div>
      </section>
    </div>
  );
}
