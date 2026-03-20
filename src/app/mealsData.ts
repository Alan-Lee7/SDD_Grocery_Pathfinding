// Pre-made meals with ingredient lists
export interface Meal {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTime: string;
  image: string;
  ingredients: string[];
  category: "Mexican" | "Italian" | "American" | "Asian" | "Breakfast" | "Comfort";
}

export const meals: Meal[] = [
  {
    id: "tacos",
    name: "Beef Tacos",
    description: "Classic Mexican tacos with seasoned ground beef, fresh toppings, and warm tortillas",
    servings: 4,
    prepTime: "25 min",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    ingredients: [
      "ground beef",
      "taco shells",
      "shredded cheese",
      "lettuce",
      "tomatoes",
      "sour cream"
    ],
    category: "Mexican"
  },
  {
    id: "spaghetti",
    name: "Spaghetti Bolognese",
    description: "Italian classic with rich meat sauce and pasta",
    servings: 6,
    prepTime: "45 min",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop",
    ingredients: [
      "spaghetti pasta",
      "ground beef",
      "pasta sauce",
      "parmesan cheese",
      "garlic",
      "onions"
    ],
    category: "Italian"
  },
  {
    id: "stir-fry",
    name: "Chicken Stir Fry",
    description: "Quick and healthy Asian-inspired chicken with colorful vegetables",
    servings: 4,
    prepTime: "20 min",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
    ingredients: [
      "chicken breast",
      "rice",
      "broccoli",
      "bell peppers",
      "soy sauce",
      "garlic"
    ],
    category: "Asian"
  },
  {
    id: "burgers",
    name: "Classic Burgers",
    description: "Juicy homemade burgers with all the fixings",
    servings: 4,
    prepTime: "30 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    ingredients: [
      "ground beef",
      "burger buns",
      "shredded cheese",
      "lettuce",
      "tomatoes",
      "onions",
      "ketchup"
    ],
    category: "American"
  },
  {
    id: "breakfast-combo",
    name: "Full Breakfast",
    description: "Classic American breakfast with eggs, bacon, and toast",
    servings: 4,
    prepTime: "20 min",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&h=400&fit=crop",
    ingredients: [
      "eggs",
      "bacon",
      "white bread",
      "butter",
      "orange juice",
      "coffee"
    ],
    category: "Breakfast"
  },
  {
    id: "chicken-pasta",
    name: "Creamy Chicken Pasta",
    description: "Comfort food at its best with tender chicken in a creamy sauce",
    servings: 4,
    prepTime: "35 min",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&h=400&fit=crop",
    ingredients: [
      "chicken breast",
      "penne pasta",
      "heavy cream",
      "parmesan cheese",
      "garlic",
      "spinach"
    ],
    category: "Comfort"
  },
  {
    id: "pizza-night",
    name: "Homemade Pizza",
    description: "Make your own pizzas with fresh toppings",
    servings: 4,
    prepTime: "40 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    ingredients: [
      "pizza dough",
      "pizza sauce",
      "mozzarella cheese",
      "pepperoni",
      "bell peppers",
      "onions"
    ],
    category: "Italian"
  },
  {
    id: "grilled-chicken",
    name: "Grilled Chicken Dinner",
    description: "Healthy grilled chicken with roasted vegetables and rice",
    servings: 4,
    prepTime: "40 min",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop",
    ingredients: [
      "chicken breast",
      "rice",
      "broccoli",
      "carrots",
      "olive oil",
      "garlic"
    ],
    category: "American"
  },
  {
    id: "fajitas",
    name: "Chicken Fajitas",
    description: "Sizzling chicken fajitas with peppers and onions",
    servings: 4,
    prepTime: "30 min",
    image: "https://images.unsplash.com/photo-1599974289085-eb1a4c282196?w=600&h=400&fit=crop",
    ingredients: [
      "chicken breast",
      "tortillas",
      "bell peppers",
      "onions",
      "sour cream",
      "shredded cheese",
      "salsa"
    ],
    category: "Mexican"
  },
  {
    id: "salmon-dinner",
    name: "Baked Salmon",
    description: "Elegant baked salmon with asparagus and lemon",
    servings: 4,
    prepTime: "35 min",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&h=400&fit=crop",
    ingredients: [
      "salmon",
      "asparagus",
      "lemon",
      "garlic",
      "olive oil",
      "rice"
    ],
    category: "American"
  },
  {
    id: "chili",
    name: "Hearty Beef Chili",
    description: "Warming chili perfect for cold days",
    servings: 6,
    prepTime: "1 hour",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop",
    ingredients: [
      "ground beef",
      "beans",
      "tomatoes",
      "onions",
      "bell peppers",
      "shredded cheese",
      "sour cream"
    ],
    category: "Comfort"
  },
  {
    id: "pancakes",
    name: "Fluffy Pancakes",
    description: "Weekend breakfast favorite with syrup and butter",
    servings: 4,
    prepTime: "20 min",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop",
    ingredients: [
      "pancake mix",
      "eggs",
      "milk",
      "butter",
      "maple syrup",
      "bacon"
    ],
    category: "Breakfast"
  }
];

// Get meals by category
export function getMealsByCategory(category: string): Meal[] {
  if (category === "All") return meals;
  return meals.filter(meal => meal.category === category);
}

// Get all unique categories
export function getMealCategories(): string[] {
  const categories = Array.from(new Set(meals.map(m => m.category)));
  return ["All", ...categories.sort()];
}
