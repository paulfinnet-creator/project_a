import type { Metadata } from "next";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageRowActions } from "@/components/admin/package-row-actions";
import { getAllPackagesAdmin } from "@/lib/data/admin";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Tour Packages" };

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Tour Packages</h1>
          <p className="mt-1 text-sm text-muted-foreground">{packages.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">New Package</Link>
        </Button>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium text-foreground">{pkg.title}</TableCell>
                <TableCell>{pkg.location}</TableCell>
                <TableCell>{formatCurrency(pkg.price.toString())}</TableCell>
                <TableCell>{pkg._count.bookings}</TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? "success" : "muted"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PackageRowActions
                    packageId={pkg.id}
                    isActive={pkg.isActive}
                    hasBookings={pkg._count.bookings > 0}
                  />
                </TableCell>
              </TableRow>
            ))}
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No packages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
