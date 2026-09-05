import type { MenuSection } from "./cafeMenu";

// Restaurant menu — real content synced from the live Supabase database.
// Used as the instant bundled menu before the DB responds and as the
// fallback if the DB is ever unreachable. Re-sync after admin edits.
export const restaurantMenu: MenuSection[] = [
  {
    category: "Main Non-Fasting",
    local: "የፍስክ ምግቦች",
    items: [
      { name: "1 kg Raw Meat", local: "1 ኪሎ ጥሬ ስጋ", price: 4000 },
      { name: "1/2 Raw Meat", local: "ግማሽ ኪሎ ጥሬ ስጋ", price: 2000 },
      { name: "1  kg Special", local: "1 ኪሎ ስፔሻል", price: 4000 },
      { name: "1/2 kg special", local: "ግማሽ ኪሎ ስፔሻል", price: 2000 },
      { name: "1 kg Shekla", local: "1 ኪሎ ሸክላ", price: 4000 },
      { name: "1/2 kg Shekla", local: "ግማሽ ኪሎ ሸክላ", price: 2000 },
      { name: "1 kg Gas Light", local: "1 ኪሎ ጋዝ ላይት", price: 4000 },
      { name: "1/2 kg Gas Light", local: "ግማሽ ኪሎ ጋዝ ላይት", price: 2000 },
      { name: "Special Kitfo", local: "ስፔሻል ክትፎ", price: 1900 },
    ],
  },
  {
    category: "Fasting Foods",
    local: "የፆም ምግቦች",
    items: [
      { name: "Spaghetti With Tomato Sauce", local: "ፓስታ በ ስጎ", price: 315 },
      { name: "Vegetables", local: "አትክልት", price: 325 },
      { name: "Shiro and Tomato", local: "ሽሮ እና ቲማቲም", price: 350 },
      { name: "Shiro and Misir", local: "ሽሮ እና ምስር", price: 400 },
      { name: "Shiro Feses", local: "ሽሮ ፈሰስ", price: 300 },
      { name: "Shiro Tegabino", local: "ሽሮ ተጋቢኖ", price: 380 },
      { name: "Tomato Kurt", local: "ቲማቲም ቁርጥ", price: 300 },
      { name: "Fasting Firfir", local: "የፆም ፍርፍር", price: 250 },
      { name: "Misir Be-Shekla", local: "ምስር በሸክላ", price: 390 },
      { name: "Rice With Vegetable", local: "ሩዝ በአትክልት", price: 325 },
      { name: "Spagetti and Shiro", local: "ፓስታ እና ሽሮ", price: 400 },
      { name: "Suf and Shiro", local: "ሱፍ እና ሽሮ", price: 350 },
      { name: "Beyayinet", local: "በያይነት", price: 430 },
    ],
  },
];
