import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  User,
  Lock,
  Bell,
  Shield,
  Globe,
  Settings as SettingsIcon,
  ChevronRight
} from "lucide-react";

const SettingsMenuItem = ({ icon: Icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors">
    <div className="bg-gray-100 p-3 rounded-lg mr-4">
      <Icon className="w-6 h-6 text-[#1b140d]" />
    </div>
    <div className="flex-1 text-left">
      <div className="font-semibold text-[#1b140d]">{title}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);

export default function Settings() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, title: 'Account details', subtitle: 'Manage your personal information', onClick: () => {} },
        { icon: Lock, title: 'Password', subtitle: 'Change your password', onClick: () => {} },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, title: 'Notifications', subtitle: 'Manage your notification preferences', onClick: () => {} },
      ]
    },
    {
      title: 'Privacy',
      items: [
        { icon: Shield, title: 'Privacy', subtitle: 'Manage your privacy settings', onClick: () => {} },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: Globe, title: 'Language', subtitle: 'Select your preferred language', onClick: () => {} },
        { icon: SettingsIcon, title: 'App settings', subtitle: 'Manage app-specific settings', onClick: () => {} },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf8] pb-20">
       {/* Header */}
       <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-[#1b140d]">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {sections.map(section => (
          <div key={section.title}>
            <h2 className="text-2xl font-bold text-[#1b140d] mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <SettingsMenuItem 
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  onClick={item.onClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}