import { ArrowLeft, ShoppingCart, Sparkles, Package, Plus, Minus, Search, Edit3, Tag, Clock, Percent, ChefHat, Users, DollarSign } from "lucide-react";
import { useState, useMemo } from "react";
import { mockProducts } from "../mockData";
import { getCouponsForStore, type Coupon } from "../couponsData";
import { meals, getMealCategories, getMealsByCategory, type Meal } from "../mealsData";

interface Store {
  store_id: number;
  chain: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface ListInputProps {
  store: Store;
  onBack: () => void;
  onOptimize: (items: string[]) => void;
  largeText?: boolean;
  preferStoreBrand?: boolean;
  budget?: number;
  setBudget?: (budget: number) => void;
}

type Tab = "browse" | "manual" | "meals";

export function ListInput({ store, onBack, onOptimize, largeText = false, preferStoreBrand = false, budget = 0, setBudget }: ListInputProps) {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [inputText, setInputText] = useState("");
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [mealCategoryFilter, setMealCategoryFilter] = useState<string>("All");

  // Get products available at this store
  const availableProducts = useMemo(() => {
    return mockProducts.filter(p => p.stores.includes(store.chain));
  }, [store.chain]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(availableProducts.map(p => p.category));
    return ["All", ...Array.from(cats).sort()];
  }, [availableProducts]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return availableProducts.filter(p => {
      const matchesSearch = searchQuery === "" || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, searchQuery, categoryFilter]);

  const addProduct = (productId: number) => {
    const newMap = new Map(selectedItems);
    const currentQty = newMap.get(productId) || 0;
    newMap.set(productId, currentQty + 1);
    setSelectedItems(newMap);
  };

  const removeProduct = (productId: number) => {
    const newMap = new Map(selectedItems);
    const currentQty = newMap.get(productId) || 0;
    if (currentQty <= 1) {
      newMap.delete(productId);
    } else {
      newMap.set(productId, currentQty - 1);
    }
    setSelectedItems(newMap);
  };

  const handleOptimize = () => {
    let items: string[] = [];

    if (activeTab === "browse") {
      // Convert selected products to item names
      items = Array.from(selectedItems.entries()).flatMap(([productId, qty]) => {
        const product = mockProducts.find(p => p.product_id === productId);
        if (!product) return [];
        return Array(qty).fill(product.title);
      });
    } else {
      // Manual text input
      items = inputText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    if (items.length > 0) {
      onOptimize(items);
    }
  };

  const totalBrowseItems = Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0);
  const manualItemCount = inputText
    .split("\n")
    .filter((item) => item.trim().length > 0).length;
  
  const itemCount = activeTab === "browse" ? totalBrowseItems : manualItemCount;

  // Calculate cart total
  const cartTotal = useMemo(() => {
    let total = 0;
    selectedItems.forEach((qty, productId) => {
      const product = mockProducts.find(p => p.product_id === productId);
      if (product && product.prices[store.chain]) {
        total += product.prices[store.chain] * qty;
      }
    });
    return total;
  }, [selectedItems, store.chain]);

  const budgetRemaining = budget > 0 ? budget - cartTotal : 0;
  const isOverBudget = budget > 0 && cartTotal > budget;
  const budgetProgress = budget > 0 ? (cartTotal / budget) * 100 : 0;

  // Check if adding a product would exceed budget
  const canAddProduct = (productId: number) => {
    if (budget === 0) return true; // No budget set
    const product = mockProducts.find(p => p.product_id === productId);
    if (!product || !product.prices[store.chain]) return true;
    const newTotal = cartTotal + product.prices[store.chain];
    return newTotal <= budget;
  };

  // Get coupons for the store
  const coupons: Coupon[] = getCouponsForStore(store.chain);

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors ${largeText ? "text-lg" : "text-base"}`}
      >
        <ArrowLeft className={largeText ? "size-6" : "size-5"} />
        Change Store
      </button>

      {/* Store Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className={`${largeText ? "text-3xl" : "text-2xl"} font-bold mb-2`}>Build Your Grocery List</h2>
        <p className={`${largeText ? "text-lg" : "text-base"} text-gray-600`}>
          📍 {store.name} - {store.city}, {store.state}
        </p>
        <p className={`${largeText ? "text-lg" : "text-base"} text-gray-500 mt-1`}>
          {preferStoreBrand ? "✓ Store brands preferred" : "Name brands selected"}
        </p>
      </div>

      {/* Budget Tracker */}
      <div className={`bg-white rounded-lg shadow-md p-6 mb-6 ${isOverBudget ? "border-2 border-red-500" : budget > 0 ? "border-2 border-green-500" : ""}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-lg flex items-center gap-2">
              <DollarSign className="size-5 text-green-600" />
              Shopping Budget
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Set a budget to keep your spending in check. We'll prevent adding items that exceed it.
            </p>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={budget === 0 ? "" : budget}
                  onChange={(e) => setBudget && setBudget(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              {budget > 0 && (
                <button
                  onClick={() => setBudget && setBudget(0)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Budget
                </button>
              )}
            </div>
          </div>

          {budget > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Cart Total</p>
              <p className={`text-3xl font-bold ${isOverBudget ? "text-red-600" : "text-green-700"}`}>
                ${cartTotal.toFixed(2)}
              </p>
              <p className={`text-sm mt-1 font-semibold ${isOverBudget ? "text-red-600" : "text-gray-600"}`}>
                {isOverBudget ? (
                  <>Over by ${Math.abs(budgetRemaining).toFixed(2)}</>
                ) : (
                  <>${budgetRemaining.toFixed(2)} remaining</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Budget Progress Bar */}
        {budget > 0 && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  budgetProgress >= 100
                    ? "bg-red-600"
                    : budgetProgress >= 80
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Budget: ${budget.toFixed(2)}</span>
              <span>{budgetProgress.toFixed(0)}% used</span>
            </div>
          </div>
        )}

        {/* Budget Warning */}
        {isOverBudget && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <span className="text-red-600 text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Over Budget!</p>
              <p className="text-sm text-red-700">
                Remove items or increase your budget to continue shopping.
              </p>
            </div>
          </div>
        )}

        {budget > 0 && budgetProgress >= 80 && !isOverBudget && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <span className="text-yellow-600 text-xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800">Approaching Budget Limit</p>
              <p className="text-sm text-yellow-700">
                You're at {budgetProgress.toFixed(0)}% of your budget. Add items carefully!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Coupons & Deals Section */}
      {coupons.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 mb-6 border-2 border-green-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <Tag className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-green-900">Today's Deals & Coupons</h3>
              <p className="text-sm text-green-700">
                Save more on your {store.chain} shopping trip
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-lg p-4 border-2 border-dashed border-green-300 hover:border-green-500 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {coupon.type === "percentage" && (
                        <div className="p-1 bg-green-100 rounded">
                          <Percent className="size-4 text-green-700" />
                        </div>
                      )}
                      {coupon.type === "dollar" && (
                        <div className="p-1 bg-blue-100 rounded">
                          <span className="text-blue-700 font-bold text-sm">$</span>
                        </div>
                      )}
                      {(coupon.type === "bogo" || coupon.type === "special") && (
                        <div className="p-1 bg-purple-100 rounded">
                          <Sparkles className="size-4 text-purple-700" />
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900">{coupon.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                    {coupon.category && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-2">
                        {coupon.category}
                      </span>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-bold text-2xl text-green-700">
                      {coupon.discount}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">Off</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="size-3" />
                    Expires {coupon.expiresIn}
                  </div>
                  {coupon.code && (
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono font-bold rounded border border-green-300">
                      {coupon.code}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-t-lg shadow-md">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "browse"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="size-5" />
            Browse Products
            {totalBrowseItems > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {totalBrowseItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "manual"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Edit3 className="size-5" />
            Write List
            {manualItemCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {manualItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("meals")}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "meals"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ChefHat className="size-5" />
            Meal Plans
          </button>
        </div>
      </div>

      {/* Browse Tab Content */}
      {activeTab === "browse" && (
        <div className="bg-white rounded-b-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-lg">
              Browse & Add Products
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Browse products available at {store.chain} and add them to your list.
            </p>

            <div className="flex gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredProducts.map((product) => {
              const quantity = selectedItems.get(product.product_id) || 0;
              const canAdd = canAddProduct(product.product_id);
              const wouldExceedBudget = !canAdd && budget > 0;
              
              return (
                <div
                  key={product.product_id}
                  className={`border rounded-lg p-4 transition-all ${
                    quantity > 0 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-bold text-blue-600">
                      ${product.prices[store.chain]?.toFixed(2) || "N/A"}
                    </p>
                    {product.brand === "store" && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                        SAVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {product.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        product.availability === "in_stock"
                          ? "bg-green-100 text-green-700"
                          : product.availability === "limited"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.availability === "in_stock"
                        ? "In Stock"
                        : product.availability === "limited"
                        ? "Limited"
                        : "Out of Stock"}
                    </span>
                  </div>
                  
                  {quantity === 0 ? (
                    <>
                      <button
                        onClick={() => addProduct(product.product_id)}
                        disabled={wouldExceedBudget}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                          wouldExceedBudget
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <Plus className="size-4" />
                        {wouldExceedBudget ? "Over Budget" : "Add to List"}
                      </button>
                      {wouldExceedBudget && (
                        <p className="text-xs text-red-600 mt-1 text-center">
                          Would exceed budget limit
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => removeProduct(product.product_id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => addProduct(product.product_id)}
                        disabled={wouldExceedBudget}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          wouldExceedBudget
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="size-12 mx-auto mb-2 opacity-50" />
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Manual Tab Content */}
      {activeTab === "manual" && (
        <div className="bg-white rounded-b-lg shadow-md p-6">
          <label className="block mb-3 font-semibold text-lg">
            Enter Your Grocery List
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Type one item per line. We'll match them to products and sort by aisle.
          </p>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="milk&#10;bread&#10;chicken breast&#10;bananas&#10;eggs&#10;yogurt"
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
          />

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Be specific for better matches (e.g., "organic whole milk" instead of just "milk")
            </p>
          </div>
        </div>
      )}

      {/* Meals Tab Content */}
      {activeTab === "meals" && (
        <div className="bg-white rounded-b-lg shadow-md p-6">
          <label className="block mb-3 font-semibold text-lg">
            Choose a Meal Plan
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Select a pre-made meal and we'll add all the ingredients to your cart automatically.
          </p>

          <div className="flex gap-4 mb-6">
            {/* Category Filter */}
            <select
              value={mealCategoryFilter}
              onChange={(e) => setMealCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {getMealCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2">
            {getMealsByCategory(mealCategoryFilter).map((meal) => {
              return (
                <div
                  key={meal.id}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-400 transition-all hover:shadow-lg bg-white"
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-xl text-gray-900">{meal.name}</h3>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                        {meal.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{meal.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{meal.servings} servings</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{meal.prepTime}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Ingredients ({meal.ingredients.length}):</h4>
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Add all ingredients to the manual input text
                        const currentItems = inputText.trim() ? inputText.split("\n") : [];
                        const newItems = [...currentItems, ...meal.ingredients];
                        setInputText(newItems.join("\n"));
                        setActiveTab("manual");
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-semibold shadow-md"
                    >
                      <Plus className="size-5" />
                      Add All Ingredients to List
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {getMealsByCategory(mealCategoryFilter).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ChefHat className="size-12 mx-auto mb-2 opacity-50" />
              <p>No meals found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your list
        </p>
        <button
          onClick={handleOptimize}
          disabled={itemCount === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-semibold"
        >
          <Sparkles className="size-5" />
          Optimize My List
        </button>
      </div>
    </div>
  );
}