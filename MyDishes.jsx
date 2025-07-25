import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dish } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";
import OptimizedImage from "../components/dd_OptimizedImage";

const DishItem = ({ dish, onEdit, onDelete, onToggleStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <OptimizedImage
          src={dish.photo_url}
          thumbSrc={dish.thumb_url}
          alt={dish.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{dish.name}</h3>
              <p className="text-sm text-gray-600 mt-1">${dish.price} • {dish.quantity} available</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dish.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {dish.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">
                  Created {new Date(dish.created_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(dish)}
                className="text-gray-500 hover:text-gray-700"
              >
                {dish.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(dish)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(dish)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{dish.description}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => navigate(createPageUrl(`DishDetails?id=${dish.id}`))}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function MyDishes() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    loadUserAndDishes();
  }, []);

  const loadUserAndDishes = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const allDishes = await Dish.list();
      const userDishes = allDishes.filter(dish => dish.cook_id === userData.id);
      setDishes(userDishes);
      
    } catch (error) {
      console.error("Error loading dishes:", error);
      navigate(createPageUrl('Profile'));
    }
    setIsLoading(false);
  };

  const handleEdit = (dish) => {
    navigate(createPageUrl(`PostDish?edit=${dish.id}`));
  };

  const handleDelete = async (dish) => {
    if (confirm(`Are you sure you want to delete "${dish.name}"?`)) {
      try {
        await Dish.delete(dish.id);
        setDishes(dishes.filter(d => d.id !== dish.id));
        showToast('Dish deleted successfully', 'success');
      } catch (error) {
        console.error("Error deleting dish:", error);
        showToast('Error deleting dish', 'error');
      }
    }
  };

  const handleToggleStatus = async (dish) => {
    try {
      const updatedDish = { ...dish, is_active: !dish.is_active };
      await Dish.update(dish.id, updatedDish);
      setDishes(dishes.map(d => d.id === dish.id ? updatedDish : d));
      showToast(`Dish ${updatedDish.is_active ? 'activated' : 'deactivated'}`, 'success');
    } catch (error) {
      console.error("Error updating dish status:", error);
      showToast('Error updating dish status', 'error');
    }
  };

  const filteredDishes = dishes.filter(dish => 
    activeTab === 'active' ? dish.is_active : !dish.is_active
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">My Dishes</h1>
          </div>
          <Button
            onClick={() => navigate(createPageUrl('PostDish'))}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Dish
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <Button
            onClick={() => setActiveTab('active')}
            className={`flex-1 ${activeTab === 'active' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
          >
            Active ({dishes.filter(d => d.is_active).length})
          </Button>
          <Button
            onClick={() => setActiveTab('inactive')}
            className={`flex-1 ${activeTab === 'inactive' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
          >
            Inactive ({dishes.filter(d => !d.is_active).length})
          </Button>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} dishes
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'active' 
                ? "You don't have any active dishes. Create your first listing!"
                : "No inactive dishes found."
              }
            </p>
            <Button
              onClick={() => navigate(createPageUrl('PostDish'))}
              className="bg-red-500 hover:bg-red-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Dish
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDishes.map((dish) => (
              <DishItem
                key={dish.id}
                dish={dish}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}