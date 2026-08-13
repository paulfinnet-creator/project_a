"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function confirmMockPaymentAction(paymentId: string, bookingId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.userId !== session.user.id) {
    throw new Error("Booking not found");
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.provider !== "MOCK" || payment.bookingId !== bookingId) {
    throw new Error("Invalid payment");
  }

  await prisma.payment.update({ where: { id: paymentId }, data: { status: "CONFIRMED" } });
  await prisma.booking.update({ where: { id: bookingId }, data: { status: "PAID" } });
}
