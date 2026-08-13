import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { TourPackage } from "@prisma/client";

export function PackageCard({ pkg }: { pkg: TourPackage }) {
  return (
    <Link href={`/packages/${pkg.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={pkg.imageUrl}
            alt={pkg.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute left-3 top-3" variant="accent">
            <MapPin className="h-3 w-3" /> {pkg.location}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
            {pkg.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{pkg.summary}</p>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {pkg.durationDays} days
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> up to {pkg.maxGroupSize}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-display text-xl font-bold text-primary">
              {formatCurrency(pkg.price.toString())}
            </span>
            <span className="text-sm font-medium text-accent group-hover:underline">
              View details →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
