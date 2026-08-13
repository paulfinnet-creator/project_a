import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { getPackageBySlug } from "@/lib/data/packages";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = { title: "Book Your Tour" };

type Props = { params: Promise<{ slug: string }> };

export default async function BookPackagePage({ params }: Props) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/packages/${slug}/book`);
  }

  const pkg = await getPackageBySlug(slug);
  if (!pkg || !pkg.isActive) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Book Your Tour</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in your trip details — you&rsquo;ll choose a payment method next.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-video w-full">
              <Image
                src={pkg.imageUrl}
                alt={pkg.title}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{pkg.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pkg.location} · {pkg.durationDays} days
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <BookingForm
            packageId={pkg.id}
            pricePerPerson={Number(pkg.price)}
            maxGroupSize={pkg.maxGroupSize}
          />
        </div>
      </div>
    </div>
  );
}
