// Store-specific coupons and deals
export interface Coupon {
  id: string;
  store: string;
  title: string;
  description: string;
  discount: string;
  category?: string;
  expiresIn: string;
  code?: string;
  type: "percentage" | "dollar" | "bogo" | "special";
}

export const storeCoupons: Record<string, Coupon[]> = {
  "Walmart": [
    {
      id: "wm-1",
      store: "Walmart",
      title: "$1 Off Great Value Milk",
      description: "Save $1 on any Great Value whole, 2%, or skim milk gallon",
      discount: "$1",
      category: "Dairy",
      expiresIn: "5 days",
      code: "WMMILK1",
      type: "dollar"
    },
    {
      id: "wm-2",
      store: "Walmart",
      title: "Bread 2 for $5",
      description: "Mix & match any 2 loaves of sandwich bread (reg. $3.29 each)",
      discount: "2 for $5",
      category: "Bakery",
      expiresIn: "4 days",
      type: "special"
    },
    {
      id: "wm-3",
      store: "Walmart",
      title: "BOGO Pasta Sauce",
      description: "Buy one Prego or Ragu pasta sauce, get one free (up to $3.50 value)",
      discount: "BOGO",
      category: "Pantry",
      expiresIn: "6 days",
      type: "bogo"
    },
    {
      id: "wm-4",
      store: "Walmart",
      title: "$2 Off Boneless Chicken Breast",
      description: "Save $2 per lb on fresh boneless skinless chicken breast",
      discount: "$2/lb",
      category: "Meat",
      expiresIn: "3 days",
      type: "special"
    },
    {
      id: "wm-5",
      store: "Walmart",
      title: "Eggs 2 for $6",
      description: "Any two dozen large eggs — mix and match brands (reg. $3.78 each)",
      discount: "2 for $6",
      category: "Dairy",
      expiresIn: "7 days",
      type: "special"
    },
    {
      id: "wm-6",
      store: "Walmart",
      title: "$1.50 Off Cheerios",
      description: "Save $1.50 on any one box of Cheerios (8.9 oz or larger)",
      discount: "$1.50",
      category: "Pantry",
      expiresIn: "5 days",
      code: "WMCHEER",
      type: "dollar"
    },
    {
      id: "wm-7",
      store: "Walmart",
      title: "Frozen Pizza 3 for $10",
      description: "Mix & match any 3 DiGiorno or Tombstone frozen pizzas (reg. $4.49 each)",
      discount: "3 for $10",
      category: "Frozen",
      expiresIn: "4 days",
      type: "special"
    },
    {
      id: "wm-8",
      store: "Walmart",
      title: "$1 Off Bananas (5 lb bag)",
      description: "Save $1 on a 5 lb bag of fresh bananas",
      discount: "$1",
      category: "Produce",
      expiresIn: "2 days",
      type: "dollar"
    }
  ],
  "Aldi": [
    {
      id: "al-1",
      store: "Aldi",
      title: "Ground Beef 2 for $9",
      description: "Any two 1 lb packages of 80/20 ground beef (reg. $5.29 each)",
      discount: "2 for $9",
      category: "Meat",
      expiresIn: "3 days",
      type: "special"
    },
    {
      id: "al-2",
      store: "Aldi",
      title: "$1 Off Strawberries",
      description: "Save $1 on any 1 lb container of fresh strawberries",
      discount: "$1",
      category: "Produce",
      expiresIn: "2 days",
      type: "dollar"
    },
    {
      id: "al-3",
      store: "Aldi",
      title: "BOGO Specially Selected Cheese",
      description: "Buy one, get one free on all Specially Selected sliced or shredded cheese (up to $4.29 value)",
      discount: "BOGO",
      category: "Dairy",
      expiresIn: "5 days",
      type: "bogo"
    },
    {
      id: "al-4",
      store: "Aldi",
      title: "Salmon Fillet $2 Off",
      description: "Save $2 on any fresh Atlantic salmon fillet (reg. $8.99/lb)",
      discount: "$2",
      category: "Seafood",
      expiresIn: "4 days",
      type: "dollar"
    },
    {
      id: "al-5",
      store: "Aldi",
      title: "Greek Yogurt 4 for $5",
      description: "Mix & match any 4 Friendly Farms Greek yogurt cups (reg. $1.49 each)",
      discount: "4 for $5",
      category: "Dairy",
      expiresIn: "6 days",
      type: "special"
    },
    {
      id: "al-6",
      store: "Aldi",
      title: "$1.50 Off Dozen Eggs",
      description: "Save $1.50 on a dozen large grade A eggs",
      discount: "$1.50",
      category: "Dairy",
      expiresIn: "3 days",
      type: "dollar"
    },
    {
      id: "al-7",
      store: "Aldi",
      title: "Canned Beans 5 for $4",
      description: "Any 5 cans of SimplyNature or Happy Harvest beans (reg. $0.99 each)",
      discount: "5 for $4",
      category: "Pantry",
      expiresIn: "7 days",
      type: "special"
    },
    {
      id: "al-8",
      store: "Aldi",
      title: "$2 Off Whole Rotisserie Chicken",
      description: "Save $2 on any fresh whole rotisserie chicken (reg. $6.99)",
      discount: "$2",
      category: "Meat",
      expiresIn: "1 day",
      type: "dollar"
    }
  ],
  "Hannaford": [
    {
      id: "hf-1",
      store: "Hannaford",
      title: "$2 Off Hannaford Artisan Bread",
      description: "Save $2 on any Hannaford bakery fresh-baked artisan loaf (reg. $4.99)",
      discount: "$2",
      category: "Bakery",
      expiresIn: "3 days",
      code: "HFBREAD",
      type: "dollar"
    },
    {
      id: "hf-2",
      store: "Hannaford",
      title: "Shrimp 2 for $12",
      description: "Any two 12 oz bags of frozen cooked shrimp (reg. $7.99 each)",
      discount: "2 for $12",
      category: "Seafood",
      expiresIn: "4 days",
      type: "special"
    },
    {
      id: "hf-3",
      store: "Hannaford",
      title: "BOGO Hannaford Orange Juice",
      description: "Buy one, get one free on Hannaford brand 52 oz orange juice (up to $3.99 value)",
      discount: "BOGO",
      category: "Dairy",
      expiresIn: "5 days",
      type: "bogo"
    },
    {
      id: "hf-4",
      store: "Hannaford",
      title: "Greek Yogurt Buy 2 Get 1 Free",
      description: "Purchase any 2 Chobani or Fage Greek yogurts, get a third free (up to $1.79 value)",
      discount: "B2G1",
      category: "Dairy",
      expiresIn: "6 days",
      code: "HFYOGURT",
      type: "bogo"
    },
    {
      id: "hf-5",
      store: "Hannaford",
      title: "$1.50 Off Nature Valley Bars",
      description: "Save $1.50 on any one box of Nature Valley granola bars",
      discount: "$1.50",
      category: "Pantry",
      expiresIn: "7 days",
      code: "HFBAR",
      type: "dollar"
    },
    {
      id: "hf-6",
      store: "Hannaford",
      title: "Pork Chops 2 for $10",
      description: "Any two 1 lb packages of bone-in pork chops (reg. $5.99 each)",
      discount: "2 for $10",
      category: "Meat",
      expiresIn: "3 days",
      type: "special"
    },
    {
      id: "hf-7",
      store: "Hannaford",
      title: "$1 Off Avocados (bag of 4)",
      description: "Save $1 on any bag of 4 fresh Hass avocados (reg. $4.49)",
      discount: "$1",
      category: "Produce",
      expiresIn: "2 days",
      type: "dollar"
    },
    {
      id: "hf-8",
      store: "Hannaford",
      title: "Pasta 3 for $4",
      description: "Mix & match any 3 boxes of Barilla or Hannaford brand pasta (reg. $1.79 each)",
      discount: "3 for $4",
      category: "Pantry",
      expiresIn: "5 days",
      type: "special"
    }
  ]
};

// Get coupons for a specific store
export function getCouponsForStore(storeName: string): Coupon[] {
  return storeCoupons[storeName] || [];
}

// Get coupons relevant to items in cart
export function getRelevantCoupons(storeName: string, cartCategories: string[]): Coupon[] {
  const allCoupons = getCouponsForStore(storeName);
  
  // Prioritize coupons that match cart categories
  const relevantCoupons = allCoupons.filter(coupon => 
    !coupon.category || cartCategories.includes(coupon.category)
  );
  
  // If we have relevant coupons, return them first, otherwise return all
  return relevantCoupons.length > 0 ? relevantCoupons : allCoupons;
}
