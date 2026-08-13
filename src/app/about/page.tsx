import type { Metadata } from "next";
import Image from "next/image";
import { Compass, HeartHandshake, Leaf, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Naija Adventure Tours designs small-group, locally-led tours across Nigeria.",
};

const stats = [
  { label: "Years running", value: "8+" },
  { label: "Destinations covered", value: "20+" },
  { label: "Travelers hosted", value: "3,000+" },
  { label: "Average group size", value: "10" },
];

const values = [
  {
    icon: Compass,
    title: "Authentic routes",
    description:
      "We build itineraries around real Nigerian culture and landscapes, not tourist-trap detours.",
  },
  {
    icon: Users,
    title: "Local-first",
    description:
      "Every guide, driver, and lodge we work with is Nigerian-owned or Nigerian-led.",
  },
  {
    icon: Leaf,
    title: "Responsible travel",
    description: "Small groups mean a lighter footprint on the communities and places we visit.",
  },
  {
    icon: HeartHandshake,
    title: "Personal support",
    description: "From registration to your last day on tour, a real person is one message away.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative flex h-[40vh] min-h-72 items-end overflow-hidden bg-primary">
        <Image
          src="https://picsum.photos/seed/naija-about-hero/1600/900"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl">
            About Naija Adventure Tours
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-lg leading-relaxed text-muted-foreground">
          We started Naija Adventure Tours because too many visitors to Nigeria never get past
          the airport hotel. Nigeria is one of the most culturally rich, visually striking
          countries on the continent — and we built a team of local guides, drivers, and
          coordinators to show it to the world properly: safely, comfortably, and without losing
          the parts that make it unforgettable.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Every itinerary on this site is run by people who grew up in the regions we&rsquo;re
          touring. We keep groups small on purpose — it means better access, better conversations,
          and a lighter impact on the places we visit.
        </p>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold">{stat.value}</div>
              <div className="mt-2 text-sm text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-foreground">
          What we care about
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-8 w-8 text-primary" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
