import { MapPin, Search, Filter } from "lucide-react";
import { useState } from "react";

interface Store {
  store_id: number;
  chain: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distance: number;
}

interface StoreSelectorProps {
  onStoreSelected: (store: Store) => void;
  largeText?: boolean;
}

// Mock data for multiple grocery stores in 12180 area (Troy, NY)
const mockStores: Store[] = [
  // Walmart
  {
    store_id: 1,
    chain: "Walmart",
    name: "Walmart Supercenter",
    address: "760 Hoosick Rd",
    city: "Troy",
    state: "NY",
    zip: "12180",
    distance: 1.2
  },
  {
    store_id: 2,
    chain: "Walmart",
    name: "Walmart Supercenter",
    address: "141 Washington Ave Ext",
    city: "Albany",
    state: "NY",
    zip: "12205",
    distance: 4.8
  },
  // Target
  {
    store_id: 3,
    chain: "Target",
    name: "Target",
    address: "4 Northway Ln",
    city: "Latham",
    state: "NY",
    zip: "12110",
    distance: 3.5
  },
  {
    store_id: 4,
    chain: "Target",
    name: "Target",
    address: "1892 Central Ave",
    city: "Albany",
    state: "NY",
    zip: "12205",
    distance: 5.2
  },
  // Aldi
  {
    store_id: 5,
    chain: "Aldi",
    name: "Aldi",
    address: "952 Hoosick Rd",
    city: "Troy",
    state: "NY",
    zip: "12180",
    distance: 1.1
  },
  {
    store_id: 6,
    chain: "Aldi",
    name: "Aldi",
    address: "595 Columbia Turnpike",
    city: "East Greenbush",
    state: "NY",
    zip: "12061",
    distance: 4.5
  },
  // Sam's Club
  {
    store_id: 7,
    chain: "Sam's Club",
    name: "Sam's Club",
    address: "55 Clifton Country Rd",
    city: "Clifton Park",
    state: "NY",
    zip: "12065",
    distance: 7.3
  },
  {
    store_id: 8,
    chain: "Sam's Club",
    name: "Sam's Club",
    address: "141 Washington Ave Ext",
    city: "Albany",
    state: "NY",
    zip: "12205",
    distance: 5.7
  },
  // Hannaford
  {
    store_id: 9,
    chain: "Hannaford",
    name: "Hannaford Supermarket",
    address: "910 Hoosick Rd",
    city: "Troy",
    state: "NY",
    zip: "12180",
    distance: 1.0
  },
  {
    store_id: 10,
    chain: "Hannaford",
    name: "Hannaford Supermarket",
    address: "4 Chelsea Pl",
    city: "Clifton Park",
    state: "NY",
    zip: "12065",
    distance: 6.1
  }
];

const storeChains = ["All Stores", "Walmart", "Target", "Aldi", "Sam's Club", "Hannaford"];

const storeColors: Record<string, string> = {
  "Walmart": "bg-blue-600",
  "Target": "bg-red-600",
  "Aldi": "bg-orange-600",
  "Sam's Club": "bg-blue-700",
  "Hannaford": "bg-green-700"
};

export function StoreSelector({ onStoreSelected, largeText = false }: StoreSelectorProps) {
  const [zipCode, setZipCode] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedChain, setSelectedChain] = useState("All Stores");

  const handleSearch = () => {
    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores);
      setSearching(false);
    }, 500);
  };

  const filteredStores = selectedChain === "All Stores" 
    ? stores 
    : stores.filter(store => store.chain === selectedChain);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`${largeText ? "text-5xl" : "text-4xl"} font-bold mb-3`}>ShopRoute</h1>
        <p className={`${largeText ? "text-xl" : "text-lg"} text-gray-600`}>
          Optimize your grocery shopping trip by aisle
        </p>
        <p className={`${largeText ? "text-base" : "text-sm"} text-gray-500 mt-2`}>
          Supports Walmart, Target, Aldi, Sam's Club, Hannaford & more
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className={`block mb-2 ${largeText ? "text-xl" : "text-base"} font-medium`}>
          Find Nearby Grocery Stores
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${largeText ? "size-6" : "size-5"}`} />
            <input
              type="text"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${largeText ? "text-xl" : "text-base"}`}
              maxLength={5}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={zipCode.length !== 5 || searching}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors ${largeText ? "text-lg" : "text-base"}`}
          >
            <Search className={largeText ? "size-6" : "size-5"} />
            Search
          </button>
        </div>
      </div>

      {stores.length > 0 && (
        <>
          {/* Store Chain Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className={largeText ? "size-6" : "size-5"} />
              <span className={`${largeText ? "text-xl" : "text-base"} font-medium`}>Filter by Store:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {storeChains.map((chain) => (
                <button
                  key={chain}
                  onClick={() => setSelectedChain(chain)}
                  className={`px-4 py-2 rounded-lg ${largeText ? "text-base" : "text-sm"} font-medium transition-colors ${
                    selectedChain === chain
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {chain}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className={`font-semibold ${largeText ? "text-2xl" : "text-lg"}`}>
              {filteredStores.length} {filteredStores.length === 1 ? "Store" : "Stores"} Found
            </h2>
            {filteredStores.map((store) => (
              <button
                key={store.store_id}
                onClick={() => onStoreSelected(store)}
                className="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-left group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`${storeColors[store.chain]} text-white px-3 py-1 rounded-md ${largeText ? "text-sm" : "text-xs"} font-bold whitespace-nowrap mt-1`}>
                      {store.chain}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${largeText ? "text-2xl" : "text-lg"} group-hover:text-blue-600 transition-colors`}>
                        {store.name}
                      </h3>
                      <p className={`text-gray-600 ${largeText ? "text-base" : "text-sm"} mt-1`}>
                        {store.address}, {store.city}, {store.state} {store.zip}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`${largeText ? "text-base" : "text-sm"} text-gray-500`}>{store.distance} mi</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}