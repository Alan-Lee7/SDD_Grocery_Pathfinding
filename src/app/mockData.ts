// Mock product database with store availability
export const mockProducts = [
  {
    product_id: 1,
    title: "Whole Milk, 1 Gallon",
    price: 3.48,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/milk",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["milk", "whole milk", "dairy"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 2,
    title: "White Bread, 20 oz",
    price: 1.98,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bread",
    availability: "in_stock" as const,
    category: "Bakery",
    keywords: ["bread", "white bread", "loaf"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 3,
    title: "Boneless Skinless Chicken Breast, 2.5 lbs",
    price: 12.98,
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/chicken",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["chicken", "chicken breast", "boneless", "skinless", "poultry"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 4,
    title: "Organic Bananas, 3 lbs",
    price: 1.48,
    image_url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/bananas",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["bananas", "banana", "fruit", "organic"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 5,
    title: "Large Eggs, 18 Count",
    price: 3.48,
    image_url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/eggs",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["eggs", "egg", "large eggs"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 6,
    title: "Greek Yogurt Variety Pack, 12 ct",
    price: 7.98,
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/yogurt",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["yogurt", "greek yogurt", "greek"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 7,
    title: "Organic Ground Coffee, 12 oz",
    price: 8.98,
    image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/coffee",
    availability: "in_stock" as const,
    category: "Beverages",
    keywords: ["coffee", "ground coffee", "organic coffee"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 8,
    title: "Laundry Detergent, 100 oz",
    price: 12.98,
    image_url: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/detergent",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["detergent", "laundry", "laundry detergent", "soap"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 9,
    title: "Bath Tissue, 12 Rolls",
    price: 8.99,
    image_url: "https://images.unsplash.com/photo-1584556326561-c8746083993b?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/toilet-paper",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["toilet paper", "bath tissue", "paper", "tp"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 10,
    title: "Fresh Atlantic Salmon Fillet, 1 lb",
    price: 11.98,
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/salmon",
    availability: "in_stock" as const,
    category: "Seafood",
    keywords: ["salmon", "fish", "seafood"],
    stores: ["Walmart", "Target", "Hannaford"]
  },
  {
    product_id: 11,
    title: "Organic Baby Spinach, 10 oz",
    price: 2.98,
    image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/spinach",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["spinach", "greens", "lettuce", "organic", "salad"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 12,
    title: "Shredded Mozzarella Cheese, 16 oz",
    price: 4.98,
    image_url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/cheese",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["cheese", "mozzarella", "shredded cheese"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 13,
    title: "Paper Towels, 6 Rolls",
    price: 9.98,
    image_url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/paper-towels",
    availability: "in_stock" as const,
    category: "Household",
    keywords: ["paper towels", "towels", "paper"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 14,
    title: "Rotisserie Chicken",
    price: 4.98,
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/rotisserie-chicken",
    availability: "in_stock" as const,
    category: "Deli",
    keywords: ["chicken", "rotisserie", "cooked chicken", "roasted chicken", "deli"],
    stores: ["Walmart", "Target", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 15,
    title: "Orange Juice, 64 oz",
    price: 4.98,
    image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/orange-juice",
    availability: "in_stock" as const,
    category: "Beverages",
    keywords: ["orange juice", "juice", "oj", "orange"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 16,
    title: "Pasta Sauce, 24 oz",
    price: 2.48,
    image_url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pasta-sauce",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pasta sauce", "sauce", "marinara", "spaghetti sauce", "tomato sauce"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 17,
    title: "Spaghetti Pasta, 16 oz",
    price: 1.28,
    image_url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/pasta",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["pasta", "spaghetti", "noodles"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 18,
    title: "Fresh Strawberries, 1 lb",
    price: 3.98,
    image_url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/strawberries",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["strawberries", "berries", "fruit", "strawberry"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 19,
    title: "Ground Beef, 1 lb (80/20)",
    price: 4.98,
    image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/ground-beef",
    availability: "in_stock" as const,
    category: "Meat",
    keywords: ["ground beef", "beef", "hamburger", "meat"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 20,
    title: "Frozen Pizza, 12 inch",
    price: 3.98,
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/frozen-pizza",
    availability: "in_stock" as const,
    category: "Frozen",
    keywords: ["pizza", "frozen pizza", "frozen"],
    stores: ["Walmart", "Target", "Aldi", "Hannaford"]
  },
  {
    product_id: 21,
    title: "Ice Cream, 48 oz",
    price: 4.98,
    image_url: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/ice-cream",
    availability: "in_stock" as const,
    category: "Frozen",
    keywords: ["ice cream", "frozen", "dessert"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 22,
    title: "Cereal, 18 oz",
    price: 3.48,
    image_url: "https://images.unsplash.com/photo-1590137876181-b26a1b4d4a66?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/cereal",
    availability: "in_stock" as const,
    category: "Pantry",
    keywords: ["cereal", "breakfast", "corn flakes"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 23,
    title: "Butter, 1 lb",
    price: 4.48,
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/butter",
    availability: "in_stock" as const,
    category: "Dairy",
    keywords: ["butter", "salted butter", "unsalted butter"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
  },
  {
    product_id: 24,
    title: "Apples, 3 lb bag",
    price: 3.98,
    image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    affiliate_link: "https://example.com/product/apples",
    availability: "in_stock" as const,
    category: "Produce",
    keywords: ["apples", "apple", "fruit"],
    stores: ["Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"]
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
  "Target": [
    { aisle: "A", aisle_name: "Fresh Produce", zone_order: 1, category: "Produce" },
    { aisle: "B", aisle_name: "Bakery", zone_order: 2, category: "Bakery" },
    { aisle: "C", aisle_name: "Deli", zone_order: 3, category: "Deli" },
    { aisle: "D", aisle_name: "Meat & Seafood", zone_order: 4, category: "Meat" },
    { aisle: "D", aisle_name: "Meat & Seafood", zone_order: 4, category: "Seafood" },
    { aisle: "E", aisle_name: "Dairy & Eggs", zone_order: 5, category: "Dairy" },
    { aisle: "F-J", aisle_name: "Grocery & Pantry", zone_order: 6, category: "Pantry" },
    { aisle: "K-L", aisle_name: "Beverages", zone_order: 7, category: "Beverages" },
    { aisle: "M-O", aisle_name: "Frozen", zone_order: 8, category: "Frozen" },
    { aisle: "P-R", aisle_name: "Household Essentials", zone_order: 9, category: "Household" }
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
  "Sam's Club": [
    { aisle: "P1", aisle_name: "Fresh Produce", zone_order: 1, category: "Produce" },
    { aisle: "D1", aisle_name: "Deli & Prepared Foods", zone_order: 2, category: "Deli" },
    { aisle: "M1", aisle_name: "Meat & Seafood", zone_order: 3, category: "Meat" },
    { aisle: "M1", aisle_name: "Meat & Seafood", zone_order: 3, category: "Seafood" },
    { aisle: "D2", aisle_name: "Dairy & Eggs", zone_order: 4, category: "Dairy" },
    { aisle: "B1", aisle_name: "Bakery", zone_order: 5, category: "Bakery" },
    { aisle: "A6", aisle_name: "Beverages", zone_order: 6, category: "Beverages" },
    { aisle: "A8", aisle_name: "Pantry & Dry Goods", zone_order: 7, category: "Pantry" },
    { aisle: "F1", aisle_name: "Frozen Foods", zone_order: 8, category: "Frozen" },
    { aisle: "A12", aisle_name: "Household & Cleaning", zone_order: 9, category: "Household" }
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
export function matchProducts(inputItems: string[], storeChain: string) {
  const matched: Array<{ raw_input: string; product: typeof mockProducts[0] | null }> = [];
  const unmatched: string[] = [];

  for (const input of inputItems) {
    const lowercaseInput = input.toLowerCase();
    
    // Try to find a matching product that's available at this store
    const product = mockProducts.find((p) =>
      p.stores.includes(storeChain) &&
      p.keywords.some((keyword) => lowercaseInput.includes(keyword))
    );

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