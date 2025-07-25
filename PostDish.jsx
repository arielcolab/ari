
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, ChefHat, Pizza, Gift, BookOpen, Users, FileSpreadsheet, Clock, ShoppingBasket, Utensils, Coffee } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';

const PostTypeOption = ({ icon: Icon, title, description, onClick, badge = null, iconBg = "bg-orange-100", iconColor = "text-orange-600" }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 relative"
    >
      {badge && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          {badge}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function PostDish() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const postOptions = [
    {
      icon: Upload,
      title: t('bulkUpload', 'Bulk Upload'),
      description: t('uploadMultipleDishes', 'Upload multiple dishes from a file'),
      route: 'dd_BulkUpload',
      badge: t('new', 'NEW'),
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: ChefHat,
      title: t('marketplace', 'Chefs Marketplace'),
      description: t('sellFreshlyPrepared', 'Sell freshly prepared meals'),
      route: 'PostDishForm?type=chef_dish',
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Utensils,
      title: t('weeklyMealPrep', 'Weekly Meal Prep'),
      description: t('offerWeeklyMealPlans', 'Offer weekly meal plans to customers'),
      route: 'PostMealPrepForm',
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: t('cookingClasses', 'Cooking Classes'),
      description: t('hostCookingEvent', 'Host a cooking class or event'),
      route: 'PostClassForm',
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Clock,
      title: t('lastCallEats', 'Last Call Eats'),
      description: t('offerDiscountedFood', 'Offer food at a discount before it expires'),
      route: 'PostLastCallForm',
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: ShoppingBasket,
      title: t('surplusGroceries', 'Surplus Groceries'),
      description: t('sellSurplusGroceries', 'Sell surplus grocery items'),
      route: 'PostSurplusGroceryForm',
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: Pizza,
      title: t('leftovers', 'Leftovers'),
      description: t('offerDeliciousSurplus', 'Offer your delicious surplus food'),
      route: 'PostDishForm?type=leftovers',
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: Gift,
      title: t('giveaways', 'Giveaways'),
      description: t('offerSurplusFoodFree', 'Offer surplus food for free'),
      route: 'PostGiveawayForm',
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: BookOpen,
      title: t('freeRecipes', 'Free Recipes'),
      description: t('shareCulinaryCreations', 'Share your culinary creations with the community'),
      route: 'PostRecipeForm',
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">{t('createPost', 'Create a Post')}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {postOptions.map((option, index) => (
          <PostTypeOption
            key={index}
            icon={option.icon}
            title={option.title}
            description={option.description}
            badge={option.badge}
            iconBg={option.iconBg}
            iconColor={option.iconColor}
            onClick={() => navigate(createPageUrl(option.route))}
          />
        ))}
      </div>
    </div>
  );
}
