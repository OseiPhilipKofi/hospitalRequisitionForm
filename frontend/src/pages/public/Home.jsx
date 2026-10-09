import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const workflow = [
  { number: '01', title: 'Browse live availability', body: 'Check the current Emergency catalog across medication and clinical supplies before preparing a request.' },
  { number: '02', title: 'Submit with confidence', body: 'Send a quantity-specific requisition with the Emergency Unit recorded as the requesting service.' },
  { number: '03', title: 'Follow every decision', body: 'See pending, approved, or declined status in your own workspace. Approved issues update available stock.' },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#103c4a] via-primary to-[#43a18b] px-7 py-12 text-white shadow-m3 md:px-14 md:py-16">
        <div className="absolute -right-16 -top-20 -z-10 h-80 w-80 rounded-full border-[55px] border-white/5" />
        <div className="absolute -bottom-36 right-48 -z-10 h-80 w-80 rounded-full bg-[#c6efc9]/10 blur-3xl" />
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Emergency care · coordinated supply
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight md:text-6xl">
            The right supplies, moving with your team.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            A clear, accountable requisition workflow for Emergency Unit teams—from checking availability to tracking each review decision.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-[#eaf7f1]">
              Request account access
            </Link>
            <Link to="/services" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Explore platform services
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/20 pt-6 text-sm text-white/75">
            <span>Drug & Non-Drug catalog</span>
            <span>Administrator-reviewed issues</span>
            <span>Personal request tracking</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">A simple workflow</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">From catalog to decision, at a glance.</h2>
          </div>
          <Link to="/about" className="text-sm font-semibold text-primary hover:underline">How the platform works →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((item) => (
            <Card key={item.number} className="border border-outline/10 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">{item.number}</span>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-outline">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { eyebrow: 'Clinical team', title: 'Emergency Unit', body: 'Review what is available, request the quantities needed, and follow your own requests through approval.' },
          { eyebrow: 'Supply team', title: 'Central Store', body: 'Keep the Drug and Non-Drug catalog current and review the history of completed requisition decisions.' },
          { eyebrow: 'System governance', title: 'Hospital Administration', body: 'Approve new access, assign roles, review requests, and maintain inventory and audit visibility.' },
        ].map((card) => (
          <Card key={card.title} className="border border-outline/10 bg-gradient-to-br from-white to-[#f0f8f5]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{card.eyebrow}</p>
            <h2 className="mt-2 text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-outline">{card.body}</p>
          </Card>
        ))}
      </section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-[#e4f2ee] p-7 md:flex-row md:items-center md:px-9">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Need help or access?</p>
          <h2 className="mt-2 text-xl font-semibold">Our contact options are one step away.</h2>
          <p className="mt-1 text-sm text-outline">Choose a team, call the duty extension, or send a message.</p>
        </div>
        <Link to="/contact" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005858]">Contact the team</Link>
      </section>
    </div>
  );
}
