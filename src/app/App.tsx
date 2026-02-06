import { useState } from "react";
import { Auth } from "./components/Auth";
import { StoreSelector } from "./components/StoreSelector";
import { ListInput } from "./components/ListInput";
import { OptimizedList } from "./components/OptimizedList";
import { matchProducts } from "./mockData";
import { LogOut, User as UserIcon } from "lucide-react";

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
    const result = matchProducts(items, selectedStore!.chain);
    setOptimizedData({
      store: {
        store_id: selectedStore!.store_id,
        name: `${selectedStore!.chain} - ${selectedStore!.city}`
      },
      ...result
    });
    setStep("optimized-list");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with user info and logout */}
      {user && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">ShopRoute</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <UserIcon className="size-5" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 py-8">
        {step === "store-selection" && (
          <StoreSelector onStoreSelected={handleStoreSelected} />
        )}
        
        {step === "list-input" && selectedStore && (
          <ListInput
            store={selectedStore}
            onBack={handleBack}
            onOptimize={handleOptimize}
          />
        )}
        
        {step === "optimized-list" && optimizedData && (
          <OptimizedList data={optimizedData} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
