import { ArrowLeft, Check, ExternalLink, MapPin, DollarSign, Package, TrendingDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { optimizeList } from "../api";

interface AppliedCoupon {
  coupon_code?: string;
  title?: string;
  discount?: string;
  coupon_type?: string;
  effective_unit_price?: number;
}

interface Product {
  product_id: number;
  title: string;
  prices: Record<string, number>;
  image_url: string;
  affiliate_link: string;
  availability: "in_stock" | "out_of_stock" | "limited";
  base_unit_price?: number;
  effective_unit_price?: number;
  applied_coupon?: AppliedCoupon;
}

interface ListItem {
  raw_input: string;
  product: Product | null;
}

interface AisleGroup {
  zone_order: number;
  aisle: string;
  aisle_name: string;
  items: ListItem[];
}

interface OptimizedListData {
  store: {
    store_id: number;
    name: string;
    chain: string;
  };
  optimized_list: AisleGroup[];
  unmatched_items: string[];
  rawItems?: string[];
  base_total_estimate?: number;
  effective_total_estimate?: number;
  estimated_savings?: number;
}

interface OptimizedListProps {
  data: OptimizedListData;
  onBack: () => void;
  largeText?: boolean;
  preferStoreBrand?: boolean;
  onStoreSwitch?: (chain: string) => void;
}

export function OptimizedList({ data, onBack, largeText = false, preferStoreBrand = false, onStoreSwitch }: OptimizedListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<Record<string, { total: number; savings: number }>>({});
  const [loadingComparison, setLoadingComparison] = useState(false);

  const toggleCheck = (itemKey: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemKey)) {
      newChecked.delete(itemKey);
    } else {
      newChecked.add(itemKey);
    }
    setCheckedItems(newChecked);
  };

  // Check if all items in an aisle are checked
  const isAisleComplete = (aisleIndex: number, aisleGroup: AisleGroup) => {
    return aisleGroup.items.every((_, itemIdx) => 
      checkedItems.has(`${aisleIndex}-${itemIdx}`)
    );
  };

  // Separate active aisles from completed aisles
  const activeAisles: Array<{ aisleGroup: AisleGroup; originalIndex: number }> = [];
  const completedAisles: Array<{ aisleGroup: AisleGroup; originalIndex: number }> = [];

  data.optimized_list.forEach((aisleGroup, idx) => {
    if (isAisleComplete(idx, aisleGroup)) {
      completedAisles.push({ aisleGroup, originalIndex: idx });
    } else {
      activeAisles.push({ aisleGroup, originalIndex: idx });
    }
  });

  const totalItems = data.optimized_list.reduce(
    (sum, aisle) => sum + aisle.items.length,
    0
  ) + data.unmatched_items.length;

  const checkedCount = checkedItems.size;
  const progress = (checkedCount / totalItems) * 100;

  // All stores derived from product price keys
  const allStores = useMemo(() => {
    const set = new Set<string>();
    data.optimized_list.forEach(ag => ag.items.forEach(item => {
      if (item.product) Object.keys(item.product.prices).forEach(s => set.add(s));
    }));
    set.add(data.store.chain);
    return [...set];
  }, [data]);

  // Run full optimize (with coupons) for each comparison store when modal opens
  useEffect(() => {
    if (!showComparison || !data.rawItems?.length) return;
    const storesToFetch = allStores.filter(s => s !== data.store.chain);
    setComparisonData({});
    if (!storesToFetch.length) return;
    setLoadingComparison(true);
    Promise.all(storesToFetch.map(async store => {
      const result = await optimizeList(data.rawItems!, store, preferStoreBrand, true);
      let total = 0;
      let baseTotal = 0;
      result.optimized_list.forEach(ag => {
        ag.items.forEach(item => {
          if (!item.product) return;
          total += (item.product as any).effective_unit_price ?? item.product.prices[store] ?? 0;
          baseTotal += item.product.prices[store] ?? 0;
        });
      });
      return { store, total, savings: Math.max(0, baseTotal - total) };
    }))
      .then(results => {
        const map: Record<string, { total: number; savings: number }> = {};
        results.forEach(({ store, total, savings }) => { map[store] = { total, savings }; });
        setComparisonData(map);
      })
      .catch(() => {})
      .finally(() => setLoadingComparison(false));
  }, [showComparison, data.store.chain]);


  const computedEffectiveTotal = data.optimized_list.reduce((sum, aisle) => {
    return sum + aisle.items.reduce((s, item) => {
      if (!item.product) return s;
      const eff = item.product.effective_unit_price ?? item.product.prices[data.store.chain] ?? 0;
      return s + eff;
    }, 0);
  }, 0);

  const computedBaseTotal = data.optimized_list.reduce((sum, aisle) => {
    return sum + aisle.items.reduce((s, item) => {
      if (!item.product) return s;
      return s + (item.product.prices[data.store.chain] ?? 0);
    }, 0);
  }, 0);

  const currentStoreEffectiveTotal = data.effective_total_estimate ?? computedEffectiveTotal;
  const currentStoreBaseTotal = data.base_total_estimate ?? computedBaseTotal;
  const currentStoreSavings = data.estimated_savings ?? Math.max(0, currentStoreBaseTotal - currentStoreEffectiveTotal);

  const storeTotals: Record<string, number> = {
    [data.store.chain]: currentStoreEffectiveTotal,
    ...Object.fromEntries(Object.entries(comparisonData).map(([s, d]) => [s, d.total])),
  };

  const cheapestStore = Object.entries(storeTotals).sort((a, b) => a[1] - b[1])[0];
  const potentialSavings = currentStoreEffectiveTotal - cheapestStore[1];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors ${largeText ? "text-lg" : "text-base"}`}
      >
        <ArrowLeft className={largeText ? "size-6" : "size-5"} />
        New List
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className={`${largeText ? "text-3xl" : "text-2xl"} font-bold mb-1 dark:text-gray-100`}>Your Optimized Route</h1>
            <p className={`text-gray-600 dark:text-gray-400 flex items-center gap-2 ${largeText ? "text-lg" : "text-base"}`}>
              <MapPin className={largeText ? "size-5" : "size-4"} />
              {data.store.name}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-gray-600 dark:text-gray-400 ${largeText ? "text-lg" : "text-sm"}`}>Progress</p>
            <p className={`${largeText ? "text-3xl" : "text-2xl"} font-bold text-blue-600`}>
              {checkedCount}/{totalItems}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Cart Total and Compare Button */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-600">Cart Total at {data.store.chain}</p>
            <p className="text-3xl font-bold text-green-700">${currentStoreEffectiveTotal.toFixed(2)}</p>
            {currentStoreSavings > 0 && (
              <p className="text-sm text-green-700 font-semibold">Save ${currentStoreSavings.toFixed(2)} with coupons</p>
            )}
          </div>
          <button
            onClick={() => setShowComparison(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <TrendingDown className="size-5" />
            Compare Stores
          </button>
        </div>
      </div>

      {/* Price Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Store Price Comparison</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See how much your cart costs at different stores</p>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl leading-none"
                aria-label="Close comparison"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto dark:bg-gray-800">
              {loadingComparison && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading coupon data...</p>
              )}
              <div className="grid gap-4">
                {Object.entries(storeTotals)
                  .sort((a, b) => a[1] - b[1])
                  .map(([storeName, total], index) => {
                    const isCurrent = storeName === data.store.chain;
                    const isCheapest = index === 0;
                    const savingsVsCurrent = isCurrent ? 0 : currentStoreEffectiveTotal - total;
                    const storeCouponSavings = isCurrent
                      ? currentStoreSavings
                      : (comparisonData[storeName]?.savings ?? 0);
                    
                    return (
                      <button
                        key={storeName}
                        onClick={() => {
                          if (!isCurrent && onStoreSwitch) {
                            onStoreSwitch(storeName);
                            setShowComparison(false);
                          }
                        }}
                        disabled={isCurrent}
                        className={`p-5 rounded-lg border-2 transition-all text-left ${
                          isCheapest
                            ? "bg-green-50 dark:bg-green-900/30 border-green-500"
                            : isCurrent
                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-500 hover:shadow-lg cursor-pointer"
                        } ${isCurrent ? "cursor-default" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{storeName}</h3>
                                {isCheapest && (
                                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                                    BEST PRICE
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              {storeCouponSavings > 0 && (
                                <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                                  Includes ${storeCouponSavings.toFixed(2)} coupon savings
                                </p>
                              )}
                              {!isCurrent && savingsVsCurrent > 0 && (
                                <p className="text-sm text-green-700 font-semibold">
                                  Save ${savingsVsCurrent.toFixed(2)} vs {data.store.chain}
                                </p>
                              )}
                              {!isCurrent && savingsVsCurrent < 0 && (
                                <p className="text-sm text-red-700 font-semibold">
                                  ${Math.abs(savingsVsCurrent).toFixed(2)} more than {data.store.chain}
                                </p>
                              )}
                              {!isCurrent && (
                                <p className="text-xs text-purple-600 font-semibold mt-2 flex items-center gap-1">
                                  <Package className="size-3" />
                                  Click to switch to this store
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${
                              isCheapest ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-900"
                            }`}>
                              ${total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {potentialSavings > 0 && data.store.chain !== cheapestStore[0] && (
                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="size-6 text-yellow-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-yellow-900 mb-1">Potential Savings Alert!</h4>
                      <p className="text-sm text-yellow-800">
                        You could save <strong>${potentialSavings.toFixed(2)}</strong> by shopping at <strong>{cheapestStore[0]}</strong> instead of {data.store.chain}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => setShowComparison(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optimized List by Aisle */}
      <div className="space-y-4">
        {/* Active Aisles */}
        {activeAisles.map(({ aisleGroup, originalIndex }) => (
          <div key={originalIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Aisle Header */}
            <div className="bg-blue-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Aisle {aisleGroup.aisle}</p>
                  <h3 className="text-xl font-bold">{aisleGroup.aisle_name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{aisleGroup.items.length}</p>
                  <p className="text-sm opacity-90">items</p>
                </div>
              </div>
            </div>

            {/* Items in Aisle */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {aisleGroup.items.map((item, itemIdx) => {
                const itemKey = `${originalIndex}-${itemIdx}`;
                const isChecked = checkedItems.has(itemKey);

                if (!item.product) {
                  return (
                    <div key={itemIdx} className="p-4 bg-gray-50 dark:bg-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No match found for: {item.raw_input}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={itemIdx}
                    className={`p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isChecked ? "opacity-50" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCheck(itemKey)}
                      className={`flex-shrink-0 size-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-600"
                      }`}
                    >
                      {isChecked && <Check className="size-4 text-white" />}
                    </button>

                    {/* Product Image */}
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="size-20 object-cover rounded border border-gray-200 flex-shrink-0"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium mb-1 dark:text-gray-100 ${isChecked ? "line-through" : ""}`}>
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Original: {item.raw_input}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 font-semibold text-green-700">
                          <DollarSign className="size-4" />
                          {(item.product.effective_unit_price ?? item.product.prices[data.store.chain] ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Link */}
                    <a
                      href={item.product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 self-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      View
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Unmatched Items */}
        {data.unmatched_items.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 border-orange-300">
            <div className="bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-300 px-6 py-4">
              <h3 className="text-xl font-bold">Unmatched Items</h3>
              <p className="text-sm mt-1">
                We couldn't find these products. Try being more specific.
              </p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.unmatched_items.map((item, idx) => (
                <div key={idx} className="p-4 text-gray-700 dark:text-gray-300">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Aisles Section */}
        {completedAisles.length > 0 && (
          <div className="mt-8 pt-8 border-t-4 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Check className="size-6 text-green-600" />
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Items Grabbed</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {completedAisles.length} {completedAisles.length === 1 ? "aisle" : "aisles"} complete
              </span>
            </div>

            <div className="space-y-4">
              {completedAisles.map(({ aisleGroup, originalIndex }) => (
                <div key={originalIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 border-green-300">
                  {/* Aisle Header */}
                  <div className="bg-green-600 text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Check className="size-6" />
                        <div>
                          <p className="text-sm font-medium opacity-90">Aisle {aisleGroup.aisle}</p>
                          <h3 className="text-xl font-bold">{aisleGroup.aisle_name}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{aisleGroup.items.length}</p>
                        <p className="text-sm opacity-90">items</p>
                      </div>
                    </div>
                  </div>

                  {/* Items in Aisle */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-green-50 dark:bg-green-900/20">
                    {aisleGroup.items.map((item, itemIdx) => {
                      const itemKey = `${originalIndex}-${itemIdx}`;
                      const isChecked = checkedItems.has(itemKey);

                      if (!item.product) {
                        return (
                          <div key={itemIdx} className="p-4 bg-gray-50">
                            <p className="text-gray-500 italic">
                              No match found for: {item.raw_input}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={itemIdx}
                          className="p-4 flex gap-4 opacity-60"
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleCheck(itemKey)}
                            className="flex-shrink-0 size-6 rounded border-2 flex items-center justify-center bg-green-600 border-green-600"
                          >
                            <Check className="size-4 text-white" />
                          </button>

                          {/* Product Image */}
                          <img
                            src={item.product.image_url}
                            alt={item.product.title}
                            className="size-20 object-cover rounded border border-gray-200 flex-shrink-0"
                          />

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1 line-through">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-gray-500 mb-2">
                              Original: {item.raw_input}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 font-semibold text-green-700">
                                <DollarSign className="size-4" />
                                {(item.product.effective_unit_price ?? item.product.prices[data.store.chain] ?? 0).toFixed(2)}
                              </span>
                              {item.product.applied_coupon && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">
                                  {item.product.applied_coupon.discount || "Coupon"} applied
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Link */}
                          <a
                            href={item.product.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 self-center px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            View
                            <ExternalLink className="size-4" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-800 dark:text-green-400">
          <strong>Route optimized!</strong> Follow the aisles from top to bottom to minimize backtracking.
        </p>
      </div>
    </div>
  );
}


