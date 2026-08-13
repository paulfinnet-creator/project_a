import type { Metadata } from "next";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getAllTourists } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Registered Tourists" };

export default async function AdminUsersPage() {
  const tourists = await getAllTourists();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Registered Tourists</h1>
      <p className="mt-1 text-sm text-muted-foreground">{tourists.length} total</p>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tourists.map((tourist) => (
              <TableRow key={tourist.id}>
                <TableCell className="font-medium text-foreground">{tourist.name}</TableCell>
                <TableCell>{tourist.email}</TableCell>
                <TableCell>{tourist.phone || "—"}</TableCell>
                <TableCell>{tourist._count.bookings}</TableCell>
                <TableCell>{formatDate(tourist.createdAt)}</TableCell>
              </TableRow>
            ))}
            {tourists.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No tourists have registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
