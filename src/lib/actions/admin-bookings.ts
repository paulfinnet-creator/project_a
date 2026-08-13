"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

const VALID_STATUSES = ["PENDING_PAYMENT", "PAID", "CANCELLED", "COMPLETED"] as const;

export async function updateBookingStatusAction(bookingId: string, status: string) {
  await requireAdmin();

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as (typeof VALID_STATUSES)[number] },
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
}
