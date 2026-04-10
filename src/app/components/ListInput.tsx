import { ArrowLeft, Sparkles, Package, Plus, Minus, Search, Tag, Clock, Percent, ChefHat, Users, DollarSign, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"; // Edit3 reserved for Write List tab
import { useState, useMemo, useEffect, useRef } from "react";
import { getItems, getCategories, getCoupons, type ProductData, type CouponData } from "../api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { getMealCategories, getMealsByCategory } from "../mealsData";

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
  isOptimizing?: boolean;
}

type Tab = "browse" | "meals"; // "manual" tab disabled — kept for future use

interface DisambigItem {
  rawInput: string;
  candidates: ProductData[];
}

export function ListInput({ store, onBack, onOptimize, largeText = false, preferStoreBrand = false, budget = 0, setBudget, isOptimizing = false }: ListInputProps) {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [inputText, setInputText] = useState("");
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());
  const [mealItems, setMealItems] = useState<string[]>([]);
  const [addedMealIds, setAddedMealIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [mealCategoryFilter, setMealCategoryFilter] = useState<string>("All");
  const [showCoupons, setShowCoupons] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState<CouponData | null>(null);
  const [couponProducts, setCouponProducts] = useState<ProductData[]>([]);
  const [loadingCouponProducts, setLoadingCouponProducts] = useState(false);
  const [expandedCouponItems, setExpandedCouponItems] = useState<Set<number>>(new Set());

  // Fetch products for the active coupon using its pinned product_ids
  useEffect(() => {
    if (!activeCoupon) return;
    setLoadingCouponProducts(true);
    const ids = activeCoupon.product_ids;
    getItems({
      store: store.chain,
      ...(ids && ids.length > 0 ? { ids } : { search: activeCoupon.keywords || undefined, category: activeCoupon.keywords ? undefined : activeCoupon.category }),
      limit: 50,
    })
      .then(res => setCouponProducts(res.items))
      .catch(() => setCouponProducts([]))
      .finally(() => setLoadingCouponProducts(false));
  }, [activeCoupon, store.chain]);

  const PAGE_SIZE = 100;

  // Products and coupons fetched from the backend
  const [availableProducts, setAvailableProducts] = useState<ProductData[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsOffset, setProductsOffset] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);

  // Disambiguation state for the manual "Write List" tab
  const [disambigQueue, setDisambigQueue] = useState<DisambigItem[]>([]);
  const [disambigOpen, setDisambigOpen] = useState(false);
  const [resolvedTitles, setResolvedTitles] = useState<Map<string, string>>(new Map());

  // Debounce search query before sending to server
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [searchQuery]);

  // Fetch items from server when store, search, or category changes (reset to page 0)
  useEffect(() => {
    setIsLoadingProducts(true);
    setProductsOffset(0);
    const cat = categoryFilter === "All" ? undefined : categoryFilter;
    getItems({ store: store.chain, search: debouncedSearch || undefined, category: cat, limit: PAGE_SIZE, offset: 0 })
      .then((res) => {
        setAvailableProducts(res.items);
        setProductsTotal(res.total);
        // Populate category list from a separate unconstrained fetch the first time
      })
      .catch(() => { setAvailableProducts([]); setProductsTotal(0); })
      .finally(() => setIsLoadingProducts(false));
  }, [store.chain, debouncedSearch, categoryFilter]);

  // Fetch category list and coupons once per store
  useEffect(() => {
    getCategories(store.chain)
      .then((cats) => setCategories(["All", ...cats]))
      .catch(() => {});
    getCoupons(store.chain)
      .then(setCoupons)
      .catch(() => setCoupons([]));
  }, [store.chain]);

  const loadMoreProducts = () => {
    const nextOffset = productsOffset + PAGE_SIZE;
    setIsLoadingProducts(true);
    const cat = categoryFilter === "All" ? undefined : categoryFilter;
    getItems({ store: store.chain, search: debouncedSearch || undefined, category: cat, limit: PAGE_SIZE, offset: nextOffset })
      .then((res) => {
        setAvailableProducts((prev) => [...prev, ...res.items]);
        setProductsTotal(res.total);
        setProductsOffset(nextOffset);
      })
      .catch(() => {})
      .finally(() => setIsLoadingProducts(false));
  };

  const filteredProducts = availableProducts;
  const productLookup = useMemo(() => {
    const m = new Map<number, ProductData>();
    for (const p of availableProducts) m.set(p.product_id, p);
    for (const p of couponProducts) if (!m.has(p.product_id)) m.set(p.product_id, p);
    return m;
  }, [availableProducts, couponProducts]);

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

  const handleAddMeal = (mealId: string, ingredients: string[]) => {
    setMealItems(prev => [...prev, ...ingredients]);
    setAddedMealIds(prev => new Set([...prev, mealId]));
    setActiveTab("browse");
  };

  const handleOptimize = async () => {
    if (activeTab === "browse" || activeTab === "meals") {
      // Browse/meals tab: combine browse products + any added meal ingredients
      const browseItems = Array.from(selectedItems.entries()).flatMap(([productId, qty]) => {
        const product = productLookup.get(productId);
        if (!product) return [];
        return Array(qty).fill(product.title);
      });
      const allItems = [...browseItems, ...mealItems];
      if (allItems.length > 0) onOptimize(allItems);
      return;
    }

    // Manual tab: fetch candidates for each item, then disambiguate if needed
    const rawItems = inputText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (rawItems.length === 0) return;

    // Fetch up to 5 candidates per item in parallel
    const results = await Promise.all(
      rawItems.map((raw) =>
        getItems({ store: store.chain, search: raw, limit: 5 })
          .then((res) => ({ raw, candidates: res.items }))
          .catch(() => ({ raw, candidates: [] as ProductData[] }))
      )
    );

    // Items with exactly 1 candidate are auto-resolved; >1 need user input
    const newResolved = new Map<string, string>();
    const needsPicking: DisambigItem[] = [];

    for (const { raw, candidates } of results) {
      if (candidates.length === 1) {
        newResolved.set(raw, candidates[0].title);
      } else if (candidates.length > 1) {
        needsPicking.push({ rawInput: raw, candidates });
      }
      // 0 candidates → leave unresolved (backend will mark as unmatched)
    }

    setResolvedTitles(newResolved);

    if (needsPicking.length > 0) {
      setDisambigQueue(needsPicking);
      setDisambigOpen(true);
    } else {
      // Nothing to disambiguate — go straight to optimize
      const finalItems = rawItems.map((raw) => newResolved.get(raw) ?? raw);
      onOptimize(finalItems);
    }
  };

  // Called each time the user picks a product in the dialog
  const handleDisambigPick = (rawInput: string, chosenTitle: string) => {
    const newResolved = new Map(resolvedTitles);
    newResolved.set(rawInput, chosenTitle);
    setResolvedTitles(newResolved);

    const remaining = disambigQueue.slice(1);
    setDisambigQueue(remaining);

    if (remaining.length === 0) {
      setDisambigOpen(false);
      const rawItems = inputText
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      const finalItems = rawItems.map((raw) => newResolved.get(raw) ?? raw);
      onOptimize(finalItems);
    }
  };

  const totalBrowseItems = Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0);
  // manualItemCount reserved for Write List tab — const manualItemCount = inputText.split("\n").filter((item) => item.trim().length > 0).length;

  const itemCount = totalBrowseItems + mealItems.length;

  // Calculate cart total
  const cartTotal = useMemo(() => {
    let total = 0;
    selectedItems.forEach((qty, productId) => {
      const product = productLookup.get(productId);
      if (product && product.prices[store.chain]) {
        total += product.prices[store.chain] * qty;
      }
    });
    return total;
  }, [selectedItems, store.chain, productLookup]);

  const budgetRemaining = budget > 0 ? budget - cartTotal : 0;
  const isOverBudget = budget > 0 && cartTotal > budget;
  const budgetProgress = budget > 0 ? (cartTotal / budget) * 100 : 0;

  // Check if adding a product would exceed budget
  const canAddProduct = (productId: number) => {
    if (budget === 0) return true; // No budget set
    const product = productLookup.get(productId);
    if (!product || !product.prices[store.chain]) return true;
    const newTotal = cartTotal + product.prices[store.chain];
    return newTotal <= budget;
  };


  return (
    <div className="max-w-6xl mx-auto pb-24">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors ${largeText ? "text-lg" : "text-base"}`}
      >
        <ArrowLeft className={largeText ? "size-6" : "size-5"} />
        Change Store
      </button>

      {/* Store Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className={`${largeText ? "text-3xl" : "text-2xl"} font-bold mb-2 dark:text-gray-100`}>Build Your Grocery List</h2>
        <p className={`${largeText ? "text-lg" : "text-base"} text-gray-600 dark:text-gray-400`}>
          📍 {store.name} - {store.city}, {store.state}
        </p>
        <p className={`${largeText ? "text-lg" : "text-base"} text-gray-500 dark:text-gray-400 mt-1`}>
          {preferStoreBrand ? "✓ Store brands preferred" : "Name brands selected"}
        </p>
      </div>

      {/* Budget Tracker */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 ${isOverBudget ? "border-2 border-red-500" : budget > 0 ? "border-2 border-green-500" : ""}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-lg flex items-center gap-2 dark:text-gray-100">
              <DollarSign className="size-5 text-green-600" />
              Shopping Budget
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
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
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
            <span className="text-red-600 text-xl">âš ï¸</span>
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
            <span className="text-yellow-600 text-xl">ðŸ’¡</span>
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
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-md mb-6 border-2 border-green-300 dark:border-green-700 overflow-hidden">
          {/* Collapsible header */}
          <button
            onClick={() => setShowCoupons(prev => !prev)}
            className="w-full flex items-center justify-between p-4 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Tag className="size-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-green-900 dark:text-green-400">Today's Deals & Coupons</h3>
                <p className="text-xs text-green-700 dark:text-green-500">{coupons.length} deals available at {store.chain} — check before you shop!</p>
              </div>
            </div>
            {showCoupons ? (
              <ChevronUp className="size-5 text-green-700 shrink-0" />
            ) : (
              <ChevronDown className="size-5 text-green-700 shrink-0" />
            )}
          </button>

          {showCoupons && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <button
                    key={coupon.id}
                    onClick={() => setActiveCoupon(coupon)}
                    className="text-left bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-green-300 dark:border-green-700 hover:border-green-500 hover:shadow-md transition-all w-full"
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
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{coupon.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coupon.description}</p>
                        {coupon.category && (
                          <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded mb-2">
                            {coupon.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-bold text-2xl text-green-700">
                          {coupon.discount}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Off</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="size-3" />
                        Expires {coupon.expiresIn}
                      </div>
                      <div className="flex items-center gap-2">
                        {coupon.code && (
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono font-bold rounded border border-green-300">
                            {coupon.code}
                          </div>
                        )}
                        <span className="text-xs text-green-700 font-semibold underline">View items →</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-md">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "browse"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
          {/* Write List tab disabled — manual text entry removed from scope for now
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
          */}
          <button
            onClick={() => setActiveTab("meals")}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "meals"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <ChefHat className="size-5" />
            Meal Plans
            {mealItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                {mealItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Browse Tab Content */}
      {activeTab === "browse" && (
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-lg dark:text-gray-100">
              Browse & Add Products
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoadingProducts && availableProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Loader2 className="size-10 animate-spin mb-3 text-blue-500" />
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {productsTotal > 0 && (
                <p className="text-sm text-gray-500 mb-3">
                  Showing {filteredProducts.length} of {productsTotal.toLocaleString()} products
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredProducts.map((product) => {
                  const quantity = selectedItems.get(product.product_id) || 0;
                  const canAdd = canAddProduct(product.product_id);
                  const wouldExceedBudget = !canAdd && budget > 0;
                  const matchingCoupons = coupons.filter(c =>
                    c.product_ids && c.product_ids.includes(product.product_id)
                  );

                  return (
                    <div
                      key={product.product_id}
                      className={`border rounded-lg p-4 transition-all ${
                        quantity > 0
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : matchingCoupons.length > 0
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20 hover:border-green-500"
                          : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      {/* Deal banner */}
                      {matchingCoupons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {matchingCoupons.map(c => (
                            <div key={c.id} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                              <Tag className="size-3" />
                              {c.discount} — {c.title}
                            </div>
                          ))}
                        </div>
                      )}
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <h3 className="font-medium text-sm mb-1 line-clamp-2 dark:text-gray-100">{product.title}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-bold text-blue-600">
                          {product.prices[store.chain] != null
                            ? `$${product.prices[store.chain].toFixed(2)}`
                            : "N/A"}
                        </p>
                        {product.brand === "store" && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                            SAVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
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

              {/* Load More */}
              {filteredProducts.length < productsTotal && (
                <div className="mt-4 text-center">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoadingProducts}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {isLoadingProducts ? (
                      <><Loader2 className="size-4 animate-spin" /> Loading...</>
                    ) : (
                      <>Load more ({productsTotal - filteredProducts.length} remaining)</>
                    )}
                  </button>
                </div>
              )}

              {filteredProducts.length === 0 && !isLoadingProducts && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Package className="size-12 mx-auto mb-2 opacity-50" />
                  <p>No products found matching your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Manual Tab Content — disabled, kept for future use
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
      */}

      {/* Meals Tab Content */}
      {activeTab === "meals" && (
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-6">
          <label className="block mb-3 font-semibold text-lg dark:text-gray-100">
            Choose a Meal Plan
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select a pre-made meal and we'll add all the ingredients to your cart automatically.
          </p>

          <div className="flex gap-4 mb-6">
            {/* Category Filter */}
            <select
              value={mealCategoryFilter}
              onChange={(e) => setMealCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                  className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-orange-400 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{meal.name}</h3>
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded">
                        {meal.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{meal.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
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
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Ingredients ({meal.ingredients.length}):</h4>
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {addedMealIds.has(meal.id) ? (
                      <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold border border-green-300 dark:border-green-700">
                        <CheckCircle className="size-5" />
                        Added to List
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(meal.id, meal.ingredients)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-semibold shadow-md"
                      >
                        <Plus className="size-5" />
                        Add All Ingredients to List
                      </button>
                    )}
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

      {/* Bottom Action Bar - sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg px-4 py-3 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your list
        </p>
        <button
          onClick={handleOptimize}
          disabled={itemCount === 0 || isOptimizing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-semibold"
        >
          <Sparkles className="size-5" />
          {isOptimizing ? "Optimizing..." : "Optimize My List"}
        </button>
      </div>

      {/* Coupon Items Dialog */}
      {activeCoupon && (
        <Dialog open={!!activeCoupon} onOpenChange={(open) => { if (!open) setActiveCoupon(null); }}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="size-5 text-green-600" />
                {activeCoupon.title}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold text-green-700">{activeCoupon.discount}</span>
                <span className="text-sm text-gray-600">{activeCoupon.description}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="size-3" /> Expires {activeCoupon.expiresIn}</span>
                {activeCoupon.code && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 font-mono font-bold rounded border border-green-300">
                    {activeCoupon.code}
                  </span>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto mt-4">
              {loadingCouponProducts ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 className="size-8 animate-spin mb-2 text-green-500" />
                  <p className="text-sm">Loading eligible items...</p>
                </div>
              ) : couponProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="size-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No matching products found for this deal.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-3">{couponProducts.length} eligible product{couponProducts.length !== 1 ? "s" : ""} in the <span className="font-semibold text-gray-700">{activeCoupon.category}</span> category</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {couponProducts.map((product) => {
                      const quantity = selectedItems.get(product.product_id) || 0;
                      const canAdd = canAddProduct(product.product_id);
                      const wouldExceedBudget = !canAdd && budget > 0;
                      return (
                        <div
                          key={product.product_id}
                          className={`border rounded-lg p-3 transition-all ${
                            quantity > 0 ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex gap-3">
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium mb-1 ${expandedCouponItems.has(product.product_id) ? "" : "line-clamp-2"}`}>{product.title}</p>
                              {product.title.length > 60 && (
                                <button
                                  onClick={() => setExpandedCouponItems(prev => {
                                    const next = new Set(prev);
                                    next.has(product.product_id) ? next.delete(product.product_id) : next.add(product.product_id);
                                    return next;
                                  })}
                                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5 mb-1"
                                >
                                  {expandedCouponItems.has(product.product_id) ? <><ChevronUp className="size-3" /> Show less</> : <><ChevronDown className="size-3" /> Show more</>}
                                </button>
                              )}
                              <p className="text-base font-bold text-blue-600">
                                {product.prices[store.chain] != null ? `$${product.prices[store.chain].toFixed(2)}` : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            {quantity === 0 ? (
                              <button
                                onClick={() => addProduct(product.product_id)}
                                disabled={wouldExceedBudget}
                                className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  wouldExceedBudget
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                <Plus className="size-3" />
                                {wouldExceedBudget ? "Over Budget" : "Add to List"}
                              </button>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  onClick={() => removeProduct(product.product_id)}
                                  className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="font-semibold">{quantity}</span>
                                <button
                                  onClick={() => addProduct(product.product_id)}
                                  disabled={wouldExceedBudget}
                                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                                    wouldExceedBudget ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                                  }`}
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Item Disambiguation Dialog */}
      {disambigQueue.length > 0 && (
        <Dialog open={disambigOpen} onOpenChange={setDisambigOpen}>
          <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Which "{disambigQueue[0].rawInput}" do you want?</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                We found {disambigQueue[0].candidates.length} matches. Pick the one you want.
                {disambigQueue.length > 1 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    ({disambigQueue.length} items left to confirm)
                  </span>
                )}
              </p>
            </DialogHeader>

            <div className="overflow-y-auto flex-1 mt-2 space-y-2 pr-1">
              {disambigQueue[0].candidates.map((product) => (
                <button
                  key={product.product_id}
                  onClick={() => handleDisambigPick(disambigQueue[0].rawInput, product.title)}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 line-clamp-2">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">
                        {product.prices[store.chain] != null
                          ? `$${product.prices[store.chain].toFixed(2)}`
                          : "Price N/A"}
                      </span>
                      <span className="text-xs text-gray-400">{product.category}</span>
                    </div>
                  </div>
                  <CheckCircle className="size-5 text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
