import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, EyeOff, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { User as UserEntity } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';

const PrivacyToggle = ({ icon: Icon, title, description, value, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
    <div className="flex items-center gap-3 flex-1">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
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

const PrivacyOption = ({ title, options, value, onChange }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
    <div className="space-y-2">
      {options.map((option) => (
        <div 
          key={option.value}
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            value === option.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange(option.value)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full border-2 ${
              value === option.value ? 'border-red-500 bg-red-500' : 'border-gray-300'
            }`}>
              {value === option.value && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
            </div>
            <div>
              <p className="font-medium text-gray-900">{option.label}</p>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function PrivacySettings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    showActivity: true,
    showFavorites: false,
    showOrders: false
  });

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const userData = await UserEntity.me();
      if (userData.privacy_settings) {
        setSettings(prev => ({ ...prev, ...userData.privacy_settings }));
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      await UserEntity.updateMyUserData({
        privacy_settings: newSettings
      });
      
      showToast(t('privacySettingsUpdated', 'Privacy settings updated'), 'success');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      showToast(t('privacySettingsError', 'Error updating privacy settings'), 'error');
    }
  };

  const profileVisibilityOptions = [
    {
      value: 'public',
      label: t('publicProfile', 'Public'),
      description: t('publicProfileDesc', 'Anyone can see your profile')
    },
    {
      value: 'friends',
      label: t('friendsOnly', 'Friends Only'),
      description: t('friendsOnlyDesc', 'Only people you follow can see your profile')
    },
    {
      value: 'private',
      label: t('privateProfile', 'Private'),
      description: t('privateProfileDesc', 'Only you can see your profile')
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
          <h1 className="text-xl font-semibold text-gray-900">{t('privacySettings', 'Privacy Settings')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Visibility */}
        <PrivacyOption
          title={t('profileVisibility', 'Profile Visibility')}
          options={profileVisibilityOptions}
          value={settings.profileVisibility}
          onChange={(value) => updateSetting('profileVisibility', value)}
        />

        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('contactInformation', 'Contact Information')}</h2>
          <div className="space-y-2">
            <PrivacyToggle
              icon={Mail}
              title={t('showEmail', 'Show Email')}
              description={t('showEmailDesc', 'Let others see your email address')}
              value={settings.showEmail}
              onChange={(value) => updateSetting('showEmail', value)}
            />
            <PrivacyToggle
              icon={Phone}
              title={t('showPhone', 'Show Phone')}
              description={t('showPhoneDesc', 'Let others see your phone number')}
              value={settings.showPhone}
              onChange={(value) => updateSetting('showPhone', value)}
            />
            <PrivacyToggle
              icon={MapPin}
              title={t('showLocation', 'Show Location')}
              description={t('showLocationDesc', 'Let others see your general location')}
              value={settings.showLocation}
              onChange={(value) => updateSetting('showLocation', value)}
            />
          </div>
        </div>

        {/* Activity & Social */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('activitySocial', 'Activity & Social')}</h2>
          <div className="space-y-2">
            <PrivacyToggle
              icon={Users}
              title={t('allowMessages', 'Allow Messages')}
              description={t('allowMessagesDesc', 'Let others send you messages')}
              value={settings.allowMessages}
              onChange={(value) => updateSetting('allowMessages', value)}
            />
            <PrivacyToggle
              icon={Eye}
              title={t('showActivity', 'Show Activity')}
              description={t('showActivityDesc', 'Let others see your recent activity')}
              value={settings.showActivity}
              onChange={(value) => updateSetting('showActivity', value)}
            />
            <PrivacyToggle
              icon={Eye}
              title={t('showFavorites', 'Show Favorites')}
              description={t('showFavoritesDesc', 'Let others see your favorite cooks')}
              value={settings.showFavorites}
              onChange={(value) => updateSetting('showFavorites', value)}
            />
            <PrivacyToggle
              icon={EyeOff}
              title={t('showOrders', 'Show Order History')}
              description={t('showOrdersDesc', 'Let others see your order history')}
              value={settings.showOrders}
              onChange={(value) => updateSetting('showOrders', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}