export type PaymentMethod = {
  name: string;
  detail: string;
  /** Seed used to render the mock QR pattern. Swap for a real image later. */
  seed: string;
};

export const paymentMethods: PaymentMethod[] = [
  { name: "Payment Method 1", detail: "Scan with your banking app", seed: "melala-pay-1" },
  { name: "Payment Method 2", detail: "Scan with your mobile wallet", seed: "melala-pay-2" },
  { name: "Payment Method 3", detail: "Scan with your telebirr app", seed: "melala-pay-3" },
];
