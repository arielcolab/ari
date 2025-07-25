import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";

const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
      checked ? 'bg-red-500' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`${
        checked ? 'translate-x-6' : 'translate-x-1'
      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
    />
  </button>
);

const NotificationSection = ({ icon: Icon, title, description, settings, onToggle }) => (
  <div className="bg-white rounded-xl p-4 space-y-4">
    <div className="flex items-start gap-3">
      <div className="bg-gray-100 p-2 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
    
    <div className="space-y-3 pl-11">
      {settings.map((setting) => (
        <div key={setting.key} className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-gray-700">{setting.label}</Label>
            {setting.description && (
              <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
            )}
          </div>
          <ToggleSwitch
            checked={setting.enabled}
            onChange={(checked) => onToggle(setting.key, checked)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Order notifications
    order_updates_push: true,
    order_updates_email: true,
    order_delivery_push: true,
    order_delivery_email: false,
    
    // Social notifications
    new_messages_push: true,
    new_messages_email: true,
    new_followers_push: true,
    new_followers_email: false,
    
    // Marketplace notifications
    item_expiry_push: true,
    item_expiry_email: true,
    nearby_items_push: false,
    nearby_items_email: false,
    
    // Event notifications
    event_reminders_push: true,
    event_reminders_email: true,
    new_events_push: false,
    new_events_email: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      // Load notification settings from user data
      if (user.notification_settings) {
        setSettings({ ...settings, ...user.notification_settings });
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
    setIsLoading(false);
  };

  const handleToggle = (key, enabled) => {
    setSettings(prev => ({ ...prev, [key]: enabled }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({
        notification_settings: settings
      });
      showToast('Notification settings updated!', 'success');
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast('Error saving settings. Please try again.', 'error');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('notifications')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <NotificationSection
          icon={Bell}
          title="Orders & Delivery"
          description="Stay updated on your order status and delivery notifications"
          settings={[
            {
              key: 'order_updates_push',
              label: 'Order updates (Push)',
              description: 'Order confirmed, preparing, ready for pickup',
              enabled: settings.order_updates_push
            },
            {
              key: 'order_updates_email',
              label: 'Order updates (Email)',
              description: 'Order confirmations and status changes',
              enabled: settings.order_updates_email
            },
            {
              key: 'order_delivery_push',
              label: 'Delivery notifications (Push)',
              description: 'When your order is out for delivery',
              enabled: settings.order_delivery_push
            },
            {
              key: 'order_delivery_email',
              label: 'Delivery notifications (Email)',
              enabled: settings.order_delivery_email
            }
          ]}
          onToggle={handleToggle}
        />

        <NotificationSection
          icon={Smartphone}
          title="Social & Messaging"
          description="Notifications about messages and social interactions"
          settings={[
            {
              key: 'new_messages_push',
              label: 'New messages (Push)',
              description: 'When someone sends you a message',
              enabled: settings.new_messages_push
            },
            {
              key: 'new_messages_email',
              label: 'New messages (Email)',
              enabled: settings.new_messages_email
            },
            {
              key: 'new_followers_push',
              label: 'New followers (Push)',
              description: 'When someone follows your cooking',
              enabled: settings.new_followers_push
            },
            {
              key: 'new_followers_email',
              label: 'New followers (Email)',
              enabled: settings.new_followers_email
            }
          ]}
          onToggle={handleToggle}
        />

        <NotificationSection
          icon={Mail}
          title="Marketplace & Items"
          description="Notifications about your listings and nearby items"
          settings={[
            {
              key: 'item_expiry_push',
              label: 'Item expiry warnings (Push)',
              description: 'When your posted items are about to expire',
              enabled: settings.item_expiry_push
            },
            {
              key: 'item_expiry_email',
              label: 'Item expiry warnings (Email)',
              enabled: settings.item_expiry_email
            },
            {
              key: 'nearby_items_push',
              label: 'Nearby items (Push)',
              description: 'When new items are posted near you',
              enabled: settings.nearby_items_push
            },
            {
              key: 'nearby_items_email',
              label: 'Nearby items (Email)',
              enabled: settings.nearby_items_email
            }
          ]}
          onToggle={handleToggle}
        />

        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}