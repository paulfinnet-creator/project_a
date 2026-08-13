import Link from "next/link";
import { Compass, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <Compass className="h-6 w-6" aria-hidden />
            Naija Adventure Tours
          </div>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">
            Curated, small-group tours across Nigeria — from Lagos beaches to the highlands of
            Obudu. We handle the logistics so you can focus on the adventure.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/packages" className="text-primary-foreground/90 hover:text-accent">
                Tour Packages
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-primary-foreground/90 hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary-foreground/90 hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-primary-foreground/90 hover:text-accent">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            Get in touch
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/90">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden />
              hello@naijaadventuretours.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden />
              +234 800 000 0000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              Lagos, Nigeria
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} Naija Adventure Tours. All rights reserved.
      </div>
    </footer>
  );
}
