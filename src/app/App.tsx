import { useState, useEffect } from "react";
import { Auth } from "./components/Auth";
import { StoreSelector } from "./components/StoreSelector";
import { ListInput } from "./components/ListInput";
import { OptimizedList } from "./components/OptimizedList";
import { matchProducts } from "./mockData";
import { LogOut, User as UserIcon, Settings, Type, DollarSign } from "lucide-react";

interface Store {
  store_id: number;
  chain: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface User {
  email: string;
  name: string;
}

type Step = "auth" | "store-selection" | "list-input" | "optimized-list";

export default function App() {
  const [step, setStep] = useState<Step>("auth");
  const [user, setUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Accessibility and preference settings
  const [largeText, setLargeText] = useState(() => {
    const saved = localStorage.getItem("shopRoute_largeText");
    return saved === "true";
  });
  const [preferStoreBrand, setPreferStoreBrand] = useState(() => {
    const saved = localStorage.getItem("shopRoute_preferStoreBrand");
    return saved === "true";
  });
  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem("shopRoute_budget");
    return saved ? parseFloat(saved) : 0;
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("shopRoute_largeText", String(largeText));
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem("shopRoute_preferStoreBrand", String(preferStoreBrand));
  }, [preferStoreBrand]);

  useEffect(() => {
    localStorage.setItem("shopRoute_budget", String(budget));
  }, [budget]);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setStep("store-selection");
  };

  const handleLogout = () => {
    setUser(null);
    setStep("auth");
    setSelectedStore(null);
    setOptimizedData(null);
  };

  const handleStoreSelected = (store: Store) => {
    setSelectedStore(store);
    setStep("list-input");
  };

  const handleOptimize = (items: string[]) => {
    const result = matchProducts(items, selectedStore!.chain, preferStoreBrand);
    setOptimizedData({
      store: {
        store_id: selectedStore!.store_id,
        name: `${selectedStore!.chain} - ${selectedStore!.city}`,
        chain: selectedStore!.chain
      },
      ...result,
      rawItems: items // Store the original items for re-optimization
    });
    setStep("optimized-list");
  };

  const handleStoreSwitch = (newChain: string) => {
    // Find a store with the new chain in the same area
    const stores = [
      { store_id: 1, chain: "Walmart", name: "Walmart Supercenter", address: "1549 Route 9", city: "Clifton Park", state: "NY", zip: "12065" },
      { store_id: 2, chain: "Target", name: "Target", address: "760 Hoosick Rd", city: "Troy", state: "NY", zip: "12180" },
      { store_id: 3, chain: "Hannaford", name: "Hannaford", address: "1 Clover Ridge Blvd", city: "Clifton Park", state: "NY", zip: "12065" },
      { store_id: 4, chain: "Aldi", name: "Aldi", address: "1440 Columbia Turnpike", city: "Castleton", state: "NY", zip: "12033" },
      { store_id: 5, chain: "Sam's Club", name: "Sam's Club", address: "200 Wade Rd", city: "Latham", state: "NY", zip: "12110" }
    ];
    
    const newStore = stores.find(s => s.chain === newChain);
    if (newStore && optimizedData?.rawItems) {
      setSelectedStore(newStore);
      const result = matchProducts(optimizedData.rawItems, newChain, preferStoreBrand);
      setOptimizedData({
        store: {
          store_id: newStore.store_id,
          name: `${newStore.chain} - ${newStore.city}`,
          chain: newStore.chain
        },
        ...result,
        rawItems: optimizedData.rawItems
      });
    }
  };

  const handleBack = () => {
    if (step === "list-input") {
      setStep("store-selection");
      setSelectedStore(null);
    } else if (step === "optimized-list") {
      setStep("list-input");
      setOptimizedData(null);
    }
  };

  if (step === "auth") {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${largeText ? "text-lg" : ""}`}>
      {/* Header with user info and logout */}
      {user && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className={`${largeText ? "text-3xl" : "text-2xl"} font-bold text-blue-600`}>ShopRoute</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className={largeText ? "size-6" : "size-5"} />
                <span className={largeText ? "text-lg font-medium" : "font-medium"}>Settings</span>
              </button>
              <div className="flex items-center gap-2 text-gray-700">
                <UserIcon className={largeText ? "size-6" : "size-5"} />
                <span className={largeText ? "text-lg font-medium" : "font-medium"}>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className={largeText ? "size-5" : "size-4"} />
                <span className={largeText ? "text-lg" : ""}>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${largeText ? "text-3xl" : "text-2xl"} font-bold text-gray-900`}>
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Large Text Toggle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Type className={largeText ? "size-6 text-blue-600" : "size-5 text-blue-600"} />
                    <h3 className={`${largeText ? "text-xl" : "text-lg"} font-semibold text-gray-900`}>
                      Large Text
                    </h3>
                  </div>
                  <p className={`${largeText ? "text-lg" : "text-sm"} text-gray-600`}>
                    Make text larger for easier reading
                  </p>
                </div>
                <button
                  onClick={() => setLargeText(!largeText)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    largeText ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label="Toggle large text"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      largeText ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Store Brand Preference Toggle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className={largeText ? "size-6 text-green-600" : "size-5 text-green-600"} />
                    <h3 className={`${largeText ? "text-xl" : "text-lg"} font-semibold text-gray-900`}>
                      Prefer Store Brands
                    </h3>
                  </div>
                  <p className={`${largeText ? "text-lg" : "text-sm"} text-gray-600`}>
                    Automatically select cheaper store brand products to save money
                  </p>
                </div>
                <button
                  onClick={() => setPreferStoreBrand(!preferStoreBrand)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    preferStoreBrand ? "bg-green-600" : "bg-gray-300"
                  }`}
                  aria-label="Toggle store brand preference"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      preferStoreBrand ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold ${largeText ? "text-xl" : "text-base"}`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 py-8">
        {step === "store-selection" && (
          <StoreSelector onStoreSelected={handleStoreSelected} largeText={largeText} />
        )}
        
        {step === "list-input" && selectedStore && (
          <ListInput
            store={selectedStore}
            onBack={handleBack}
            onOptimize={handleOptimize}
            largeText={largeText}
            preferStoreBrand={preferStoreBrand}
            budget={budget}
            setBudget={setBudget}
          />
        )}
        
        {step === "optimized-list" && optimizedData && (
          <OptimizedList data={optimizedData} onBack={handleBack} largeText={largeText} onStoreSwitch={handleStoreSwitch} />
        )}
      </div>
    </div>
  );
}