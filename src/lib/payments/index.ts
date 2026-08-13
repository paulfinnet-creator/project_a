import type { PaymentProvider } from "./types";
import { mockProvider } from "./mock";
import { nowPaymentsProvider } from "./nowpayments";

const providers: Record<string, PaymentProvider> = {
  NOWPAYMENTS: nowPaymentsProvider,
  MOCK: mockProvider,
};

// NOWPayments is used automatically once NOWPAYMENTS_API_KEY is set; otherwise
// the app falls back to the Mock provider so the whole booking flow can be
// exercised locally without real crypto credentials.
export function getPaymentProvider(): PaymentProvider {
  return process.env.NOWPAYMENTS_API_KEY ? nowPaymentsProvider : mockProvider;
}

export function getPaymentProviderByName(name: string): PaymentProvider | undefined {
  return providers[name.toUpperCase()];
}

export * from "./types";
