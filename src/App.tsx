import { C } from "@/design/tokens";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Nav } from "@/components/Nav";
import { Toasts } from "@/components/Toasts";
import { MapKeySheet } from "@/components/map/MapKeySheet";
import { useAppState } from "@/state/useAppState";
import { AccountScreen } from "@/screens/AccountScreen";
import { CartScreen } from "@/screens/CartScreen";
import { DiscoverScreen } from "@/screens/DiscoverScreen";
import { FarmScreen } from "@/screens/FarmScreen";
import { FarmerPanelScreen } from "@/screens/FarmerPanelScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { PricingScreen } from "@/screens/PricingScreen";
import { ProductEditScreen } from "@/screens/ProductEditScreen";
import { ProductScreen } from "@/screens/ProductScreen";
import { SeasonScreen } from "@/screens/SeasonScreen";
import { SplashScreen } from "@/screens/SplashScreen";
import type { TabId } from "@/types";

const WITH_NAV: string[] = ["discover", "farm", "product", "cart", "season", "account"];

export default function App() {
  const s = useAppState();

  const screens: Record<string, JSX.Element> = {
    splash: (
      <SplashScreen
        onStart={() => s.goTab("discover")}
        onFarmer={() => s.goTo(s.myFarm ? "farmerPanel" : "pricing")}/>
    ),
    discover: (
      <DiscoverScreen
        farms={s.farmsView} onOpenFarm={s.openFarm}
        favourites={s.favourites} onToggleFavourite={s.toggleFavourite}
        apiKey={s.apiKey} mapError={s.mapError} onEngineError={s.handleEngineError}
        onOpenKeySheet={() => s.setKeySheetOpen(true)} push={s.push}/>
    ),
    farm: (
      <FarmScreen
        farm={s.selectedFarm} onBack={() => s.goTab("discover")} onOpenProduct={s.openProduct}
        isFavourite={s.selectedFarm ? s.favourites.includes(s.selectedFarm.id) : false}
        onToggleFavourite={s.toggleFavourite}
        cart={s.cart} onGoCart={() => s.goTab("cart")} push={s.push}/>
    ),
    product: (
      <ProductScreen
        product={s.selectedProduct} onBack={() => s.goTo("farm")}
        addToCart={s.addToCart} onGoCart={() => s.goTab("cart")}
        onOpenFarm={s.openFarm} push={s.push}/>
    ),
    cart: (
      <CartScreen
        farms={s.farmsView} cart={s.cart}
        updateQty={s.updateQty} removeFromCart={s.removeFromCart}
        onBrowse={() => s.goTab("discover")} onPlaceOrder={s.placeOrder} onOpenFarm={s.openFarm}/>
    ),
    season: <SeasonScreen notify={s.notify} onToggleNotify={s.toggleNotify}/>,
    account: (
      <AccountScreen
        myFarm={s.myFarm} favourites={s.favourites} farms={s.farmsView} apiKey={s.apiKey}
        onPricing={() => s.goTo(s.myFarm ? "farmerPanel" : "pricing")}
        onOpenFarm={s.openFarm} onOpenKeySheet={() => s.setKeySheetOpen(true)} push={s.push}/>
    ),
    pricing: (
      <PricingScreen
        onBack={() => (s.myFarm ? s.goTo("farmerPanel") : s.goTab("account"))}
        myFarm={s.myFarm} onContinue={s.changeTier}/>
    ),
    onboarding: (
      <OnboardingScreen
        farm={s.myFarm}
        onBack={() => s.goTo(s.myFarm ? "farmerPanel" : "pricing")}
        onSave={s.saveFarmProfile}
        apiKey={s.apiKey} onEngineError={s.handleEngineError} push={s.push}/>
    ),
    farmerPanel: s.myFarm ? (
      <FarmerPanelScreen
        farm={s.myFarm}
        onEditProfile={() => s.goTo("onboarding")}
        onEditProduct={(id) => { s.setEditingProductId(id); s.goTo("productEdit"); }}
        onAddProduct={() => { s.setEditingProductId(null); s.goTo("productEdit"); }}
        onViewPublic={() => s.openFarm(s.myFarm!.id)}
        onChangePlan={() => s.goTo("pricing")}
        onExit={() => s.goTab("discover")}
        onReset={s.resetDemo}/>
    ) : (
      <PricingScreen onBack={() => s.goTab("account")} myFarm={null} onContinue={s.changeTier}/>
    ),
    productEdit: s.myFarm ? (
      <ProductEditScreen
        farm={s.myFarm} productId={s.editingProductId}
        onBack={() => s.goTo("farmerPanel")}
        onSave={s.saveProduct} onDelete={s.deleteProduct}/>
    ) : (
      <PricingScreen onBack={() => s.goTab("account")} myFarm={null} onContinue={s.changeTier}/>
    ),
  };

  const showNav = WITH_NAV.includes(s.screen);
  const activeTab: TabId =
    s.screen === "farm" || s.screen === "product" ? "discover" : (s.tab);

  return (
    <div className="app" style={{ background: C.paper }}>
      <a className="skip-link" href="#main">Przejdź do treści</a>

      <main
        id="main"
        className="app-main"
        style={showNav ? undefined : { paddingBottom: 0, marginLeft: 0 }}>
        <ErrorBoundary key={s.screen}>
          <div className="screen-enter" key={s.screen}>{screens[s.screen]}</div>
        </ErrorBoundary>
      </main>

      {showNav && <Nav tab={activeTab} setTab={s.goTab} cartCount={s.cartCount}/>}

      <Toasts toasts={s.toasts}/>
      <MapKeySheet
        open={s.keySheetOpen} apiKey={s.apiKey} error={s.mapError}
        onClose={() => s.setKeySheetOpen(false)}
        onSave={s.saveApiKey} onClear={s.clearApiKey}/>
    </div>
  );
}
