import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const services = [
  {
    code: '01',
    title: 'Emergency requisitions',
    category: 'For approved Unit Users',
    detail: 'Browse current catalogue availability, request a quantity, and track each submission through Pending, Approved, or Declined.',
    tags: ['Drug', 'Non-Drug'],
  },
  {
    code: '02',
    title: 'Inventory coordination',
    category: 'For Store Personnel',
    detail: 'Add catalogue items, maintain category and available stock, and inspect records of administrator-reviewed requests.',
    tags: ['Catalogue', 'Stock'],
  },
  {
    code: '03',
    title: 'Access administration',
    category: 'For Hospital Administrators',
    detail: 'Review registrations, approve or decline access, and assign the role required for each approved account.',
    tags: ['Accounts', 'Roles'],
  },
  {
    code: '04',
    title: 'Requisition review',
    category: 'For Hospital Administrators',
    detail: 'Assess incoming Emergency requests, record a decision and optional notes, and deduct approved quantities from stock.',
    tags: ['Review', 'Audit trail'],
  },
  {
    code: '05',
    title: 'Inventory and activity oversight',
    category: 'For Hospital Administrators',
    detail: 'Manage active Drug and Non-Drug items and review account activity alongside individual requisition histories.',
    tags: ['Inventory', 'Activity'],
  },
  {
    code: '06',
    title: 'Contact and platform support',
    category: 'For all visitors',
    detail: 'Reach the Emergency Unit, Central Store, or Hospital Administration by phone extension, email, SMS, WhatsApp, or a guided message form.',
    tags: ['Contact', 'Support'],
  },
];

export default function Services() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-[#123d4d] via-[#176d6c] to-[#53a48f] px-7 py-10 text-white shadow-m3 md:px-12 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">General services</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">One workflow, clear responsibilities.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80 md:text-base">
          Browse the services available across the Emergency requisition journey. Role-specific actions require an approved account.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Card key={service.code} className="flex h-full flex-col border border-outline/10 p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-xs font-bold text-primary">{service.code}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-outline">{service.category}</span>
            </div>
            <h2 className="mt-5 text-lg font-semibold">{service.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-outline">{service.detail}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {service.tags.map((tag) => <span key={tag} className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-primary">{tag}</span>)}
            </div>
          </Card>
        ))}
      </section>
      <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] bg-[#e5f2ee] p-7 sm:flex-row sm:items-center">
        <div><h2 className="text-xl font-semibold">Need access or have a question?</h2><p className="mt-1 text-sm text-outline">Our contact page has direct channels and a guided enquiry form.</p></div>
        <Link to="/contact" className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#005858]">Contact support</Link>
      </div>
    </div>
  );
}
