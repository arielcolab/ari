
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Favorite } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "../components/utils/translations";

const CookItem = ({ cook }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4 py-3">
      <img src={cook.cook_photo} alt={cook.cook_name} className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{cook.cook_name}</h3>
        <p className="text-sm text-gray-500">{cook.cook_dish_count} {t('dishes')}</p>
      </div>
    </div>
  );
};

export default function FavoriteCooks() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const mockFavorites = [
    { id: 1, cook_name: 'Chef Isabella', cook_dish_count: 12, cook_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
    { id: 2, cook_name: 'Chef Ethan', cook_dish_count: 8, cook_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { id: 3, cook_name: 'Chef Olivia', cook_dish_count: 15, cook_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
  ];
  
  useEffect(() => {
    // In a real app, you would fetch this with Favorite.list()
    setFavorites(mockFavorites);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('favoriteCooks')}</h1>
        </div>
      </div>
      
      <div className="p-4 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{t('receiveNotifications')}</h2>
          <div className="bg-white p-4 rounded-xl flex justify-between items-center">
            <div>
              <Label htmlFor="notifications-switch" className="font-medium text-gray-900">{t('notifications')}</Label>
              <p className="text-sm text-gray-500">{t('getNotified')}</p>
            </div>
            <Switch 
              id="notifications-switch" 
              checked={notificationsEnabled} 
              onCheckedChange={setNotificationsEnabled} 
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{t('yourFavoriteCooks')}</h2>
          <div className="bg-white rounded-xl p-4 divide-y divide-gray-100">
            {favorites.length > 0 ? (
              favorites.map(fav => (
                <CookItem 
                  key={fav.id}
                  cook={fav}
                />
              ))
            ) : (
              <p className="py-4 text-center text-gray-500">{t('noFavoriteCooksYet')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
