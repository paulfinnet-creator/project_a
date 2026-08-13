import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentStatusPoller } from "@/components/payment-status-poller";
import { SimulatePaymentButton } from "@/components/simulate-payment-button";
import { getOrCreatePaymentForBooking, parsePaymentPayload } from "@/lib/payments/service";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Complete Payment" };

type Props = { params: Promise<{ id: string }> };

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/booking/${id}/payment`);
  }

  const result = await getOrCreatePaymentForBooking(id);
  if (!result) notFound();

  const { booking, payment } = result;
  if (booking.userId !== session.user.id) notFound();

  if (booking.status === "PAID") {
    redirect(`/booking/${id}/confirmation`);
  }

  const details = parsePaymentPayload(payment.rawPayload);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Complete Your Payment</h1>
      <p className="mt-2 text-muted-foreground">
        Booking for <strong>{booking.tourPackage.title}</strong> on{" "}
        {formatDate(booking.travelDate)}
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount due</span>
            <span className="font-display text-2xl font-bold text-primary">
              {formatCurrency(booking.totalAmount.toString())}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment method</span>
            <Badge variant="accent">Cryptocurrency</Badge>
          </div>

          <div className="mt-6 space-y-4 border-t border-border pt-6">
            {payment.provider === "MOCK" ? (
              <>
                <div className="rounded-lg border border-dashed border-accent bg-accent/10 p-4 text-sm text-accent-foreground">
                  <p className="font-medium">Test mode</p>
                  <p className="mt-1 text-accent-foreground/80">
                    No real payment processor is configured yet, so this is a simulated crypto
                    checkout. Set <code>NOWPAYMENTS_API_KEY</code> in your environment to switch to
                    real NOWPayments crypto checkout.
                  </p>
                </div>
                {details.payAddress && (
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="text-muted-foreground">Simulated deposit address</p>
                    <p className="mt-1 break-all font-mono text-xs text-foreground">
                      {details.payAddress}
                    </p>
                    {payment.payAmount && (
                      <p className="mt-2 text-foreground">
                        Amount: {payment.payAmount.toString()} {payment.payCurrency}
                      </p>
                    )}
                  </div>
                )}
                <SimulatePaymentButton paymentId={payment.id} bookingId={booking.id} />
              </>
            ) : (
              <>
                {details.redirectUrl ? (
                  <Button asChild size="lg" className="w-full">
                    <a href={details.redirectUrl} target="_blank" rel="noopener noreferrer">
                      Pay with Crypto
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-destructive">
                    Unable to load payment details. Please try again shortly.
                  </p>
                )}
                <PaymentStatusPoller bookingId={booking.id} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
