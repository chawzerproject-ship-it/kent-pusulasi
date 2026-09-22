"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-100 bg-green-100/40 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
        <p className="text-sm font-medium text-navy-950">
          Talebiniz alındı. Ekibimiz kısa süre içinde sizinle iletişime
          geçecek.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5 sm:col-span-1">
        <label htmlFor="name" className="text-sm font-medium text-navy-950">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm outline-none focus:border-navy-600"
          placeholder="Adınız Soyadınız"
        />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-1">
        <label
          htmlFor="institution"
          className="text-sm font-medium text-navy-950"
        >
          Kurum
        </label>
        <input
          id="institution"
          name="institution"
          required
          className="rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm outline-none focus:border-navy-600"
          placeholder="Belediye / kurum adı"
        />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="email" className="text-sm font-medium text-navy-950">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm outline-none focus:border-navy-600"
          placeholder="ornek@kurum.gov.tr"
        />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-navy-950"
        >
          Mesaj
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm outline-none focus:border-navy-600"
          placeholder="Pilot çalışma hakkında kısa bilgi"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" size="lg" className="w-full">
          Pilot Başvurusu Gönder
        </Button>
      </div>
    </form>
  );
}
