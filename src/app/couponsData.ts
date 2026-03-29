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
      title: "20% Off Fresh Produce",
      description: "Save on all fresh fruits and vegetables",
      discount: "20%",
      category: "Produce",
      expiresIn: "3 days",
      code: "FRESH20",
      type: "percentage"
    },
    {
      id: "wm-2",
      store: "Walmart",
      title: "$5 Off $50+ Purchase",
      description: "Get $5 off when you spend $50 or more",
      discount: "$5",
      expiresIn: "7 days",
      code: "SAVE5",
      type: "dollar"
    },
    {
      id: "wm-3",
      store: "Walmart",
      title: "BOGO Cereal",
      description: "Buy one get one free on select cereal brands",
      discount: "BOGO",
      category: "Pantry",
      expiresIn: "5 days",
      type: "bogo"
    },
    {
      id: "wm-4",
      store: "Walmart",
      title: "Weekly Meat Deal",
      description: "$2 off per lb on boneless chicken breast",
      discount: "$2/lb",
      category: "Meat",
      expiresIn: "2 days",
      type: "special"
    }
  ],
  "Aldi": [
    {
      id: "al-1",
      store: "Aldi",
      title: "Fresh Meat Monday",
      description: "20% off all fresh meat cuts",
      discount: "20%",
      category: "Meat",
      expiresIn: "1 day",
      type: "percentage"
    },
    {
      id: "al-2",
      store: "Aldi",
      title: "Organic Produce Sale",
      description: "$1 off organic fruits and vegetables",
      discount: "$1",
      category: "Produce",
      expiresIn: "5 days",
      type: "dollar"
    },
    {
      id: "al-3",
      store: "Aldi",
      title: "Weekly Special: Salmon",
      description: "Fresh Atlantic Salmon - $2 off per lb",
      discount: "$2/lb",
      category: "Seafood",
      expiresIn: "3 days",
      type: "special"
    },
    {
      id: "al-4",
      store: "Aldi",
      title: "Buy 3 Save $3",
      description: "Purchase any 3 participating items, save $3",
      discount: "$3",
      expiresIn: "7 days",
      type: "special"
    }
  ],
  "Hannaford": [
    {
      id: "hf-1",
      store: "Hannaford",
      title: "My Hannaford Rewards: $2 Off",
      description: "Get $2 off fresh bakery items",
      discount: "$2",
      category: "Bakery",
      expiresIn: "5 days",
      type: "dollar"
    },
    {
      id: "hf-2",
      store: "Hannaford",
      title: "Fresh Seafood Friday",
      description: "15% off all fresh seafood",
      discount: "15%",
      category: "Seafood",
      expiresIn: "Today only",
      type: "percentage"
    },
    {
      id: "hf-3",
      store: "Hannaford",
      title: "Buy 5 Save $5",
      description: "Mix and match participating products",
      discount: "$5",
      expiresIn: "7 days",
      type: "special"
    },
    {
      id: "hf-4",
      store: "Hannaford",
      title: "Digital Coupon: Greek Yogurt",
      description: "Buy 2 get 1 free on all Greek yogurt",
      discount: "B2G1",
      category: "Dairy",
      expiresIn: "4 days",
      code: "YOGURT",
      type: "bogo"
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
