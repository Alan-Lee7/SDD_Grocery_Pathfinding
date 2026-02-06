import { ArrowLeft, Check, ExternalLink, MapPin, DollarSign, Package } from "lucide-react";
import { useState } from "react";

interface Product {
  product_id: number;
  title: string;
  price: number;
  image_url: string;
  affiliate_link: string;
  availability: "in_stock" | "out_of_stock" | "limited";
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
  };
  optimized_list: AisleGroup[];
  unmatched_items: string[];
}

interface OptimizedListProps {
  data: OptimizedListData;
  onBack: () => void;
}

export function OptimizedList({ data, onBack }: OptimizedListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

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

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="size-5" />
        New List
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your Optimized Route</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="size-4" />
              {data.store.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {checkedCount}/{totalItems}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Optimized List by Aisle */}
      <div className="space-y-4">
        {/* Active Aisles */}
        {activeAisles.map(({ aisleGroup, originalIndex }) => (
          <div key={originalIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
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
            <div className="divide-y divide-gray-200">
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
                    className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors ${
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
                      <h4 className={`font-medium mb-1 ${isChecked ? "line-through" : ""}`}>
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Original: {item.raw_input}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 font-semibold text-green-700">
                          <DollarSign className="size-4" />
                          {item.product.price.toFixed(2)}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            item.product.availability === "in_stock"
                              ? "text-green-600"
                              : item.product.availability === "limited"
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          <Package className="size-4" />
                          {item.product.availability === "in_stock"
                            ? "In Stock"
                            : item.product.availability === "limited"
                            ? "Limited"
                            : "Out of Stock"}
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-orange-300">
            <div className="bg-orange-100 text-orange-900 px-6 py-4">
              <h3 className="text-xl font-bold">Unmatched Items</h3>
              <p className="text-sm mt-1">
                We couldn't find these products. Try being more specific.
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {data.unmatched_items.map((item, idx) => (
                <div key={idx} className="p-4 text-gray-700">
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
              <h2 className="text-2xl font-bold text-green-800">Items Grabbed</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {completedAisles.length} {completedAisles.length === 1 ? "aisle" : "aisles"} complete
              </span>
            </div>

            <div className="space-y-4">
              {completedAisles.map(({ aisleGroup, originalIndex }) => (
                <div key={originalIndex} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-green-300">
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
                  <div className="divide-y divide-gray-200 bg-green-50">
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
                                {item.product.price.toFixed(2)}
                              </span>
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
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Route optimized!</strong> Follow the aisles from top to bottom to minimize backtracking.
        </p>
      </div>
    </div>
  );
}
