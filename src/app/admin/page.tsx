import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Users, MapPinned, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { getAdminStats, getAllBookings } from "@/lib/data/admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const [stats, bookings] = await Promise.all([getAdminStats(), getAllBookings()]);
  const recentBookings = bookings.slice(0, 5);

  const cards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: CalendarCheck,
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments.toLocaleString(),
      icon: Wallet,
    },
    {
      label: "Registered Tourists",
      value: stats.totalTourists.toLocaleString(),
      icon: Users,
    },
    {
      label: "Confirmed Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: MapPinned,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-foreground">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>

        <Card className="mt-4">
          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {booking.tourPackage.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.user.name} · {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(booking.totalAmount.toString())}
                      </span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
