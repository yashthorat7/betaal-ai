'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

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
    <section ref={ref} className="py-32 bg-white border-t border-[#f0f0f0]">
      <div className="container-pro max-w-[600px] text-[#1C1C1C]">
        {/* Header */}
        <div
          className={`text-center mb-24 transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="heading-xl">Get In Touch</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-5 transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
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
            className="w-full btn-pro btn-solid rounded-2xl gap-3 text-sm py-5 mt-2"
          >
            <Send size={16} />
            Send Message
          </button>
        </form>

        {/* Success toast */}
        <div
          className={`fixed bottom-8 right-8 flex items-center gap-3 bg-[#1C1C1C] text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 ease-out z-50 ${
            submitted
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <CheckCircle size={18} className="text-[#34c759]" />
          <span className="text-sm font-bold">Message sent successfully!</span>
        </div>
      </div>
    </section>
  );
}
