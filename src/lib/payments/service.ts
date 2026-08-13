import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";

export type StoredPaymentDetails = {
  redirectUrl?: string;
  payAddress?: string;
  raw?: unknown;
};

export function parsePaymentPayload(rawPayload: string | null): StoredPaymentDetails {
  if (!rawPayload) return {};
  try {
    return JSON.parse(rawPayload) as StoredPaymentDetails;
  } catch {
    return {};
  }
}

/**
 * Returns the booking's active payment, creating one via the active
 * PaymentProvider if none exists yet (or the last attempt failed/expired).
 * Avoids creating a duplicate provider invoice on every page load.
 */
export async function getOrCreatePaymentForBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tourPackage: true,
      user: true,
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!booking) return null;

  const existing = booking.payments[0];
  if (existing && existing.status !== "FAILED" && existing.status !== "EXPIRED") {
    return { booking, payment: existing };
  }

  const provider = getPaymentProvider();
  const result = await provider.createPayment({
    id: booking.id,
    totalAmount: Number(booking.totalAmount),
    packageTitle: booking.tourPackage.title,
    customerEmail: booking.user.email,
  });

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: provider.name,
      providerPaymentId: result.providerPaymentId,
      payCurrency: result.payCurrency,
      payAmount: result.payAmount,
      status: "WAITING",
      rawPayload: JSON.stringify({
        redirectUrl: result.redirectUrl,
        payAddress: result.payAddress,
        raw: result.raw,
      }),
    },
  });

  return { booking, payment };
}
