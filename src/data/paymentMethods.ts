export type PaymentMethod = {
  name: string;
  detail: string;
  image: string;
  logo: string;
  account: string;
  accountName: string;
  accountNameAm: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    name: "Telebirr",
    detail: "Scan with your telebirr app",
    image: "/qr-telebirr.jpg",
    logo: "/telebirr_logo.jpg",
    account: "911866919",
    accountName: "Girma Eticha Ayano",
    accountNameAm: "የአካውንቱ ባለቤት ስም - ግርማ ኢቲቻ አያኖ",
  },
  {
    name: "CBE",
    detail: "Scan with your banking app",
    image: "/qr-cbe-bir.png",
    logo: "/CBE-logo.png",
    account: "1000527523544",
    accountName: "Girma Eticha Ayano",
    accountNameAm: "የአካውንቱ ባለቤት ስም - ግርማ ኢቲቻ አያኖ",
  },
  {
    name: "Bank of Abyssinia",
    detail: "Scan with your mobile wallet",
    image: "/qr-abyssinia.png",
    logo: "/abyssinia_logo.png",
    account: "68981212",
    accountName: "Girma Eticha Ayano",
    accountNameAm: "የአካውንቱ ባለቤት ስም - ግርማ ኢቲቻ አያኖ",
  },
];
