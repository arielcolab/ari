import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";

const NotificationItem = ({ icon: Icon, title, subtitle, time, isUnread = false }) => (
  <div className={`flex items-start gap-4 p-4 ${isUnread ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
    <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-[#1b140d] text-sm">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
    </div>
    <div className="text-xs text-gray-500 flex-shrink-0">{time}</div>
  </div>
);

export default function Notifications() {
  const navigate = useNavigate();

  const todayNotifications = [
    {
      id: 1,
      title: "Order Update",
      subtitle: "Your order from The Spice Merchant is on its way!",
      time: "10 min ago",
      icon: Bell,
      isUnread: true
    },
    {
      id: 2,
      title: "New Dish Alert",
      subtitle: "Freshly baked sourdough bread available nearby.",
      time: "30 min ago",
      icon: Bell,
      isUnread: true
    },
    {
      id: 3,
      title: "New Dish Alert",
      subtitle: "Don't miss out on delicious homemade pasta!",
      time: "1 hr ago",
      icon: Bell,
      isUnread: false
    }
  ];

  const yesterdayNotifications = [
    {
      id: 4,
      title: "Order Update",
      subtitle: "Your order from The Spice Merchant has been delivered.",
      time: "Yesterday",
      icon: Bell,
      isUnread: false
    },
    {
      id: 5,
      title: "Order Update",
      subtitle: "Enjoy your meal!",
      time: "Yesterday",
      icon: Bell,
      isUnread: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf8] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-[#1b140d]">Notifications</h1>
      </div>

      <div className="px-4 py-6">
        {/* Today Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1b140d] mb-4">Today</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {todayNotifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem
                  icon={notification.icon}
                  title={notification.title}
                  subtitle={notification.subtitle}
                  time={notification.time}
                  isUnread={notification.isUnread}
                />
                {index < todayNotifications.length - 1 && (
                  <div className="border-b border-gray-100 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Yesterday Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#1b140d] mb-4">Yesterday</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {yesterdayNotifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem
                  icon={notification.icon}
                  title={notification.title}
                  subtitle={notification.subtitle}
                  time={notification.time}
                  isUnread={notification.isUnread}
                />
                {index < yesterdayNotifications.length - 1 && (
                  <div className="border-b border-gray-100 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}