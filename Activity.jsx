import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { useTranslation } from "../components/utils/translations";

const ActivityItem = ({ activity }) => {
  const { t } = useTranslation();
  
  const getTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "1h";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <div className="flex items-start gap-4 py-4">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={activity.icon_url || "https://images.unsplash.com/photo-1494790108755-2616b612b120"}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500 mt-1">{getTimeAgo(activity.created_date)}</p>
      </div>
    </div>
  );
};

export default function ActivityPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      // Mock activity data
      const mockActivities = [
        {
          id: '1',
          title: `${t('newDishFrom')} @chef_emily`,
          created_date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          icon_url: "https://images.unsplash.com/photo-1494790108755-2616b612b120",
          activity_type: 'new_dish'
        },
        {
          id: '2', 
          title: `${t('trendingDish')} @chef_david's pasta`,
          created_date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          icon_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          activity_type: 'trending_dish'
        },
        {
          id: '3',
          title: `${t('platformAnnouncement')} ${t('newFeature')}`,
          created_date: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          icon_url: null,
          activity_type: 'platform_announcement'
        },
        {
          id: '4',
          title: `${t('newDishFrom')} @chef_sophia`,
          created_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          icon_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
          activity_type: 'new_dish'
        },
        {
          id: '5',
          title: `${t('trendingDish')} @chef_mark's pizza`,
          created_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          icon_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
          activity_type: 'trending_dish'
        }
      ];
      setActivities(mockActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
    setIsLoading(false);
  };

  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.created_date);
    const today = new Date();
    return activityDate.toDateString() === today.toDateString();
  });

  const yesterdayActivities = activities.filter(a => {
    const activityDate = new Date(a.created_date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return activityDate.toDateString() === yesterday.toDateString();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">{t('activity')}</h1>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4">
        {/* Today Section */}
        {todayActivities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('today')}</h2>
            <div className="bg-white rounded-xl p-4 divide-y divide-gray-100">
              {todayActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* Yesterday Section */}
        {yesterdayActivities.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('yesterday')}</h2>
            <div className="bg-white rounded-xl p-4 divide-y divide-gray-100">
              {yesterdayActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}