export type MenuItem = {
  name: string;
  local?: string;
  description?: string;
  price: number;
};

export type MenuSection = {
  category: string;
  local?: string;
  items: MenuItem[];
};

export const cafeMenu: MenuSection[] = [
  {
    category: "Breakfast",
    local: "ቁርስ",
    items: [
      { name: "Chechebsa", price: 300 },
      { name: "Special Chechebsa", price: 350 },
      { name: "Scramble Egg", price: 300 },
      { name: "Cheese Omlet", price: 350 },
      { name: "Melewa", price: 300 },
      { name: "Fetira", price: 395 },
      { name: "Foul", price: 325 },
      { name: "Special Foul", price: 375 },
      { name: "French Toast", price: 310 },
      { name: "Ye Bula Cerfo", price: 350 },
      { name: "Oats", price: 350 },
    ],
  },
  {
    category: "Melala Pizzas",
    items: [
      { name: "Melala Beef Pizza", price: 700 },
      { name: "Melala Cheese Pizza", price: 750 },
      { name: "Tuna Pizza", price: 700 },
      { name: "Tuna Pizza Fasting", price: 750 },
      { name: "Veggie Pizza", price: 600 },
      { name: "Melala Special Pizza", price: 850 },
      { name: "Chicken Pizza", price: 750 },
      { name: "Half Half", price: 800 },
    ],
  },
  {
    category: "Sandwich & Wrap",
    items: [
      { name: "Croissant Omelet Sandwich", price: 415 },
      { name: "Cheese Sandwich", price: 490 },
      { name: "Tuna Sandwich", price: 620 },
      { name: "Beef Wrap", price: 750 },
      { name: "Chicken Wrap", price: 700 },
      { name: "Tuna Wrap", price: 580 },
      { name: "Vegetable Wrap", price: 340 },
      { name: "Egg Sandwich", price: 760 },
      { name: "Vegetable Sandwich", price: 840 },
      { name: "Chicken Club Sandwich", price: 690 },
      { name: "Beef Club Sandwich", price: 690 },
    ],
  },
  {
    category: "Burgers & Snacks",
    items: [
      { name: "Melala Beef Burger", price: 800 },
      { name: "Melala Cheese Burger", price: 850 },
      { name: "Melala Double Decker", price: 900 },
      { name: "Melala Special Burger", price: 950 },
      { name: "French Fries", price: 300 },
    ],
  },
  {
    category: "Salad",
    items: [
      { name: "Tuna Salad", price: 550 },
      { name: "Mixed Salad", price: 400 },
    ],
  },
  {
    category: "Hot Drinks",
    items: [
      { name: "Tea", price: 45 },
      { name: "Coffee", price: 90 },
      { name: "Espresso", price: 95 },
      { name: "Café Latte", price: 120 },
      { name: "Macchiato", price: 110 },
      { name: "Double Machiato", price: 170 },
      { name: "Cappuccino", price: 175 },
      { name: "Milk", price: 125 },
      { name: "Ginger Tea", price: 70 },
      { name: "Lemon Tea", price: 150 },
      { name: "Special Tea", price: 125 },
      { name: "Fasting Machiato", price: 175 },
      { name: "Tea Coffee Surprise", price: 65 },
      { name: "Traditional Coffee", price: 45 },
      { name: "Chocolate Machiato", price: 150 },
      { name: "Caramel Machiato", price: 155 },
      { name: "Ice Coffee With Banana", price: 200 },
      { name: "Ice Matcha", price: 240 },
      { name: "Green Tea", price: 65 },
      { name: "Tea Bag", price: 55 },
    ],
  },
  {
    category: "Frappuccino",
    items: [
      { name: "Caramel Frappuccino", price: 230 },
      { name: "Chocolate Frappuccino", price: 220 },
      { name: "Vanilla Frappuccino", price: 220 },
      { name: "Strawberry Frappuccino", price: 210 },
    ],
  },
  {
    category: "Melala Juices",
    items: [
      { name: "Orange", price: 550 },
      { name: "Papaya", price: 230 },
      { name: "Avocado", price: 250 },
      { name: "Strawberry Juice", price: 345 },
      { name: "Mixed Juice", price: 300 },
      { name: "Mango Juice", price: 360 },
    ],
  },
  {
    category: "Cold Drinks",
    items: [
      { name: "Iced Tea", price: 70 },
      { name: "Iced Coffee", price: 120 },
      { name: "Iced Latte", price: 180 },
      { name: "Iced Macchiato", price: 120 },
    ],
  },
  {
    category: "Cold Beverages",
    items: [
      { name: "Soft Drinks", price: 105 },
      { name: "600 ml Water", price: 75 },
      { name: "Sparkling Water", price: 100 },
    ],
  },
  {
    category: "Mojitos",
    items: [
      { name: "Strawberry Mojito", price: 250 },
      { name: "Pineapple Mojito", price: 220 },
      { name: "Lemon Mojito", price: 205 },
      { name: "Orange Mojito", price: 300 },
      { name: "Classic Mojito", price: 300 },
    ],
  },
];
