export type PaymentStatusValue =
  | "WAITING"
  | "CONFIRMING"
  | "CONFIRMED"
  | "FAILED"
  | "EXPIRED";

export interface BookingForPayment {
  id: string;
  totalAmount: number;
  packageTitle: string;
  customerEmail: string;
}

export interface CreatePaymentResult {
  providerPaymentId: string;
  redirectUrl?: string;
  payAddress?: string;
  payCurrency?: string;
  payAmount?: number;
  raw: unknown;
}

export interface WebhookResult {
  /** The booking ID this payment update relates to. */
  orderId: string;
  providerPaymentId: string;
  status: PaymentStatusValue;
  raw: unknown;
}

export interface PaymentProvider {
  name: "NOWPAYMENTS" | "MOCK";
  createPayment(booking: BookingForPayment): Promise<CreatePaymentResult>;
  parseWebhook(payload: unknown, headers: Headers): Promise<WebhookResult>;
}
