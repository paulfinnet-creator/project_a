import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [totalBookings, pendingPayments, totalTourists, revenueAgg] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.user.count({ where: { role: "TOURIST" } }),
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["PAID", "COMPLETED"] } },
    }),
  ]);

  return {
    totalBookings,
    pendingPayments,
    totalTourists,
    totalRevenue: Number(revenueAgg._sum.totalAmount ?? 0),
  };
}

export function getAllBookings() {
  return prisma.booking.findMany({
    include: { tourPackage: true, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { tourPackage: true, user: true, payments: { orderBy: { createdAt: "desc" } } },
  });
}

export function getAllTourists() {
  return prisma.user.findMany({
    where: { role: "TOURIST" },
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllPackagesAdmin() {
  return prisma.tourPackage.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getPackageByIdAdmin(id: string) {
  return prisma.tourPackage.findUnique({ where: { id } });
}
