
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Restaurant } from '@/api/entities';
import { useTranslation } from '@/components/utils/translations';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import FilterModal from '@/components/common/FilterModal';
import { useHeader } from '@/components/common/HeaderContext';
import { useDataFetching } from '@/components/utils/useDataFetching';
import { SkeletonList } from '@/components/common/LoadingStates';
import { AlertCircle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryFilter = ({ icon, title, subtitle, selected, onClick }) => (
  <div
    className={`flex-1 flex flex-col items-center justify-center text-center p-2 rounded-xl cursor-pointer transition-all duration-200 ${selected ? 'bg-red-500 text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}
    onClick={onClick}
  >
    <div className={`text-3xl mb-1 ${selected ? 'text-white' : 'text-red-500'}`}>{icon}</div>
    <p className="font-semibold text-sm">{title}</p>
    <p className={`text-xs ${selected ? 'text-red-100' : 'text-gray-500'}`}>{subtitle}</p>
  </div>
);

const SkeletonCategoryFilter = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-2 rounded-xl bg-gray-100 animate-pulse">
    <div className="text-3xl mb-1 w-8 h-8 bg-gray-200 rounded-full"></div>
    <p className="font-semibold text-sm h-4 w-16 bg-gray-200 rounded-full mt-1"></p>
    <p className="text-xs h-3 w-12 bg-gray-200 rounded-full mt-1"></p>
  </div>
);

export default function RestaurantsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // CRITICAL: Initialize state variables first, before any hooks
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  
  // Stable fetcher function
  const fetchRestaurants = useCallback(() => Restaurant.list('-rating_average', 100), []);
  
  // NEW STANDARD: Use centralized data fetching hook
  const { data: restaurants, isLoading, error, refetch } = useDataFetching(
    fetchRestaurants, 
    { cacheKey: 'restaurants_list' }
  );
  
  const { setHeaderControls } = useHeader();
  
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v != null && v !== '' && (!Array.isArray(v) || v.length > 0)).length;
  }, [filters]);

  const categories = useMemo(() => [
    { key: 'all', icon: 'All', title: t('all', 'All'), subtitle: t('allRestaurants', 'All restaurants') },
    { key: 'pizza', icon: '🍕', title: t('pizza', 'Pizza'), subtitle: t('italian', 'Italian') },
    { key: 'burgers', icon: '🍔', title: t('burgers', 'Burgers'), subtitle: t('american', 'American') },
    { key: 'sushi', icon: '🍣', title: t('sushi', 'Sushi'), subtitle: t('japanese', 'Japanese') },
    { key: 'healthy', icon: '🥗', title: t('healthy', 'Healthy'), subtitle: t('salads', 'Salads') }
  ], [t]);
  
  const filterOptions = useMemo(() => [
    { key: 'deliveryFee', label: 'deliveryFee', type: 'single', values: [{value: '0', label: 'freeDelivery'}, {value: '0-5', label: 'under_5'}, {value: '5-10', label: 'under_10'}]},
    { key: 'rating', label: 'rating', type: 'single', values: [{value: '4.5', label: '4.5_stars_and_up'}, {value: '4', label: '4_stars_and_up'}]},
    { key: 'deliveryTime', label: 'deliveryTime', type: 'single', values: [{value: '0-30', label: 'under30min'}, {value: '0-45', label: 'under45min'}]}
  ], []);

  useEffect(() => {
    setHeaderControls({
      onFilterClick: () => setShowFilters(true),
      activeFilterCount: activeFilterCount,
    });
    return () => setHeaderControls({});
  }, [setHeaderControls, activeFilterCount]);

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleRestaurantClick = (restaurantId) => {
    if (restaurantId) {
      navigate(createPageUrl(`RestaurantDetails?id=${restaurantId}`));
    }
  };

  const filteredAndSortedRestaurants = useMemo(() => {
    // CRITICAL: Safe array handling - check for data existence
    if (!restaurants || !Array.isArray(restaurants)) return [];
    
    let items = [...restaurants];
    
    if (activeCategory !== 'all') {
      items = items.filter(restaurant => restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(activeCategory));
    }
    
    if (filters.deliveryFee) {
      if (filters.deliveryFee === '0') {
        items = items.filter(item => item.delivery_fee === 0);
      } else {
        const [min, max] = filters.deliveryFee.split('-').map(Number);
        items = items.filter(item => item.delivery_fee >= min && item.delivery_fee <= max);
      }
    }
    if (filters.rating) {
      items = items.filter(item => item.rating_average >= parseFloat(filters.rating));
    }
    if (filters.deliveryTime) {
      const [min, max] = filters.deliveryTime.split('-').map(Number);
      items = items.filter(item => item.delivery_time_minutes >= min && item.delivery_time_minutes <= max);
    }
    
    return items;
  }, [restaurants, activeCategory, filters]);
  
  const renderContent = () => {
    // SAFE RENDERING: Handle all states properly
    if (isLoading) {
      return (
        <div>
          <div className="text-center mb-6">
            <div className="h-7 w-48 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-full mx-auto mt-2 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => <SkeletonCategoryFilter key={i} />)}
          </div>
          <SkeletonList count={6} />
        </div>
      );
    }
    
    if (error) {
      const isNetworkError = error.message.includes('network');
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 mt-10">
          {isNetworkError ? <WifiOff className="w-12 h-12 text-gray-400 mb-4" /> : <AlertCircle className="w-12 h-12 text-red-400 mb-4" />}
          <h3 className="text-lg font-semibold text-gray-800">
            {isNetworkError ? t('networkError', 'Connection Error') : t('error_loading_restaurants', 'Error loading restaurants')}
          </h3>
          <p className="text-gray-500 my-2">
            {isNetworkError ? t('networkErrorDescription', 'Please check your internet connection and try again.') : t('please_try_again_later', 'Please try again later.')}
          </p>
          <Button onClick={refetch}>{t('retry', 'Try Again')}</Button>
        </div>
      );
    }
    
    // CRITICAL: Safe length check
    if (!filteredAndSortedRestaurants || filteredAndSortedRestaurants.length === 0) {
      return (
        <div className="text-center py-10">
          <p>{t('no_restaurants_found', 'No restaurants match your criteria.')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedRestaurants.map(restaurant => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            onClick={() => handleRestaurantClick(restaurant.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 pb-20">
        {!isLoading && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{t('restaurants', 'Restaurants')}</h1>
              <p className="text-gray-600 mt-1">{t('fastestDelivery', 'Order from your favorite restaurants')}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {categories.map(cat => (
                <CategoryFilter 
                  key={cat.key} 
                  {...cat}
                  selected={activeCategory === cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                />
              ))}
            </div>
          </>
        )}
        
        {renderContent()}
      </div>

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
        filterOptions={filterOptions}
      />
    </div>
  );
}
