import type { MenuSection } from "./cafeMenu";

// Mock content — replace with the real restaurant menu when available.
export const restaurantMenu: MenuSection[] = [
  {
    category: "Starters",
    local: "መጀመሪያ",
    items: [
      { name: "Sambusa (3 pcs)", local: "ሳምቡሳ", description: "Lentil or minced beef, crisp pastry", price: 240 },
      { name: "Chicken Wings", local: "የዶሮ ክንፍ", description: "Honey chili glaze, lime", price: 460 },
      { name: "Garlic Bread", local: "ነጭ ሽንኩርት ዳቦ", description: "Herb butter, parmesan", price: 220 },
      { name: "Soup of the Day", local: "የቀኑ ሾርባ", price: 260 },
    ],
  },
  {
    category: "Ethiopian Specials",
    local: "የሀገር ምግብ",
    items: [
      { name: "Doro Wot", local: "ዶሮ ወጥ", description: "Slow-cooked chicken, berbere, egg", price: 720 },
      { name: "Key Sega Wot", local: "ቀይ ስጋ ወጥ", description: "Beef stew with spiced butter", price: 680 },
      { name: "Tibs Special", local: "ስፔሻል ጥብስ", description: "Pan-seared beef, rosemary, jalapeño", price: 750 },
      { name: "Shiro Feses", local: "ሽሮ ፍሰስ", price: 380 },
      { name: "Beyaynetu", local: "በያይነቱ", description: "Assorted fasting platter", price: 420 },
      { name: "Kitfo Special", local: "ስፔሻል ክትፎ", description: "Minced beef, mitmita, ayib, gomen", price: 890 },
    ],
  },
  {
    category: "Main Course",
    local: "ዋና ምግብ",
    items: [
      { name: "Grilled Chicken Breast", description: "Mashed potato, seasonal vegetables", price: 780 },
      { name: "Beef Steak", description: "250g sirloin, pepper sauce, fries", price: 1150 },
      { name: "Grilled Tilapia", description: "Lemon butter, rice pilaf", price: 860 },
      { name: "Lamb Chops", description: "Rosemary jus, roast potato", price: 1250 },
    ],
  },
  {
    category: "Pizza",
    items: [
      { name: "Margherita", description: "Tomato, mozzarella, basil", price: 620 },
      { name: "Beef Pepperoni", price: 820 },
      { name: "Tuna & Onion", price: 790 },
      { name: "Four Cheese", price: 880 },
      { name: "Vegetariana", description: "Peppers, olives, mushroom, corn", price: 700 },
    ],
  },
  {
    category: "Pasta",
    items: [
      { name: "Spaghetti Bolognese", price: 640 },
      { name: "Penne Arrabbiata", price: 560 },
      { name: "Fettuccine Alfredo", description: "Cream, parmesan, chicken", price: 720 },
      { name: "Seafood Linguine", price: 890 },
    ],
  },
  {
    category: "Burgers",
    items: [
      { name: "Classic Beef Burger", description: "Cheddar, lettuce, house sauce, fries", price: 780 },
      { name: "Double Decker", price: 950 },
      { name: "Crispy Chicken Burger", price: 720 },
      { name: "Veggie Burger", price: 620 },
    ],
  },
  {
    category: "Salads",
    items: [
      { name: "Caesar Salad", price: 520 },
      { name: "Greek Salad", price: 480 },
      { name: "Avocado & Tuna Salad", price: 610 },
      { name: "Garden Salad", price: 380 },
    ],
  },
  {
    category: "Desserts",
    items: [
      { name: "Chocolate Lava Cake", price: 340 },
      { name: "Cheesecake", price: 320 },
      { name: "Tiramisu", price: 360 },
      { name: "Fruit Platter", price: 300 },
    ],
  },
  {
    category: "Drinks",
    items: [
      { name: "Soft Drinks", price: 105 },
      { name: "600 ml Water", price: 75 },
      { name: "Fresh Juice", price: 300 },
      { name: "Coffee", price: 90 },
      { name: "Tea", price: 45 },
    ],
  },
];
