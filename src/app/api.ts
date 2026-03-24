// Central API service — all calls to the Flask backend go through here.
// Vite proxies /api/* to http://localhost:5000 in development.

const API_BASE = "/api";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("shopRoute_token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "An unexpected error occurred");
  }
  return data;
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  zip_code: string;
  prefer_store_brand: boolean;
  large_text: boolean;
  budget: number;
}

export async function register(email: string, name: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, name, password }),
  });
  await handleResponse(res);
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/profile`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function updateProfile(
  updates: Partial<Pick<UserProfile, "zip_code" | "prefer_store_brand" | "large_text" | "budget">>
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

// ── Stores ───────────────────────────────────────────────────────────────────

export interface StoreData {
  store_id: number;
  chain: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distance: number;
}

export async function getStores(zip?: string, chain?: string): Promise<StoreData[]> {
  const params = new URLSearchParams();
  if (zip) params.set("zip", zip);
  if (chain) params.set("chain", chain);
  const res = await fetch(`${API_BASE}/stores/?${params}`, { headers: authHeaders() });
  return handleResponse(res);
}

// ── Items ────────────────────────────────────────────────────────────────────

export interface ProductData {
  product_id: number;
  title: string;
  brand: string;
  image_url: string;
  affiliate_link: string;
  availability: "in_stock" | "out_of_stock" | "limited";
  category: string;
  keywords: string[];
  prices: Record<string, number>;
  stores: string[];
}

export async function getItems(options?: {
  store?: string;
  category?: string;
  search?: string;
}): Promise<ProductData[]> {
  const params = new URLSearchParams();
  if (options?.store) params.set("store", options.store);
  if (options?.category) params.set("category", options.category);
  if (options?.search) params.set("search", options.search);
  const res = await fetch(`${API_BASE}/items/?${params}`, { headers: authHeaders() });
  return handleResponse(res);
}

// ── Coupons ──────────────────────────────────────────────────────────────────

export interface CouponData {
  id: string;
  store: string;
  title: string;
  description: string;
  discount: string;
  category?: string;
  expiresIn: string;
  code?: string;
  type: "percentage" | "dollar" | "bogo" | "special";
}

export async function getCoupons(store: string): Promise<CouponData[]> {
  const res = await fetch(`${API_BASE}/coupons/?store=${encodeURIComponent(store)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ── Optimize ─────────────────────────────────────────────────────────────────

export interface OptimizeResult {
  optimized_list: Array<{
    zone_order: number;
    aisle: string;
    aisle_name: string;
    items: Array<{
      raw_input: string;
      product: ProductData | null;
    }>;
  }>;
  unmatched_items: string[];
}

export async function optimizeList(
  items: string[],
  storeChain: string,
  preferStoreBrand: boolean
): Promise<OptimizeResult> {
  const res = await fetch(`${API_BASE}/optimize/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      items,
      store_chain: storeChain,
      prefer_store_brand: preferStoreBrand,
    }),
  });
  return handleResponse(res);
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartData {
  id: number | null;
  store_chain: string;
  total_cost: number;
  items: Array<{ id: number; item_id: number; quantity: number }>;
}

export async function getCart(storeChain: string): Promise<CartData> {
  const res = await fetch(`${API_BASE}/cart/?store=${encodeURIComponent(storeChain)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function saveCart(
  storeId: number,
  storeChain: string,
  items: Array<{ item_id: number; quantity: number }>
): Promise<CartData> {
  const res = await fetch(`${API_BASE}/cart/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ store_id: storeId, store_chain: storeChain, items }),
  });
  return handleResponse(res);
}

export async function clearCart(storeChain: string): Promise<void> {
  const res = await fetch(`${API_BASE}/cart/?store=${encodeURIComponent(storeChain)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse(res);
}
