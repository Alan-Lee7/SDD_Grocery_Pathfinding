import { useState, useEffect } from "react";
import { Auth } from "./components/Auth";
import { StoreSelector } from "./components/StoreSelector";
import { ListInput } from "./components/ListInput";
import { OptimizedList } from "./components/OptimizedList";
import { optimizeList, getStores, getProfile, updateProfile, type StoreData } from "./api";
import { LogOut, User as UserIcon, Settings, Type, DollarSign } from "lucide-react";

interface User {
  email: string;
  name: string;
}

type Step = "auth" | "store-selection" | "list-input" | "optimized-list";

export default function App() {
  const [step, setStep] = useState<Step>("auth");
  const [user, setUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Accessibility and preference settings
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem("shopRoute_largeText") === "true";
  });
  const [preferStoreBrand, setPreferStoreBrand] = useState(() => {
    return localStorage.getItem("shopRoute_preferStoreBrand") === "true";
  });
  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem("shopRoute_budget");
    return saved ? parseFloat(saved) : 0;
  });

  // Persist preferences locally (also synced to backend on change)
  useEffect(() => {
    localStorage.setItem("shopRoute_largeText", String(largeText));
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem("shopRoute_preferStoreBrand", String(preferStoreBrand));
    if (user) {
      updateProfile({ prefer_store_brand: preferStoreBrand }).catch(() => {});
    }
  }, [preferStoreBrand]);

  useEffect(() => {
    localStorage.setItem("shopRoute_budget", String(budget));
    if (user) {
      updateProfile({ budget }).catch(() => {});
    }
  }, [budget]);

  // Restore session from stored JWT on page load
  useEffect(() => {
    const token = localStorage.getItem("shopRoute_token");
    if (token) {
      getProfile()
        .then((profile) => {
          setUser({ email: profile.email, name: profile.name });
          setPreferStoreBrand(profile.prefer_store_brand);
          setBudget(profile.budget);
          setStep("store-selection");
        })
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem("shopRoute_token");
        });
    }
  }, []);

  const handleAuthSuccess = (userData: User, _token: string) => {
    setUser(userData);
    setStep("store-selection");
  };

  const handleLogout = () => {
    localStorage.removeItem("shopRoute_token");
    setUser(null);
    setStep("auth");
    setSelectedStore(null);
    setOptimizedData(null);
  };

  const handleStoreSelected = (store: StoreData) => {
    setSelectedStore(store);
    setStep("list-input");
  };

  const handleOptimize = async (items: string[]) => {
    if (!selectedStore) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeList(items, selectedStore.chain, preferStoreBrand);
      setOptimizedData({
        store: {
          store_id: selectedStore.store_id,
          name: `${selectedStore.chain} - ${selectedStore.city}`,
          chain: selectedStore.chain,
        },
        ...result,
        rawItems: items,
      });
      setStep("optimized-list");
    } catch (err) {
      console.error("Optimize failed:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleStoreSwitch = async (newChain: string) => {
    if (!optimizedData?.rawItems) return;
    try {
      const stores = await getStores(undefined, newChain);
      const newStore = stores[0];
      if (!newStore) return;
      setSelectedStore(newStore);
      const result = await optimizeList(optimizedData.rawItems, newChain, preferStoreBrand);
      setOptimizedData({
        store: {
          store_id: newStore.store_id,
          name: `${newStore.chain} - ${newStore.city}`,
          chain: newStore.chain,
        },
        ...result,
        rawItems: optimizedData.rawItems,
      });
    } catch (err) {
      console.error("Store switch failed:", err);
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
      {/* Header */}
      {user && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className={`${largeText ? "text-3xl" : "text-2xl"} font-bold text-blue-600`}>
              Grocery Finder
            </h1>
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
                className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold ${
                  largeText ? "text-xl" : "text-base"
                }`}
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
            isOptimizing={isOptimizing}
          />
        )}

        {step === "optimized-list" && optimizedData && (
          <OptimizedList
            data={optimizedData}
            onBack={handleBack}
            largeText={largeText}
            onStoreSwitch={handleStoreSwitch}
          />
        )}
      </div>
    </div>
  );
}
