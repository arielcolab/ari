import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dish } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";

const SavedDishCard = ({ dish, onRemove }) => {
  const navigate = useNavigate();
  const mainPhoto = dish.photos?.[0] || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex gap-4 p-4">
        <img
          src={mainPhoto}
          alt={dish.name}
          className="w-20 h-20 rounded-lg object-cover cursor-pointer"
          onClick={() => navigate(createPageUrl(`DishDetails?id=${dish.id}`))}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => navigate(createPageUrl(`DishDetails?id=${dish.id}`))}>
              <h3 className="font-semibold text-gray-900">{dish.name}</h3>
              <p className="text-sm text-gray-600">{dish.cook_name} • ${dish.price}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
            </div>
            <button
              onClick={() => onRemove(dish.id)}
              className="text-red-500 hover:text-red-700 ml-2"
              title="Remove from favorites"
            >
              <Heart className="w-5 h-5 fill-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SavedDishes() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [savedDishes, setSavedDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedDishes();
  }, []);

  const loadSavedDishes = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      if (userData.favorites && userData.favorites.length > 0) {
        const allDishes = await Dish.list();
        const saved = allDishes.filter(dish => userData.favorites.includes(dish.id));
        setSavedDishes(saved);
      } else {
        setSavedDishes([]);
      }
    } catch (error) {
      console.error("Error loading saved dishes:", error);
      // Redirect to login if not authenticated
      navigate(createPageUrl('Profile'));
    }
    setIsLoading(false);
  };

  const handleRemoveFavorite = async (dishId) => {
    if (!user) return;

    try {
      const newFavorites = user.favorites.filter(id => id !== dishId);
      await User.updateMyUserData({ favorites: newFavorites });
      setUser(prev => ({ ...prev, favorites: newFavorites }));
      setSavedDishes(prev => prev.filter(dish => dish.id !== dishId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
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
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('savedDishes')}</h1>
        </div>
      </div>

      <div className="p-4">
        {savedDishes.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved dishes yet</h3>
            <p className="text-gray-500 mb-6">Tap the heart icon on dishes you love to save them here</p>
            <Button
              onClick={() => navigate(createPageUrl('Home'))}
              className="bg-red-500 hover:bg-red-600"
            >
              Discover Dishes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">{savedDishes.length} saved {savedDishes.length === 1 ? 'dish' : 'dishes'}</p>
            {savedDishes.map((dish) => (
              <SavedDishCard
                key={dish.id}
                dish={dish}
                onRemove={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}