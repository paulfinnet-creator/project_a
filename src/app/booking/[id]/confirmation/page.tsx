import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Booking Confirmed" };

type Props = { params: Promise<{ id: string }> };

export default async function ConfirmationPage({ params }: Props) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/booking/${id}/confirmation`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tourPackage: true },
  });
  if (!booking || booking.userId !== session.user.id) notFound();

  if (booking.status !== "PAID" && booking.status !== "COMPLETED") {
    redirect(`/booking/${id}/payment`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-bold text-foreground">Booking Confirmed!</h1>
      <p className="mt-3 text-muted-foreground">
        You&rsquo;re all set for {booking.tourPackage.title}. A confirmation has been added to
        your dashboard.
      </p>

      <Card className="mt-8 text-left">
        <CardContent className="space-y-3 p-6 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tour</span>
            <span className="font-medium text-foreground">{booking.tourPackage.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Travel date</span>
            <span className="font-medium text-foreground">{formatDate(booking.travelDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Travelers</span>
            <span className="font-medium text-foreground">{booking.numberOfTravelers}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-muted-foreground">Total paid</span>
            <span className="font-display text-lg font-bold text-primary">
              {formatCurrency(booking.totalAmount.toString())}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/dashboard">Go to My Bookings</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/packages">Browse More Tours</Link>
        </Button>
      </div>
    </div>
  );
}
