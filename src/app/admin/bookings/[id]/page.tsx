import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { getBookingById } from "@/lib/data/admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Booking Detail" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Booking Detail</h1>
        <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={booking.tourPackage.imageUrl}
                  alt={booking.tourPackage.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {booking.tourPackage.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{booking.tourPackage.location}</p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Travel date</dt>
                <dd className="font-medium text-foreground">{formatDate(booking.travelDate)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Travelers</dt>
                <dd className="font-medium text-foreground">{booking.numberOfTravelers}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Total amount</dt>
                <dd className="font-medium text-foreground">
                  {formatCurrency(booking.totalAmount.toString())}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Booked on</dt>
                <dd className="font-medium text-foreground">{formatDate(booking.createdAt)}</dd>
              </div>
            </dl>

            {booking.travelerNotes && (
              <div className="mt-6">
                <dt className="text-sm text-muted-foreground">Traveler notes</dt>
                <dd className="mt-1 rounded-lg bg-muted p-3 text-sm text-foreground">
                  {booking.travelerNotes}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Tourist</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium text-foreground">{booking.user.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="shrink-0 text-muted-foreground">Email</dt>
                  <dd className="break-all text-right font-medium text-foreground">
                    {booking.user.email}
                  </dd>
                </div>
                {booking.user.phone && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="font-medium text-foreground">{booking.user.phone}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Payments</h2>
              {booking.payments.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No payment attempts yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {booking.payments.map((payment) => (
                    <li key={payment.id} className="rounded-lg border border-border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{payment.provider}</Badge>
                        <Badge
                          variant={payment.status === "CONFIRMED" ? "success" : "muted"}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </p>
                      {payment.payCurrency && (
                        <p className="mt-1 text-xs text-foreground">
                          {payment.payAmount?.toString()} {payment.payCurrency}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
