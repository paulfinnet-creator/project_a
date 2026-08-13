import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentProviderByName } from "@/lib/payments";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerName } = await params;
  const provider = getPaymentProviderByName(providerName);
  if (!provider) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let result;
  try {
    result = await provider.parseWebhook(payload, req.headers);
  } catch (err) {
    console.error("Payment webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: result.orderId },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const payment = booking.payments[0];
  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: result.status,
        rawPayload: JSON.stringify(result.raw),
      },
    });
  }

  if (result.status === "CONFIRMED" && booking.status !== "PAID") {
    await prisma.booking.update({ where: { id: booking.id }, data: { status: "PAID" } });
  } else if (result.status === "FAILED" || result.status === "EXPIRED") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json({ received: true });
}
