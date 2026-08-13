import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Naija Adventure Tours to plan your trip.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-foreground">Get in touch</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question about a tour, or want something custom-built for your group? Send us a
          message and we&rsquo;ll reply within one business day.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Contact details</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" /> hello@naijaadventuretours.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" /> +234 800 000 0000
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" /> Lagos, Nigeria
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Office hours</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Monday – Saturday, 9am – 6pm WAT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
