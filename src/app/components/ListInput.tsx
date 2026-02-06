import { ArrowLeft, ShoppingCart, Sparkles, Package, Plus, Minus, Search, Edit3 } from "lucide-react";
import { useState, useMemo } from "react";
import { mockProducts } from "../mockData";

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
}

type Tab = "browse" | "manual";

export function ListInput({ store, onBack, onOptimize }: ListInputProps) {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [inputText, setInputText] = useState("");
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

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

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="size-5" />
        Change Store
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-3">
          <ShoppingCart className="size-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-lg">{store.name}</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                {store.chain}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {store.city}, {store.state}
            </p>
          </div>
        </div>
      </div>

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
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="text-xs text-gray-600 mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  {quantity === 0 ? (
                    <button
                      onClick={() => addProduct(product.product_id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="size-4" />
                      Add to List
                    </button>
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
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
