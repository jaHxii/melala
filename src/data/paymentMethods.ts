export type PaymentMethod = {
  name: string;
  detail: string;
  image: string;
};

export const paymentMethods: PaymentMethod[] = [
  { name: "Telebirr", detail: "Scan with your telebirr app", image: "/qr-telebirr.png" },
  { name: "CBE Birr", detail: "Scan with your banking app", image: "/qr-cbe-bir.png" },
  { name: "Coopay", detail: "Scan with your mobile wallet", image: "/qr-coopay.png" },
];
