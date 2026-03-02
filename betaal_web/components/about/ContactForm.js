'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [ok, setOk] = useState(false);
  const send = (e) => {
    e.preventDefault();
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  };

  return (
    <div className="section-pad container-pro">
      <div className="border-border mx-auto max-w-xl border p-12 transition-all duration-500 hover:shadow-[16px_16px_0px_0px_#000]">
        <h2 className="heading-lg mb-12 text-center italic">Contact</h2>
        {ok ? (
          <div className="bg-foreground text-background label-pro p-8 text-center italic">
            Message Sent!
          </div>
        ) : (
          <form onSubmit={send} className="space-y-8">
            {['Name', 'Email', 'Message'].map((f) => (
              <div key={f} className="flex flex-col gap-2">
                <label className="label-pro">{f}</label>
                {f === 'Message' ? (
                  <textarea
                    required
                    className="border-border focus:border-foreground h-32 w-full border-b bg-transparent p-2 transition-colors focus:outline-none"
                  />
                ) : (
                  <input
                    type={f === 'Email' ? 'email' : 'text'}
                    required
                    className="border-border focus:border-foreground w-full border-b bg-transparent p-2 transition-colors focus:outline-none"
                  />
                )}
              </div>
            ))}
            <button className="btn-pro btn-solid w-full">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
