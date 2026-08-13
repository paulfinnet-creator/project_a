import type { PaymentProvider } from "./types";

// Local-dev/testing stand-in for a real crypto processor. No external calls —
// lets the full booking flow be exercised without NOWPayments credentials.
// Confirmation is triggered by the "Simulate Payment" button via the
// confirmMockPayment server action, not by this parseWebhook (which is unused
// for MOCK since there is no real webhook caller).
export const mockProvider: PaymentProvider = {
  name: "MOCK",

  async createPayment(booking) {
    const simulatedBtcAmount = Number((booking.totalAmount / 60000).toFixed(6));
    return {
      providerPaymentId: `mock_${booking.id}`,
      payAddress: "bc1q000mocked00address00for00testing00only0000",
      payCurrency: "BTC",
      payAmount: simulatedBtcAmount,
      raw: { simulated: true, bookingId: booking.id },
    };
  },

  async parseWebhook(payload) {
    const body = payload as { orderId?: string; providerPaymentId?: string };
    return {
      orderId: body.orderId ?? "",
      providerPaymentId: body.providerPaymentId ?? "",
      status: "CONFIRMED",
      raw: payload,
    };
  },
};
