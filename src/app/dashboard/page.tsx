import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CalendarDays, Users } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Bookings" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { tourPackage: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="mt-2 text-muted-foreground">{session.user.email}</p>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">My Bookings</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/packages">Book another tour</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">You haven&rsquo;t booked a tour yet.</p>
            <Button asChild className="mt-4">
              <Link href="/packages">Browse Tour Packages</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                  <Image
                    src={booking.tourPackage.imageUrl}
                    alt={booking.tourPackage.title}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {booking.tourPackage.title}
                      </h3>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" /> {formatDate(booking.travelDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {booking.numberOfTravelers} traveler
                        {booking.numberOfTravelers > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-primary">
                      {formatCurrency(booking.totalAmount.toString())}
                    </span>
                    {booking.status === "PENDING_PAYMENT" && (
                      <Button asChild size="sm">
                        <Link href={`/booking/${booking.id}/payment`}>Complete Payment</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
