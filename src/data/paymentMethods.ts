export type PaymentMethod = {
  name: string;
  detail: string;
  image: string;
  logo: string;
  account: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    name: "Telebirr",
    detail: "Scan with your telebirr app",
    image: "/qr-telebirr.png",
    logo: "/telebirr_logo.jpg",
    account: "912345678",
  },
  {
    name: "CBE",
    detail: "Scan with your banking app",
    image: "/qr-cbe-bir.png",
    logo: "/CBE-logo.png",
    account: "1000012345678",
  },
  {
    name: "Bank of Abyssinia",
    detail: "Scan with your mobile wallet",
    image: "/qr-coopay.png",
    logo: "/abyssinia_logo.png",
    account: "1312345678",
  },
];
