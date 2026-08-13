import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Users, MapPinned, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/package-card";
import { getActivePackages } from "@/lib/data/packages";

const valueProps = [
  {
    icon: MapPinned,
    title: "Local expertise",
    description: "Every itinerary is designed and led by Nigerian guides who know the terrain.",
  },
  {
    icon: Users,
    title: "Small groups",
    description: "Intimate group sizes for a personal, unrushed experience — not a tour bus crowd.",
  },
  {
    icon: ShieldCheck,
    title: "Secure booking",
    description: "Register once, book any tour, and track every trip from your dashboard.",
  },
  {
    icon: Wallet,
    title: "Flexible payment",
    description: "Pay securely with cryptocurrency today — more payment options are on the way.",
  },
];

export default async function HomePage() {
  const packages = await getActivePackages();
  const featured = packages.slice(0, 3);

  return (
    <div>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-primary">
        <Image
          src="https://picsum.photos/seed/naija-home-hero/1920/1080"
          alt="Landscape across Nigeria"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />

        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center text-primary-foreground sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-1 text-sm font-medium">
            Small-group tours across Nigeria
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Experience Nigeria, beyond the postcard
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/85">
            Register once and book curated adventures — from Lagos&rsquo; beaches to Obudu&rsquo;s
            highlands — with a team that handles every detail.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/packages">Browse Tour Packages</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/register">Register Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Featured tours</h2>
            <p className="mt-2 text-muted-foreground">
              A taste of what&rsquo;s waiting for you across the country.
            </p>
          </div>
          <Button asChild variant="link">
            <Link href="/packages">See all packages →</Link>
          </Button>
        </div>

        {featured.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-muted-foreground">
            New tour packages are being added soon — check back shortly.
          </p>
        )}
      </section>

      <section className="bg-muted/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">
            Why travel with us
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-foreground">
          Ready for your Nigerian adventure?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Create your free account and reserve your spot on a tour in minutes.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Talk to Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
