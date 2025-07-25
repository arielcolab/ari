import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Globe, DollarSign, Bell, Shield, User, MapPin, Heart, Eye, Moon, Sun } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { useCurrency } from '../components/utils/dd_currency';
import { User as UserEntity } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';

const SettingItem = ({ icon: Icon, title, subtitle, value, onClick, showChevron = true }) => (
  <div 
    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-600">{value}</span>}
      {showChevron && <ChevronRight className="w-4 h-4 text-gray-400" />}
    </div>
  </div>
);

const ToggleItem = ({ icon: Icon, title, subtitle, value, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div 
      className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
        value ? 'bg-red-500' : 'bg-gray-300'
      }`}
      onClick={() => onChange(!value)}
    >
      <div 
        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
          value ? 'translate-x-6' : 'translate-x-0.5'
        }`} 
      />
    </div>
  </div>
);

export default function AccountSettings() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const { currentCurrency } = useCurrency();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showActivity: true,
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    
    // App Preferences
    darkMode: false,
    autoLocation: true,
    biometricAuth: false,
    rememberPayment: true,
    
    // Safety Settings
    allergenWarnings: true,
    dietaryRestrictions: [],
    safeMode: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await UserEntity.me();
      setUser(userData);
      
      // Load saved settings from user data
      if (userData.app_settings) {
        setSettings(prev => ({ ...prev, ...userData.app_settings }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Save to user entity
      await UserEntity.updateMyUserData({
        app_settings: newSettings
      });
      
      showToast(t('settingsUpdated', 'Settings updated'), 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast(t('settingsUpdateError', 'Error updating settings'), 'error');
    }
  };

  const settingsSections = [
    {
      title: t('accountPersonalization', 'Account & Personalization'),
      items: [
        {
          icon: User,
          title: t('editProfile', 'Edit Profile'),
          subtitle: t('editProfileDesc', 'Name, photo, bio'),
          onClick: () => navigate('/EditMyProfile')
        },
        {
          icon: Globe,
          title: t('languageRegion', 'Language & Region'),
          subtitle: currentLanguage.toUpperCase(),
          onClick: () => navigate('/LanguageSettings')
        },
        {
          icon: DollarSign,
          title: t('currency', 'Currency'),
          subtitle: currentCurrency,
          onClick: () => navigate('/CurrencySettings')
        },
        {
          icon: MapPin,
          title: t('addresses', 'Addresses'),
          subtitle: t('manageAddresses', 'Manage saved addresses'),
          onClick: () => navigate('/SavedAddresses')
        },
        {
          icon: Heart,
          title: t('dietaryPreferences', 'Dietary Preferences'),
          subtitle: t('dietaryPreferencesDesc', 'Allergies, diet type'),
          onClick: () => navigate('/DietaryPreferences')
        }
      ]
    },
    {
      title: t('notifications', 'Notifications'),
      items: [
        {
          icon: Bell,
          title: t('notificationSettings', 'Notification Settings'),
          subtitle: t('notificationSettingsDesc', 'Manage all notifications'),
          onClick: () => navigate('/NotificationSettings')
        }
      ]
    },
    {
      title: t('privacySafety', 'Privacy & Safety'),
      items: [
        {
          icon: Shield,
          title: t('privacySettings', 'Privacy Settings'),
          subtitle: t('privacySettingsDesc', 'Control who sees your info'),
          onClick: () => navigate('/PrivacySettings')
        },
        {
          icon: Eye,
          title: t('blockedUsers', 'Blocked Users'),
          subtitle: t('blockedUsersDesc', 'Manage blocked accounts'),
          onClick: () => navigate('/BlockedUsers')
        }
      ]
    }
  ];

  const toggleItems = [
    {
      icon: settings.darkMode ? Moon : Sun,
      title: t('darkMode', 'Dark Mode'),
      subtitle: t('darkModeDesc', 'Use dark theme'),
      value: settings.darkMode,
      onChange: (value) => updateSetting('darkMode', value)
    },
    {
      icon: MapPin,
      title: t('autoLocation', 'Auto-detect Location'),
      subtitle: t('autoLocationDesc', 'Automatically find your location'),
      value: settings.autoLocation,
      onChange: (value) => updateSetting('autoLocation', value)
    },
    {
      icon: Shield,
      title: t('allergenWarnings', 'Allergen Warnings'),
      subtitle: t('allergenWarningsDesc', 'Show allergen alerts'),
      value: settings.allergenWarnings,
      onChange: (value) => updateSetting('allergenWarnings', value)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('accountSettings', 'Account Settings')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <SettingItem key={itemIndex} {...item} />
              ))}
            </div>
          </div>
        ))}

        {/* Quick Toggles */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('quickSettings', 'Quick Settings')}</h2>
          <div className="space-y-2">
            {toggleItems.map((item, index) => (
              <ToggleItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('account', 'Account')}</h2>
          <div className="space-y-2">
            <SettingItem
              icon={Shield}
              title={t('paymentMethods', 'Payment Methods')}
              subtitle={t('paymentMethodsDesc', 'Manage cards and payment')}
              onClick={() => navigate('/PaymentMethod')}
            />
            <SettingItem
              icon={User}
              title={t('accountData', 'Download My Data')}
              subtitle={t('accountDataDesc', 'Export your account data')}
              onClick={() => showToast(t('featureComingSoon', 'Feature coming soon'), 'info')}
            />
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">{t('deleteAccount', 'Delete Account')}</h3>
                  <p className="text-sm text-red-600">{t('deleteAccountDesc', 'Permanently delete your account')}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => showToast(t('contactSupport', 'Please contact support'), 'info')}
              >
                {t('delete', 'Delete')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}