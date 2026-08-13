import crypto from "crypto";
import type { PaymentProvider, PaymentStatusValue } from "./types";

const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

const STATUS_MAP: Record<string, PaymentStatusValue> = {
  waiting: "WAITING",
  confirming: "CONFIRMING",
  sending: "CONFIRMING",
  confirmed: "CONFIRMED",
  finished: "CONFIRMED",
  partially_paid: "CONFIRMING",
  failed: "FAILED",
  refunded: "FAILED",
  expired: "EXPIRED",
};

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export const nowPaymentsProvider: PaymentProvider = {
  name: "NOWPAYMENTS",

  async createPayment(booking) {
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) throw new Error("NOWPAYMENTS_API_KEY is not set");

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const res = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: booking.totalAmount,
        price_currency: "usd",
        order_id: booking.id,
        order_description: `Booking for ${booking.packageTitle}`,
        ipn_callback_url: `${baseUrl}/api/payments/webhook/nowpayments`,
        success_url: `${baseUrl}/booking/${booking.id}/confirmation`,
        cancel_url: `${baseUrl}/booking/${booking.id}/payment`,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`NOWPayments invoice creation failed (${res.status}): ${text}`);
    }

    const data = await res.json();

    return {
      providerPaymentId: String(data.id),
      redirectUrl: data.invoice_url as string,
      raw: data,
    };
  },

  async parseWebhook(payload, headers) {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) throw new Error("NOWPAYMENTS_IPN_SECRET is not set");

    const signature = headers.get("x-nowpayments-sig");
    const sorted = sortObjectKeys(payload);
    const computedSignature = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(sorted))
      .digest("hex");

    if (!signature || signature !== computedSignature) {
      throw new Error("Invalid NOWPayments IPN signature");
    }

    const body = payload as {
      order_id?: string;
      payment_id?: string | number;
      payment_status?: string;
    };

    return {
      orderId: body.order_id ?? "",
      providerPaymentId: String(body.payment_id ?? ""),
      status: STATUS_MAP[body.payment_status ?? ""] ?? "WAITING",
      raw: payload,
    };
  },
};
