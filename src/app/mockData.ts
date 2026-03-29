// Mock product database with store availability
export const mockProducts = [
  {
    product_id: 1,
    title: "Whole Milk, 1 Gallon",
    brand: "store",
    prices: {
      "Walmart": 3.48,
      "Aldi": 2.99,
      "Hannaford": 3.69
    },
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/milk",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["milk", "whole milk", "dairy"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 101,
    title: "Organic Valley Whole Milk, 1 Gallon",
    brand: "name",
    prices: {
      "Walmart": 5.98,
      "Aldi": 5.49,
      "Hannaford": 6.19
    },
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/milk-organic",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["milk", "whole milk", "dairy", "organic valley"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 2,
    title: "White Bread, 20 oz",
    brand: "store",
    prices: {
      "Walmart": 1.98,
      "Aldi": 1.49,
      "Hannaford": 2.19
    },
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bread",
    availability: "in_stock" as const,
    category: "Bakery",
    keywords: ["bread", "white bread", "loaf"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 102,
    title: "Wonder Bread Classic White, 20 oz",
    brand: "name",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.79,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bread-wonder",
    availability: "in_stock" as const,
    category: "Bakery",
    keywords: ["bread", "white bread", "loaf", "wonder bread"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 3,
    title: "Boneless Skinless Chicken Breast, 2.5 lbs",
    brand: "store",
    prices: {
      "Walmart": 12.98,
      "Aldi": 11.99,
      "Hannaford": 13.99
    },
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/chicken",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["chicken", "chicken breast", "boneless", "skinless", "poultry"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 103,
    title: "Perdue Boneless Skinless Chicken Breast, 2.5 lbs",
    brand: "name",
    prices: {
      "Walmart": 15.98,
      "Aldi": 14.99,
      "Hannaford": 16.99
    },
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/chicken-perdue",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["chicken", "chicken breast", "boneless", "skinless", "poultry", "perdue"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 4,
    title: "Organic Bananas, 3 lbs",
    brand: "store",
    prices: {
      "Walmart": 1.48,
      "Aldi": 1.29,
      "Hannaford": 1.69
    },
    image_url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bananas",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["bananas", "banana", "fruit", "organic"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 5,
    title: "Large Eggs, 18 Count",
    brand: "store",
    prices: {
      "Walmart": 3.48,
      "Aldi": 2.89,
      "Hannaford": 3.79
    },
    image_url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/eggs",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["eggs", "egg", "large eggs"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 6,
    title: "Greek Yogurt Variety Pack, 12 ct",
    brand: "store",
    prices: {
      "Walmart": 7.98,
      "Aldi": 6.99,
      "Hannaford": 8.29
    },
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/yogurt",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["yogurt", "greek yogurt", "greek"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 7,
    title: "Organic Ground Coffee, 12 oz",
    brand: "store",
    prices: {
      "Walmart": 8.98,
      "Aldi": 7.99,
      "Hannaford": 9.29
    },
    image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/coffee",
    availability: "in_stock" as const,
    category: "Beverages",
    keywords: ["coffee", "ground coffee", "organic coffee"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 8,
    title: "Laundry Detergent, 100 oz",
    brand: "store",
    prices: {
      "Walmart": 12.98,
      "Aldi": 11.49,
      "Hannaford": 13.49
    },
    image_url: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/detergent",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["detergent", "laundry", "laundry detergent", "soap"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 9,
    title: "Bath Tissue, 12 Rolls",
    brand: "store",
    prices: {
      "Walmart": 8.99,
      "Aldi": 7.99,
      "Hannaford": 9.29
    },
    image_url: "https://images.unsplash.com/photo-1584556326561-c8746083993b?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/toilet-paper",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["toilet paper", "bath tissue", "paper", "tp"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 10,
    title: "Fresh Atlantic Salmon Fillet, 1 lb",
    brand: "store",
    prices: {
      "Walmart": 11.98,
      "Hannaford": 13.49
    },
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/salmon",
    availability: "in_stock" as const,
    category: "Seafood",
    keywords: ["salmon", "fish", "seafood"],
    stores: ["Walmart", "Hannaford"]
  },
  {
    product_id: 11,
    title: "Organic Baby Spinach, 10 oz",
    brand: "store",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.49,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/spinach",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["spinach", "greens", "lettuce", "organic", "salad"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 12,
    title: "Shredded Mozzarella Cheese, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Aldi": 4.29,
      "Hannaford": 5.29
    },
    image_url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/cheese",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["cheese", "mozzarella", "shredded cheese"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 13,
    title: "Paper Towels, 6 Rolls",
    brand: "store",
    prices: {
      "Walmart": 9.98,
      "Aldi": 8.99,
      "Hannaford": 10.29
    },
    image_url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/paper-towels",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["paper towels", "towels", "paper"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 113,
    title: "Bounty Paper Towels Select-A-Size, 6 Rolls",
    brand: "name",
    prices: {
      "Walmart": 14.98,
      "Aldi": 13.99,
      "Hannaford": 15.29
    },
    image_url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/paper-towels-bounty",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["paper towels", "towels", "paper", "bounty"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 14,
    title: "Rotisserie Chicken",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Hannaford": 5.99
    },
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/rotisserie-chicken",
    availability: "in_stock" as const,
    category: "Deli",
    keywords: ["chicken", "rotisserie", "cooked chicken", "roasted chicken", "deli"],
    stores: ["Walmart", "Hannaford"]
  },
  {
    product_id: 15,
    title: "Orange Juice, 64 oz",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Aldi": 4.49,
      "Hannaford": 5.49
    },
    image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/orange-juice",
    availability: "in_stock" as const,
    category: "Beverages",
    keywords: ["orange juice", "juice", "oj", "orange"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 16,
    title: "Pasta Sauce, 24 oz",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pasta-sauce",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pasta sauce", "sauce", "marinara", "spaghetti sauce", "tomato sauce"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 17,
    title: "Spaghetti Pasta, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 1.28,
      "Aldi": 0.99,
      "Hannaford": 1.39
    },
    image_url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pasta",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pasta", "spaghetti", "noodles"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 18,
    title: "Fresh Strawberries, 1 lb",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.49,
      "Hannaford": 4.19
    },
    image_url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/strawberries",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["strawberries", "berries", "fruit", "strawberry"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 19,
    title: "Ground Beef, 1 lb (80/20)",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Aldi": 4.49,
      "Hannaford": 5.29
    },
    image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/ground-beef",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["ground beef", "beef", "hamburger", "meat"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 20,
    title: "Frozen Pizza, 12 inch",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.29,
      "Hannaford": 4.29
    },
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/frozen-pizza",
    availability: "in_stock" as const,
    category: "Frozen",
    keywords: ["pizza", "frozen pizza", "frozen"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 21,
    title: "Ice Cream, 48 oz",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Aldi": 4.29,
      "Hannaford": 5.29
    },
    image_url: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/ice-cream",
    availability: "in_stock" as const,
    category: "Frozen",
    keywords: ["ice cream", "frozen", "dessert"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 22,
    title: "Cereal, 18 oz",
    brand: "store",
    prices: {
      "Walmart": 3.48,
      "Aldi": 2.89,
      "Hannaford": 3.79
    },
    image_url: "https://images.unsplash.com/photo-1590137876181-b26a1b4d4a66?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/cereal",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["cereal", "breakfast", "corn flakes"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 23,
    title: "Butter, 1 lb",
    brand: "store",
    prices: {
      "Walmart": 4.48,
      "Aldi": 3.79,
      "Hannaford": 4.89
    },
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/butter",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["butter", "salted butter", "unsalted butter"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 24,
    title: "Apples, 3 lb bag",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.49,
      "Hannaford": 4.19
    },
    image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/apples",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["apples", "apple", "fruit"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  // Meal ingredients
  {
    product_id: 25,
    title: "Taco Shells, 12 count",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/taco-shells",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["taco shells", "tacos", "shells", "taco"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 26,
    title: "Sour Cream, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.49,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/sour-cream",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["sour cream", "cream", "dairy"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 27,
    title: "Spaghetti Pasta, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 1.48,
      "Aldi": 0.99,
      "Hannaford": 1.69
    },
    image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/spaghetti",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["spaghetti", "pasta", "noodles"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 28,
    title: "Pasta Sauce, 24 oz",
    brand: "store",
    prices: {
      "Walmart": 1.98,
      "Aldi": 1.49,
      "Hannaford": 2.19
    },
    image_url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pasta-sauce",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pasta sauce", "marinara", "tomato sauce", "sauce"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 29,
    title: "Parmesan Cheese, 8 oz",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.49,
      "Hannaford": 4.19
    },
    image_url: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/parmesan",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["parmesan", "cheese", "parmesan cheese"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 30,
    title: "Garlic, 3 bulbs",
    brand: "store",
    prices: {
      "Walmart": 1.48,
      "Aldi": 1.29,
      "Hannaford": 1.69
    },
    image_url: "https://images.unsplash.com/photo-1588610160788-4d2c4e5c1f28?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/garlic",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["garlic", "garlic bulbs"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 31,
    title: "Yellow Onions, 3 lb bag",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/onions",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["onions", "yellow onions", "onion"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 32,
    title: "White Rice, 2 lb",
    brand: "store",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.49,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/rice",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["rice", "white rice"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 33,
    title: "Broccoli Crowns, 1 lb",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/broccoli",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["broccoli", "vegetable", "vegetables"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 34,
    title: "Bell Peppers, 3 pack",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.49,
      "Hannaford": 4.19
    },
    image_url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bell-peppers",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["bell peppers", "peppers", "pepper", "vegetables"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 35,
    title: "Soy Sauce, 15 oz",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/soy-sauce",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["soy sauce", "sauce", "asian"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 36,
    title: "Burger Buns, 8 count",
    brand: "store",
    prices: {
      "Walmart": 1.98,
      "Aldi": 1.49,
      "Hannaford": 2.19
    },
    image_url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/burger-buns",
    availability: "in_stock" as const,
    category: "Bakery",
    keywords: ["burger buns", "buns", "hamburger buns"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 37,
    title: "Ketchup, 32 oz",
    brand: "store",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.49,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1628066236911-ee4493bb2a5a?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/ketchup",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["ketchup", "condiment", "tomato ketchup"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 38,
    title: "Bacon, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 6.98,
      "Aldi": 5.99,
      "Hannaford": 7.29
    },
    image_url: "https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bacon",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["bacon", "pork", "breakfast"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 39,
    title: "Orange Juice, 64 oz",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.49,
      "Hannaford": 4.19
    },
    image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/orange-juice",
    availability: "in_stock" as const,
    category: "Beverages",
    keywords: ["orange juice", "juice", "oj"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 40,
    title: "Coffee, 12 oz",
    brand: "store",
    prices: {
      "Walmart": 5.98,
      "Aldi": 4.99,
      "Hannaford": 6.29
    },
    image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/coffee",
    availability: "in_stock" as const,
    category: "Beverages",
    keywords: ["coffee", "ground coffee"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 41,
    title: "Penne Pasta, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 1.48,
      "Aldi": 0.99,
      "Hannaford": 1.69
    },
    image_url: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/penne",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["penne", "penne pasta", "pasta"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 42,
    title: "Heavy Cream, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 3.48,
      "Aldi": 2.99,
      "Hannaford": 3.69
    },
    image_url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/heavy-cream",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["heavy cream", "cream", "whipping cream"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 43,
    title: "Fresh Spinach, 10 oz",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/spinach",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["spinach", "greens", "vegetables"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 44,
    title: "Pizza Dough, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pizza-dough",
    availability: "in_stock" as const,
    category: "Bakery",
    keywords: ["pizza dough", "dough", "pizza"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 45,
    title: "Pizza Sauce, 15 oz",
    brand: "store",
    prices: {
      "Walmart": 1.98,
      "Aldi": 1.49,
      "Hannaford": 2.19
    },
    image_url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pizza-sauce",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pizza sauce", "sauce", "marinara"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 46,
    title: "Mozzarella Cheese, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Aldi": 4.29,
      "Hannaford": 5.29
    },
    image_url: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/mozzarella",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["mozzarella", "cheese", "mozzarella cheese"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 47,
    title: "Pepperoni, 6 oz",
    brand: "store",
    prices: {
      "Walmart": 3.98,
      "Aldi": 3.49,
      "Hannaford": 4.19
    },
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pepperoni",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["pepperoni", "pizza", "meat"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 48,
    title: "Carrots, 2 lb bag",
    brand: "store",
    prices: {
      "Walmart": 1.98,
      "Aldi": 1.49,
      "Hannaford": 2.19
    },
    image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/carrots",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["carrots", "carrot", "vegetables"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 49,
    title: "Olive Oil, 17 oz",
    brand: "store",
    prices: {
      "Walmart": 5.98,
      "Aldi": 4.99,
      "Hannaford": 6.29
    },
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/olive-oil",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["olive oil", "oil", "cooking oil"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 50,
    title: "Flour Tortillas, 10 count",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/tortillas",
    availability: "in_stock" as const,
    category: "Bakery",
    keywords: ["tortillas", "flour tortillas", "wraps"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 51,
    title: "Salsa, 16 oz",
    brand: "store",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.49,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/salsa",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["salsa", "dip", "sauce"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 52,
    title: "Salmon Fillets, 1 lb",
    brand: "store",
    prices: {
      "Walmart": 10.98,
      "Aldi": 9.99,
      "Hannaford": 11.29
    },
    image_url: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/salmon",
    availability: "in_stock" as const,
    category: "Seafood",
    keywords: ["salmon", "fish", "seafood"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 53,
    title: "Asparagus, 1 lb",
    brand: "store",
    prices: {
      "Walmart": 4.98,
      "Aldi": 3.99,
      "Hannaford": 5.19
    },
    image_url: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/asparagus",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["asparagus", "vegetables", "vegetable"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 54,
    title: "Lemons, 2 lb bag",
    brand: "store",
    prices: {
      "Walmart": 2.98,
      "Aldi": 2.49,
      "Hannaford": 3.19
    },
    image_url: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/lemons",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["lemons", "lemon", "citrus", "fruit"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 55,
    title: "Canned Beans, 15 oz",
    brand: "store",
    prices: {
      "Walmart": 0.98,
      "Aldi": 0.79,
      "Hannaford": 1.19
    },
    image_url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/beans",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["beans", "canned beans", "black beans", "kidney beans"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 56,
    title: "Pancake Mix, 32 oz",
    brand: "store",
    prices: {
      "Walmart": 3.48,
      "Aldi": 2.99,
      "Hannaford": 3.69
    },
    image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pancake-mix",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pancake mix", "pancakes", "pancake"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 57,
    title: "Maple Syrup, 24 oz",
    brand: "store",
    prices: {
      "Walmart": 6.98,
      "Aldi": 5.99,
      "Hannaford": 7.29
    },
    image_url: "https://images.unsplash.com/photo-1576067477721-749f40ef5b8f?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/maple-syrup",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["maple syrup", "syrup", "pancake syrup"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 58,
    title: "Roma Tomatoes, 2 lb",
    brand: "store",
    prices: {
      "Walmart": 2.48,
      "Aldi": 1.99,
      "Hannaford": 2.69
    },
    image_url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/tomatoes",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["tomatoes", "tomato", "roma tomatoes", "vegetables"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  },
  {
    product_id: 59,
    title: "Iceberg Lettuce, Head",
    brand: "store",
    prices: {
      "Walmart": 1.48,
      "Aldi": 1.29,
      "Hannaford": 1.69
    },
    image_url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/lettuce",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["lettuce", "iceberg lettuce", "salad", "greens", "vegetables"],
    stores: ["Walmart", "Aldi", "Hannaford"]
  }
];

// Store-specific aisle layouts
export const storeLayouts: Record<string, Array<{aisle: string; aisle_name: string; zone_order: number; category: string}>> = {
  "Walmart": [
    { aisle: "1", aisle_name: "Produce", zone_order: 1, category: "Produce" },
    { aisle: "2-3", aisle_name: "Bakery & Deli", zone_order: 2, category: "Bakery" },
    { aisle: "2-3", aisle_name: "Bakery & Deli", zone_order: 2, category: "Deli" },
    { aisle: "4-6", aisle_name: "Dairy, Eggs & Cheese", zone_order: 3, category: "Dairy" },
    { aisle: "7-9", aisle_name: "Meat & Seafood", zone_order: 4, category: "Meat" },
    { aisle: "7-9", aisle_name: "Meat & Seafood", zone_order: 4, category: "Seafood" },
    { aisle: "10-15", aisle_name: "Pantry & Canned Goods", zone_order: 5, category: "Pantry" },
    { aisle: "16-18", aisle_name: "Beverages", zone_order: 6, category: "Beverages" },
    { aisle: "19-22", aisle_name: "Frozen Foods", zone_order: 7, category: "Frozen" },
    { aisle: "23-26", aisle_name: "Household & Cleaning", zone_order: 8, category: "Household" }
  ],
  "Aldi": [
    { aisle: "1", aisle_name: "Produce", zone_order: 1, category: "Produce" },
    { aisle: "2", aisle_name: "Bakery", zone_order: 2, category: "Bakery" },
    { aisle: "3", aisle_name: "Meat", zone_order: 3, category: "Meat" },
    { aisle: "4", aisle_name: "Dairy & Eggs", zone_order: 4, category: "Dairy" },
    { aisle: "5", aisle_name: "Pantry Staples", zone_order: 5, category: "Pantry" },
    { aisle: "6", aisle_name: "Beverages", zone_order: 6, category: "Beverages" },
    { aisle: "7", aisle_name: "Frozen Foods", zone_order: 7, category: "Frozen" },
    { aisle: "8", aisle_name: "Household", zone_order: 8, category: "Household" }
  ],
  "Hannaford": [
    { aisle: "1", aisle_name: "Produce", zone_order: 1, category: "Produce" },
    { aisle: "2", aisle_name: "Deli", zone_order: 2, category: "Deli" },
    { aisle: "3", aisle_name: "Bakery", zone_order: 3, category: "Bakery" },
    { aisle: "4", aisle_name: "Meat & Seafood", zone_order: 4, category: "Meat" },
    { aisle: "4", aisle_name: "Meat & Seafood", zone_order: 4, category: "Seafood" },
    { aisle: "5", aisle_name: "Dairy, Eggs & Cheese", zone_order: 5, category: "Dairy" },
    { aisle: "6-10", aisle_name: "Grocery", zone_order: 6, category: "Pantry" },
    { aisle: "11", aisle_name: "Beverages", zone_order: 7, category: "Beverages" },
    { aisle: "12-14", aisle_name: "Frozen", zone_order: 8, category: "Frozen" },
    { aisle: "15-16", aisle_name: "Health & Home", zone_order: 9, category: "Household" }
  ]
};

// Simple matching algorithm
export function matchProducts(inputItems: string[], storeChain: string, preferStoreBrand: boolean = false) {
  const matched: Array<{ raw_input: string; product: typeof mockProducts[0] | null }> = [];
  const unmatched: string[] = [];

  for (const input of inputItems) {
    const lowercaseInput = input.toLowerCase();
    
    // Find all matching products available at this store
    const matchingProducts = mockProducts.filter((p) =>
      p.stores.includes(storeChain) &&
      p.keywords.some((keyword) => lowercaseInput.includes(keyword))
    );

    let product: typeof mockProducts[0] | undefined;

    if (matchingProducts.length > 0) {
      if (preferStoreBrand) {
        // Prefer store brand, then cheapest option
        const storeBrand = matchingProducts.find(p => p.brand === "store");
        if (storeBrand) {
          product = storeBrand;
        } else {
          // If no store brand, choose cheapest
          product = matchingProducts.sort((a, b) => 
            (a.prices[storeChain] || Infinity) - (b.prices[storeChain] || Infinity)
          )[0];
        }
      } else {
        // Just use first match
        product = matchingProducts[0];
      }
    }

    if (product) {
      matched.push({ raw_input: input, product });
    } else {
      unmatched.push(input);
    }
  }

  // Get store layout
  const aisles = storeLayouts[storeChain] || storeLayouts["Walmart"];

  // Group by aisle
  const aisleGroups: { [key: string]: typeof matched } = {};

  for (const item of matched) {
    if (!item.product) continue;
    
    const aisle = aisles.find((a) => a.category === item.product!.category);
    if (!aisle) continue;

    const key = `${aisle.zone_order}-${aisle.aisle}`;
    if (!aisleGroups[key]) {
      aisleGroups[key] = [];
    }
    aisleGroups[key].push(item);
  }

  // Sort and format
  const optimizedList = Object.entries(aisleGroups)
    .sort(([keyA], [keyB]) => {
      const orderA = parseInt(keyA.split("-")[0]);
      const orderB = parseInt(keyB.split("-")[0]);
      return orderA - orderB;
    })
    .map(([key, items]) => {
      const aisleCode = key.split("-").slice(1).join("-"); // Handle aisle codes with dashes like "2-3"
      const aisle = aisles.find((a) => a.aisle === aisleCode);
      
      // Safety check - if aisle not found, skip this group
      if (!aisle) {
        return null;
      }
      
      return {
        zone_order: aisle.zone_order,
        aisle: aisle.aisle,
        aisle_name: aisle.aisle_name,
        items
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null); // Remove any null entries

  return {
    optimized_list: optimizedList,
    unmatched_items: unmatched
  };
}