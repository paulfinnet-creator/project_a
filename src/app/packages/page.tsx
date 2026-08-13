import type { Metadata } from "next";
import { PackageCard } from "@/components/package-card";
import { getActivePackages } from "@/lib/data/packages";

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Browse curated small-group tour packages across Nigeria.",
};

export default async function PackagesPage() {
  const packages = await getActivePackages();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-foreground">Tour Packages</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every tour is led by local guides and capped at a small group size, so book early —
          spots fill up fast.
        </p>
      </div>

      {packages.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-muted-foreground">
          No tour packages are available right now. Please check back soon.
        </p>
      )}
    </div>
  );
}
