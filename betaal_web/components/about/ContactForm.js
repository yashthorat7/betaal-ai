'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [ref, visible] = useInView({ threshold: 0.1, once: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  const inputClass =
    'w-full bg-[#FAFAFA] border border-[#e0e0e0] rounded-2xl px-6 py-4 text-base font-bold text-[#1C1C1C] tracking-tight placeholder:text-[#1C1C1C]/25 outline-none transition-all duration-300 focus:border-[#1C1C1C] focus:shadow-lg';

  return (
    <section ref={ref} className="border-t border-[#f0f0f0] bg-white py-32">
      <div className="container-pro max-w-[600px] text-[#1C1C1C]">
        <div
          className={`mb-24 text-center transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <h2 className="heading-xl">Get In Touch</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-5 transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          style={{ transitionDelay: '0.15s' }}
        >
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} resize-none`}
          />
          <button
            type="submit"
            className="btn-pro btn-solid mt-2 w-full gap-3 rounded-2xl py-5 text-sm"
          >
            <Send size={16} /> Send Message
          </button>
        </form>

        <div
          className={`fixed right-8 bottom-8 z-50 flex items-center gap-3 rounded-2xl bg-[#1C1C1C] px-6 py-4 text-white shadow-2xl transition-all duration-500 ease-out ${submitted ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        >
          <CheckCircle size={18} className="text-[#34c759]" />
          <span className="text-sm font-bold">Message sent successfully!</span>
        </div>
      </div>
    </section>
  );
}
