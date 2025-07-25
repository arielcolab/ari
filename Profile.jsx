
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Order } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  X,
  Heart,
  Bell,
  Globe,
  HelpCircle,
  ChevronRight,
  LogOut,
  MapPin,
  Shield,
  User as UserIcon, // User icon - renamed to avoid conflict with User entity
  ShoppingBag,
  Users,
  Edit,
  Gift,
  CreditCard,
  DollarSign, // NEW import for currency settings
  PlusCircle,
  Trophy,
  Settings, // NEW
  Package, // NEW
  Headphones // NEW - using Headphones for HeadphonesIcon
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";
import OptimizedImage from "../components/dd_OptimizedImage";
import { PriceDisplay } from "../components/utils/dd_currency";
import RatingDisplay from "../components/reviews/RatingDisplay";

/**
 * A quick link component for profile section, designed for a grid layout.
 * @param {object} props
 * @param {React.ReactNode} props.icon - The Lucide icon component.
 * @param {string} props.title - The title text for the link.
 * @param {string} props.route - The route name to navigate to.
 */
const ProfileLink = ({ icon, title, route }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (route) {
      navigate(createPageUrl(route));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
    >
      <div className="mb-2 text-gray-600">{icon}</div>
      <span className="text-sm font-medium text-gray-800">{title}</span>
    </button>
  );
};

/**
 * A general purpose quick link component for profile settings, designed for list layout.
 * @param {object} props
 * @param {React.ComponentType} props.icon - The Lucide icon component.
 * @param {string} props.text - The text for the link.
 * @param {string} [props.route] - The route name to navigate to.
 * @param {function} [props.onClick] - Optional click handler for actions like logout.
 * @param {boolean} [props.isLogout] - If true, applies specific styling for logout button.
 */
const QuickLink = ({ icon: Icon, text, route, onClick, isLogout }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(createPageUrl(route));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center text-left px-4 py-3 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 transition-colors ${
        isLogout ? 'text-red-600' : 'text-gray-800'
      }`}
    >
      {Icon && <Icon className={`w-5 h-5 mr-3 ${isLogout ? 'text-red-600' : 'text-gray-500'}`} />}
      <span className="flex-grow font-medium text-base">{text}</span>
      {!isLogout && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </button>
  );
};

/**
 * Component to display a recent order in the profile section.
 * @param {object} props
 * @param {object} props.order - The order object.
 */
const RecentOrderCard = ({ order }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(createPageUrl(`DishDetails?id=${order.dish_id}`))}
    >
      <OptimizedImage 
        src={order.dish_photo || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=60&auto=format&fit=crop"}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-900">{order.dish_name || 'Unknown Dish'}</h4>
        <p className="text-xs text-gray-600">{order.cook_name || 'Unknown Cook'}</p>
        <div className="flex items-center gap-2 mt-1">
          <PriceDisplay price={(order.amount_total || 0) / 100} className="text-xs font-medium text-red-600" />
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">1.5 km</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">45-55 min</span>
          <span className="text-xs text-gray-400">•</span>
          <RatingDisplay rating={4.2} showCount={false} size="xs" />
        </div>
      </div>
    </div>
  );
};

/**
 * A general purpose setting item component for profile settings, designed for list layout.
 * @param {object} props
 * @param {React.ComponentType} props.icon - The Lucide icon component.
 * @param {string} props.label - The text for the item.
 * @param {function} props.onPress - The click handler for the item.
 */
const SettingItem = ({ icon: Icon, label, onPress }) => {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        {Icon && <Icon className="w-5 h-5 mr-3 text-gray-500" />}
        <span className="font-medium text-base text-gray-800">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
};


export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  const [safeModeAllergens, setSafeModeAllergens] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      if (userData) {
          setSafeModeAllergens(userData.safe_mode_allergens || []);
          // Mock data for recent orders for demonstration purposes
          const orders = await Order.filter({ buyer_id: userData.id });
          const recentOrdersWithDetails = orders.slice(0, 3).map(order => ({
            ...order,
            cook_name: `Cook ${order.cook_id}`,
            dish_name: `Dish ${order.dish_id}`,
            dish_photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&auto=format&fit=crop" // Example dish photo
          }));
          setRecentOrders(recentOrdersWithDetails);
      }
    } catch (error) {
      // If user is not logged in or API fails, treat as guest - no error thrown
      console.log("User not authenticated, showing guest profile");
      setUser(null);
      setRecentOrders([]);
    }
    setIsLoading(false);
  };
  
  const handleLogin = async () => {
    try {
      await User.login();
      setTimeout(() => { window.location.reload(); }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      showToast(t('loginFailed', 'Login failed. Please try again.'), 'error');
    }
  };

  const handleLogout = async () => {
    if (confirm(t('areYouSureLogout', 'Are you sure you want to log out?'))) {
      try {
        await User.logout();
        setUser(null);
        localStorage.removeItem('dishDashCart'); // Clear local cart on logout
        navigate(createPageUrl("Home"));
        setTimeout(() => { window.location.reload(); }, 100); // Reload page to reflect guest state
      } catch (error) {
        console.error("Logout failed", error);
        showToast(t('logoutFailed', 'Logout failed. Please try again.'), 'error');
      }
    }
  };

  const handleSafeModeToggle = async () => {
      // For simplicity, we'll just toggle a "nuts" allergy. A real UI would be a multi-select.
      const newAllergens = safeModeAllergens.includes('nuts') ? [] : ['nuts'];
      try {
          await User.updateMyUserData({ safe_mode_allergens: newAllergens });
          setSafeModeAllergens(newAllergens);
          showToast(t('safeModeUpdated', 'Allergy filter updated!'), 'success');
      } catch (error) {
          showToast(t('error', 'Error updating settings'), 'error');
      }
  };

  // Show loading spinner only if actually loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  // Profile page is now always accessible - no login gate
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GlobalHeader is now in Layout.js - removed duplicate header elements */}
      
      <div className="p-4">
        {/* User Info Section - Always visible, shows login prompt for guests */}
        {user ? (
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold">
                  {t('hiUser', 'Hi {{name}}!').replace('{{name}}', user.full_name?.split(' ')[0] || 'User')}
                </h2>
                <p className="text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 mb-6 text-center shadow-sm">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">{t('browsingAsGuest', 'Browsing as Guest')}</h2>
            <p className="text-gray-600 mb-4 max-w-sm mx-auto">{t('joinToUnlock', 'Join DishDash to save favorites, track orders, and get exclusive deals.')}</p>
            <Button onClick={handleLogin} className="w-full max-w-xs mx-auto bg-red-600 hover:bg-red-700 h-12 text-white text-lg">
              {t('loginOrSignUp', 'Login / Sign Up')}
            </Button>
          </div>
        )}

        {/* Quick Actions Section (New Grid Layout) */}
        <div className="pb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t('quickLinks', 'Quick links')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <ProfileLink 
              icon={<Gift className="w-5 h-5" />} 
              title={t('inviteFriends', 'Invite friends')} 
              route="ReferralSystem" 
            />
            <ProfileLink 
              icon={<CreditCard className="w-5 h-5" />} 
              title={t('redeemCode', 'Redeem code')} 
              route="RedeemCode" 
            />
            <ProfileLink 
              icon={<Package className="w-5 h-5" />} 
              title={t('ordersReturns', 'Orders & returns')} 
              route="OrderHistory" 
            />
            <ProfileLink 
              icon={<Headphones className="w-5 h-5" />} 
              title={t('contactSupport', 'Contact Support')} 
              route="ContactSupport" 
            />
          </div>
        </div>

        {/* Remaining sections grouped for consistent padding and spacing */}
        <div className="space-y-6 pb-20">
          {/* Order Again Section - Conditional */}
          {user && recentOrders.length > 0 && (
            <div className="bg-white rounded-lg">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{t('orderAgain', 'Order again')}</h3>
              </div>
              <div className="divide-y">
                  {recentOrders.map((order) => <RecentOrderCard key={order.id} order={order}/>)}
              </div>
            </div>
          )}

          {/* Cook's Corner Section - Conditional */}
          {user && user.role === 'cook' && (
            <div className="bg-white rounded-lg">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{t('cooksCorner', "Cook's Corner")}</h3>
              </div>
              <QuickLink icon={UserIcon} text={t('myDishes', 'My Dishes')} route="MyDishes" />
              <QuickLink icon={PlusCircle} text={t('batchUpload', 'Batch Upload')} route="BulkUpload" />
            </div>
          )}

          {/* Settings Section - Comprehensive Implementation */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('settings', 'Settings')}</h2>
            <div className="space-y-2">
              <SettingItem 
                icon={Settings} 
                label={t('accountSettings', 'Account Settings')} 
                onPress={() => navigate(createPageUrl('AccountSettings'))}
              />
              <SettingItem 
                icon={Bell} 
                label={t('notifications', 'Notifications')} 
                onPress={() => navigate(createPageUrl('NotificationSettings'))} 
              />
              <SettingItem 
                icon={MapPin} 
                label={t('savedAddresses', 'Saved Addresses')} 
                onPress={() => navigate(createPageUrl('SavedAddresses'))} 
              />
              <SettingItem 
                icon={CreditCard} 
                label={t('paymentMethods', 'Payment Methods')} 
                onPress={() => navigate(createPageUrl('PaymentMethod'))} 
              />
              <SettingItem 
                icon={Globe} 
                label={t('languageSettings', 'Language')} 
                onPress={() => navigate(createPageUrl('LanguageSettings'))} 
              />
              <SettingItem 
                icon={DollarSign} 
                label={t('currency', 'Currency')} 
                onPress={() => navigate(createPageUrl('CurrencySettings'))} 
              />
              <SettingItem 
                icon={Shield} 
                label={t('privacySettings', 'Privacy')} 
                onPress={() => navigate(createPageUrl('PrivacySettings'))} 
              />
              <SettingItem 
                icon={HelpCircle} 
                label={t('help', 'Help & Support')} 
                onPress={() => navigate(createPageUrl('Help'))} 
              />
            </div>
          </div>
          
          {/* Allergen Safe Mode - Moved to its own distinct block - Conditional */}
          {user && (
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                      <span className="font-medium text-base text-gray-800">{t('allergenSafeMode', 'Allergen Safe Mode')}</span>
                      <p className="text-xs text-gray-500">{t('allergenSafeModeDesc', 'Hide items with specific allergens.')}</p>
                  </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={safeModeAllergens.length > 0} onChange={handleSafeModeToggle} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          )}
          
          {/* Support Section */}
          <div className="bg-white rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('support', 'Support')}</h3>
            </div>
            <QuickLink text={t('helpCenter', 'Help Center')} route="Help" />
            <QuickLink text={t('termsAndPrivacy', 'Terms & Privacy')} route="TermsOfService" />
            <QuickLink text="FAQ" route="FAQ" />
          </div>

          {/* Logout - Conditional */}
          {user && (
            <div className="bg-white rounded-lg">
                <QuickLink icon={LogOut} text={t('logOut', 'Log Out')} onClick={handleLogout} isLogout />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
