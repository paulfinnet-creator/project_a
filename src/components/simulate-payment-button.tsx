"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { confirmMockPaymentAction } from "@/lib/actions/payment";
import { Button } from "@/components/ui/button";

export function SimulatePaymentButton({
  paymentId,
  bookingId,
}: {
  paymentId: string;
  bookingId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      await confirmMockPaymentAction(paymentId, bookingId);
      toast.success("Payment confirmed");
      router.push(`/booking/${bookingId}/confirmation`);
      router.refresh();
    } catch {
      toast.error("Something went wrong confirming the payment.");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} size="lg" className="w-full" disabled={loading}>
      {loading ? "Confirming..." : "Simulate Payment (Dev Mode)"}
    </Button>
  );
}
