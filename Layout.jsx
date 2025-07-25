
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "./components/utils/translations";
import { Home, Search, Plus, ShoppingCart as CartIcon, User } from "lucide-react";
import { cartStore } from "./components/stores/CartStore";
import { ErrorBoundary, showToast } from "./components/common/ErrorBoundary";
import { User as UserEntity } from "@/api/entities";
import { ProfileManager } from "./components/utils/ProfileManager";
import SplashScreen from "./components/dd_SplashScreen";
import GlobalHeader from "./components/common/GlobalHeader";
import { HeaderProvider, useHeader } from './components/common/HeaderContext';
import DeliveryNotification from "./components/simulation/DeliveryNotification";

// We need an inner component to access the context from the provider
const AppContent = ({ children, currentPageName }) => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const [cartItemCount, setCartItemCount] = useState(0);
  const { headerControls } = useHeader();
  
  const pagesWithoutHeader = ['MapListings', 'SplashScreen', 'Onboarding', 'DevLogin'];
  const showHeader = !pagesWithoutHeader.includes(currentPageName);
  
  useEffect(() => {
    setCartItemCount(cartStore.getItemCount());
    const unsubscribe = cartStore.subscribe((items) => {
      const count = items.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    });
    return unsubscribe;
  }, []);

  const navigationItems = [
    { icon: Home, label: t('home', 'Home'), path: 'Home', isActive: currentPageName === 'Home' },
    { icon: Search, label: t('search', 'Search'), path: 'Search', isActive: currentPageName === 'Search' },
    { icon: Plus, label: t('post', 'Post'), path: 'PostDish', isActive: currentPageName.startsWith('Post'), className: "bg-red-600 text-white rounded-full p-2 shadow-lg" },
    { icon: CartIcon, label: t('cart', 'Cart'), path: 'Cart', isActive: currentPageName === 'Cart', badge: cartItemCount > 0 ? cartItemCount : null },
    { icon: User, label: t('profile', 'Profile'), path: 'Profile', isActive: currentPageName === 'Profile' }
  ];
  const isRTL = currentLanguage === 'ar' || currentLanguage === 'he';

  return (
    <div className={`min-h-screen bg-gray-50`} dir={isRTL ? 'rtl' : 'ltr'}>
      {showHeader && <GlobalHeader {...headerControls} />}
      <main className="pb-20">{children}</main>
      
      {/* Add delivery notification overlay */}
      <DeliveryNotification />
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-between items-center max-w-screen-sm mx-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                item.isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              } ${item.className || ''}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className={`absolute -top-1 ${isRTL ? 'left-[-0.25rem]' : 'right-[-0.25rem]'} bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};


export default function Layout({ children, currentPageName }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem('dishdash_app_loaded');
    if (!hasLoadedBefore) {
      setShowSplash(true);
      const setupUserAndApp = async () => {
        try {
          const userData = await UserEntity.me();
          if (userData) {
            await ProfileManager.ensureUserProfile(userData);
            if (!userData.onboarding_completed) {
              const browserLocale = navigator.language.split('-')[0] || 'en';
              await UserEntity.updateMyUserData({ 
                onboarding_completed: true,
                locale: userData.locale || browserLocale
              });
              showToast('Welcome!', 'success');
            }
          }
        } catch (error) {
          console.log("User not authenticated, continuing as guest.");
        }
        setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem('dishdash_app_loaded', 'true');
        }, 3000);
      };
      setupUserAndApp();
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
  
  return (
    <ErrorBoundary>
      <HeaderProvider>
        <AppContent currentPageName={currentPageName}>
          {children}
        </AppContent>
      </HeaderProvider>
    </ErrorBoundary>
  );
}
