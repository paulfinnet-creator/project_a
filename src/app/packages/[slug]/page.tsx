import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPackageBySlug, parseGallery, getActivePackages } from "@/lib/data/packages";
import { formatCurrency } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const packages = await getActivePackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: pkg.summary,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg || !pkg.isActive) notFound();

  const gallery = parseGallery(pkg.gallery);
  const itinerarySteps = pkg.itinerary.split("\n").filter(Boolean);

  return (
    <div>
      <div className="relative h-[45vh] min-h-80 w-full">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="flex items-center gap-1.5 text-sm font-medium text-white/90">
            <MapPin className="h-4 w-4" /> {pkg.location}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            {pkg.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">Overview</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{pkg.description}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">Itinerary</h2>
            <ol className="mt-4 space-y-3">
              {itinerarySteps.map((step, i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {gallery.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">Gallery</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={src}
                      alt={`${pkg.title} photo ${i + 1}`}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="font-display text-3xl font-bold text-primary">
                {formatCurrency(pkg.price.toString())}
                <span className="text-base font-normal text-muted-foreground"> / person</span>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" /> Duration
                  </dt>
                  <dd className="font-medium text-foreground">{pkg.durationDays} days</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" /> Group size
                  </dt>
                  <dd className="font-medium text-foreground">Up to {pkg.maxGroupSize}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> Location
                  </dt>
                  <dd className="font-medium text-foreground">{pkg.location}</dd>
                </div>
              </dl>

              <Button asChild size="lg" className="mt-6 w-full">
                <Link href={`/packages/${pkg.slug}/book`}>Book This Tour</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You&rsquo;ll need an account to complete a booking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
