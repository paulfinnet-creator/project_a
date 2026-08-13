import type { Metadata } from "next";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { getAllBookings } from "@/lib/data/admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">{bookings.length} total</p>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tour</TableHead>
              <TableHead>Tourist</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Travelers</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium text-foreground">
                  {booking.tourPackage.title}
                </TableCell>
                <TableCell>
                  <div className="text-foreground">{booking.user.name}</div>
                  <div className="text-xs text-muted-foreground">{booking.user.email}</div>
                </TableCell>
                <TableCell>{formatDate(booking.travelDate)}</TableCell>
                <TableCell>{booking.numberOfTravelers}</TableCell>
                <TableCell>{formatCurrency(booking.totalAmount.toString())}</TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No bookings yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
