import { useState } from 'react';
import Card from '../../components/ui/Card';

const contacts = [
  {
    title: 'Emergency Unit',
    detail: 'Requisition support and shift handover',
    phone: '2210',
    email: 'unit@hospital.local',
    tone: 'from-[#e0f4ef] to-[#f2faf7]',
  },
  {
    title: 'Central Store',
    detail: 'Catalog, stock availability, and item information',
    phone: '3341',
    email: 'store@hospital.local',
    tone: 'from-[#e5f1fb] to-[#f5f9fd]',
  },
  {
    title: 'Hospital Administration',
    detail: 'Account approval, role access, and platform support',
    phone: '1001',
    email: 'admin@hospital.local',
    tone: 'from-[#f1eafa] to-[#fbf8fd]',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Requisition support', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const message = `Hello, I am ${form.name || 'a member of the Emergency Unit'}. ${form.message || 'I would like help with requisition platform support.'}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  function submit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`[${form.topic}] Emergency Requisition Platform`);
    const body = encodeURIComponent(`Name: ${form.name}\nReply email: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`);
    const recipient = form.topic === 'Stock or inventory question'
      ? 'store@hospital.local'
      : form.topic === 'Requisition support'
        ? 'unit@hospital.local'
        : 'admin@hospital.local';
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="space-y-9">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#123d4e] via-[#176b68] to-[#48a28e] px-7 py-10 text-white shadow-m3 md:px-12 md:py-14">
        <div className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border-[50px] border-white/5" />
        <div className="absolute -bottom-32 right-32 -z-10 h-72 w-72 rounded-full bg-[#bbebc9]/10 blur-2xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">We’re here to help</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">Reach the right team, right away.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
          Choose a direct contact route or send a detailed message. For access approvals, contact Hospital Administration; for
          stock and requisition questions, start with the Emergency Unit duty desk or Central Store.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#176b68] transition hover:bg-[#e7f5ef]">
            Message on WhatsApp
          </a>
          <a href="tel:2210" className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Call duty desk · ext. 2210
          </a>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.title} className={`border border-white/80 bg-gradient-to-br ${contact.tone} p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Contact team</p>
                <h2 className="mt-2 text-xl font-semibold">{contact.title}</h2>
                <p className="mt-2 min-h-10 text-sm leading-6 text-outline">{contact.detail}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/80 text-lg text-primary" aria-hidden="true">↗</span>
            </div>
            <div className="mt-5 space-y-2 border-t border-primary/10 pt-4">
              <a className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-primary transition hover:bg-white/70" href={`tel:${contact.phone}`}>
                <span>Call extension</span><span>Ext. {contact.phone} →</span>
              </a>
              <a className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-primary transition hover:bg-white/70" href={`mailto:${contact.email}`}>
                <span>Send email</span><span>Email →</span>
              </a>
              <a className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-primary transition hover:bg-white/70" href={`sms:${contact.phone}?body=${encodeURIComponent(message)}`}>
                <span>Send a text message</span><span>SMS →</span>
              </a>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] bg-[#e8f2f1] p-7 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Talk to us</p>
          <h2 className="mt-2 text-2xl font-semibold">A few details help us route your message.</h2>
          <p className="mt-3 text-sm leading-7 text-outline">
            Include the item or request reference when relevant. Do not submit patient-identifying or other sensitive clinical
            information through this contact form.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005858]">
            Continue in WhatsApp
          </a>
        </div>
        <Card className="p-6 md:p-8">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-outline">Your name</span>
                <input required maxLength="100" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-outline">Reply email</span>
                <input required type="email" maxLength="160" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-outline">What can we help with?</span>
              <select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} className="w-full rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm outline-none focus:border-primary">
                <option>Requisition support</option>
                <option>Stock or inventory question</option>
                <option>Account access or approval</option>
                <option>Website feedback</option>
                <option>Other enquiry</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-outline">Message</span>
              <textarea required minLength="10" maxLength="2000" rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="w-full resize-y rounded-xl border border-outline/25 bg-surface-container px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="Tell us what happened and how we can help." />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#005858]">Prepare email message</button>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">Send via WhatsApp</a>
            </div>
            {submitted && <p role="status" className="rounded-xl bg-[#e7f5ef] px-4 py-3 text-sm text-[#176b51]">Your email app should open with the message ready to send. If it does not, use one of the direct contact options above.</p>}
          </form>
        </Card>
      </section>
      <p className="text-center text-xs leading-5 text-outline">
        Contact extensions and email addresses shown here are the platform’s configured directory entries. Follow your hospital’s
        approved escalation process for urgent clinical matters.
      </p>
    </div>
  );
}
