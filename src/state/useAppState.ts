import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_CART, FARMS } from "@/data/farms";
import { TIER_LIMITS, TIER_NAMES } from "@/data/tiers";
import { USER_LOC, kmDistance } from "@/lib/geo";
import { clearState, loadState, saveState } from "@/lib/storage";
import { GMAPS_LS, readStoredKey, resetLoader } from "@/components/map/loader";
import type { CartLine, Farm, FarmView, Product, ScreenId, TabId, Tier } from "@/types";
import { useToasts } from "./useToasts";

export type FarmProfileDraft = Omit<Farm, "id" | "tier" | "rating" | "reviews" | "eko" | "since" | "products" | "featured">;

/**
 * Jedno miejsce z całym stanem demo. Celowo bez biblioteki — gdy
 * pojawi się backend, to jest warstwa do wymiany na zapytania do API.
 */
export function useAppState() {
  const saved = useMemo(() => loadState(), []);
  const { toasts, push } = useToasts();

  const [screen, setScreen] = useState<ScreenId>("splash");
  const [tab, setTab] = useState<TabId>("discover");
  const [farms, setFarms] = useState<Farm[]>(saved?.farms ?? FARMS);
  const [farmerFarmId, setFarmerFarmId] = useState<string | null>(saved?.farmerFarmId ?? null);
  const [selectedTier, setSelectedTier] = useState<Tier>("sad");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState("f1");
  const [selectedProductId, setSelectedProductId] = useState("p1");
  const [cart, setCart] = useState<CartLine[]>(saved?.cart ?? DEFAULT_CART);
  const [favourites, setFavourites] = useState<string[]>(saved?.favourites ?? ["f2"]);
  const [notify, setNotify] = useState<string[]>(saved?.notify ?? []);

  const [apiKey, setApiKey] = useState(() => readStoredKey());
  const [mapError, setMapError] = useState<string | null>(null);
  const [keySheetOpen, setKeySheetOpen] = useState(false);

  useEffect(() => {
    saveState({ farms, farmerFarmId, cart, favourites, notify });
  }, [farms, farmerFarmId, cart, favourites, notify]);

  /** Dystanse są pochodną współrzędnych — liczone, nigdy zapisywane. */
  const farmsView: FarmView[] = useMemo(
    () => farms.map((f) => ({ ...f, distance: Math.max(1, Math.round(kmDistance(USER_LOC, f.coords))) })),
    [farms],
  );

  const goTo = useCallback((s: ScreenId) => setScreen(s), []);
  const goTab = useCallback((t: TabId) => { setTab(t); setScreen(t); }, []);
  const openFarm = useCallback((id: string) => { setSelectedFarmId(id); setScreen("farm"); }, []);
  const openProduct = useCallback((id: string) => { setSelectedProductId(id); setScreen("product"); }, []);

  // ---------------------------------------------------------------- mapa
  const handleEngineError = useCallback((message: string) => {
    setMapError(message);
    setApiKey("");
    try { localStorage.removeItem(GMAPS_LS); } catch { /* nic */ }
    resetLoader();
    push("Mapa Google nie wstała — wracam do mapy rysunkowej.", { tone: "warn", duration: 4200 });
  }, [push]);

  const saveApiKey = useCallback((key: string) => {
    resetLoader();
    setMapError(null);
    setApiKey(key);
    try { localStorage.setItem(GMAPS_LS, key); } catch { /* nic */ }
    setKeySheetOpen(false);
    push("Podłączono Google Maps.");
  }, [push]);

  const clearApiKey = useCallback(() => {
    resetLoader();
    setApiKey("");
    setMapError(null);
    try { localStorage.removeItem(GMAPS_LS); } catch { /* nic */ }
    setKeySheetOpen(false);
    push("Wróciłem do mapy rysunkowej.");
  }, [push]);

  // --------------------------------------------------------------- koszyk
  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((x) => x.productId === productId);
      if (found) return c.map((x) => (x.productId === productId ? { ...x, qty: x.qty + qty } : x));
      return [...c, { productId, qty }];
    });
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setCart((c) => (qty <= 0
      ? c.filter((x) => x.productId !== productId)
      : c.map((x) => (x.productId === productId ? { ...x, qty } : x))));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((c) => {
      const item = c.find((x) => x.productId === productId);
      if (item) {
        push("Usunięto z koszyka.", {
          action: { label: "Cofnij", onClick: () => setCart((cc) => [...cc, item]) },
          duration: 4200,
        });
      }
      return c.filter((x) => x.productId !== productId);
    });
  }, [push]);

  const placeOrder = useCallback((total: number) => {
    setCart([]);
    goTab("discover");
    push(`Zamówienie złożone — ${total.toFixed(2).replace(".", ",")} zł. Rolnicy dostali powiadomienie.`, { duration: 4200 });
  }, [goTab, push]);

  // ------------------------------------------------------- ulubione / sezon
  const toggleFavourite = useCallback((farmId: string) => {
    setFavourites((f) => {
      const on = f.includes(farmId);
      push(on ? "Usunięto z ulubionych." : "Dodano do ulubionych.");
      return on ? f.filter((x) => x !== farmId) : [...f, farmId];
    });
  }, [push]);

  const toggleNotify = useCallback((name: string) => {
    setNotify((n) => {
      const on = n.includes(name);
      push(on ? `Wyłączono powiadomienie: ${name}.` : `Powiadomimy Cię, gdy zaczną się ${name.toLowerCase()}.`);
      return on ? n.filter((x) => x !== name) : [...n, name];
    });
  }, [push]);

  // --------------------------------------------------------------- rolnik
  const myFarm = farmsView.find((f) => f.id === farmerFarmId) ?? null;

  const saveFarmProfile = useCallback((draft: FarmProfileDraft) => {
    if (farmerFarmId) {
      setFarms((fs) => fs.map((f) => (f.id === farmerFarmId ? { ...f, ...draft } : f)));
      push("Profil zaktualizowany.");
    } else {
      const id = `f${Date.now()}`;
      setFarms((fs) => [...fs, {
        id,
        tier: selectedTier,
        featured: selectedTier === "spichlerz",
        rating: null,
        reviews: 0,
        eko: false,
        since: new Date().getFullYear(),
        products: [],
        ...draft,
      }]);
      setFarmerFarmId(id);
      push("Gospodarstwo założone. Teraz dodaj produkty.");
    }
    setScreen("farmerPanel");
  }, [farmerFarmId, selectedTier, push]);

  const saveProduct = useCallback((product: Product) => {
    let isNew = true;
    setFarms((fs) => fs.map((f) => {
      if (f.id !== farmerFarmId) return f;
      const exists = f.products.some((p) => p.id === product.id);
      isNew = !exists;
      return {
        ...f,
        products: exists
          ? f.products.map((p) => (p.id === product.id ? product : p))
          : [...f.products, product],
      };
    }));
    push(isNew ? `Dodano „${product.name}" do oferty.` : "Zmiany zapisane.");
    setScreen("farmerPanel");
  }, [farmerFarmId, push]);

  const deleteProduct = useCallback((productId: string) => {
    const farm = farms.find((f) => f.id === farmerFarmId);
    const prod = farm?.products.find((p) => p.id === productId);
    setFarms((fs) => fs.map((f) => (f.id === farmerFarmId
      ? { ...f, products: f.products.filter((p) => p.id !== productId) }
      : f)));
    setCart((c) => c.filter((x) => x.productId !== productId));
    push(prod ? `Usunięto „${prod.name}".` : "Produkt usunięty.", {
      duration: 4200,
      action: prod
        ? {
            label: "Cofnij",
            onClick: () => setFarms((fs) => fs.map((f) => (f.id === farmerFarmId
              ? { ...f, products: [...f.products, prod] }
              : f))),
          }
        : undefined,
    });
    setScreen("farmerPanel");
  }, [farms, farmerFarmId, push]);

  const changeTier = useCallback((tier: Tier) => {
    setSelectedTier(tier);
    if (!myFarm) { setScreen("onboarding"); return; }
    const limit = TIER_LIMITS[tier];
    if (myFarm.products.length > limit) {
      push(`Masz ${myFarm.products.length} produktów — plan ${TIER_NAMES[tier]} mieści ${limit}. Najpierw usuń nadmiar.`,
        { tone: "warn", duration: 4600 });
      return;
    }
    setFarms((fs) => fs.map((f) => (f.id === myFarm.id
      ? { ...f, tier, featured: tier === "spichlerz" }
      : f)));
    push(`Plan zmieniony na ${TIER_NAMES[tier]}.`);
    setScreen("farmerPanel");
  }, [myFarm, push]);

  const resetDemo = useCallback(() => {
    clearState();
    setFarms(FARMS);
    setFarmerFarmId(null);
    setCart(DEFAULT_CART);
    setFavourites(["f2"]);
    setNotify([]);
    goTab("discover");
    push("Demo zresetowane.");
  }, [goTab, push]);

  // ------------------------------------------------------------ pochodne
  const selectedFarm = farmsView.find((f) => f.id === selectedFarmId) ?? null;

  const selectedProduct = useMemo(() => {
    for (const f of farmsView) {
      const p = f.products.find((x) => x.id === selectedProductId);
      if (p) return { ...p, farm: f };
    }
    return null;
  }, [farmsView, selectedProductId]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  return {
    // nawigacja
    screen, tab, goTo, goTab, openFarm, openProduct,
    // dane
    farmsView, selectedFarm, selectedProduct, myFarm,
    cart, cartCount, favourites, notify,
    // akcje klienta
    addToCart, updateQty, removeFromCart, placeOrder, toggleFavourite, toggleNotify,
    // akcje rolnika
    saveFarmProfile, saveProduct, deleteProduct, changeTier, resetDemo,
    editingProductId, setEditingProductId,
    // mapa
    apiKey, mapError, keySheetOpen, setKeySheetOpen,
    saveApiKey, clearApiKey, handleEngineError,
    // ui
    toasts, push,
  };
}

export type AppState = ReturnType<typeof useAppState>;
