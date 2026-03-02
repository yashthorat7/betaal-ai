"use client"
import { useState } from "react";

export default function ContactForm() {
  const [ok, setOk] = useState(false);
  const send = (e) => { e.preventDefault(); setOk(true); setTimeout(() => setOk(false), 3000); };

  return (
    <div className="section-pad container-pro">
      <div className="max-w-xl mx-auto border border-border p-12 hover:shadow-[16px_16px_0px_0px_#000] transition-all duration-500">
        <h2 className="heading-lg mb-12 italic text-center">Contact</h2>
        {ok ? (
           <div className="p-8 bg-foreground text-background label-pro text-center italic">Message Sent!</div>
        ) : (
          <form onSubmit={send} className="space-y-8">
            {['Name', 'Email', 'Message'].map(f => (
              <div key={f} className="flex flex-col gap-2">
                <label className="label-pro">{f}</label>
                {f === 'Message' ? 
                  <textarea required className="w-full border-b border-border p-2 focus:outline-none focus:border-foreground transition-colors bg-transparent h-32" /> :
                  <input type={f === 'Email' ? 'email' : 'text'} required className="w-full border-b border-border p-2 focus:outline-none focus:border-foreground transition-colors bg-transparent" />
                }
              </div>
            ))}
            <button className="btn-pro btn-solid w-full">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
