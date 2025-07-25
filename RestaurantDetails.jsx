import React, { useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Restaurant } from '@/api/entities';
import { Dish } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Clock, DollarSign, MapPin, WifiOff, AlertCircle, 
  Search, Heart, Check, Star, Users, Share2, ChevronDown, Plus 
} from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import OptimizedImage from '../components/dd_OptimizedImage';
import DishListItem from '../components/dishes/DishListItem';
import { useDataFetching } from '../components/utils/useDataFetching';

// Helper component for displaying prices
const PriceDisplay = ({ price, className = '' }) => {
  if (typeof price !== 'number') return null; // Handle cases where price might not be a number
  const formattedPrice = price.toFixed(2);
  return <span className={className}>{price === 0 ? 'Free' : `₪${formattedPrice}`}</span>;
};

// Mock restaurant data for fallback
const getMockRestaurant = (restaurantId) => ({
  id: restaurantId,
  name: "Domino's Pizza | Florentin",
  image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&auto=format&fit=crop",
  cuisine: "Pizza",
  rating_average: 6.4,
  rating_count: 128,
  delivery_fee: 0,
  delivery_time_minutes: 35,
  address: "Florentin District, Tel Aviv",
  is_open: true,
  hours: "Open until 12:00 AM",
  min_order: 50.00,
  service_fee_range: "₪1.00-₪5.90",
  delivery_by: "restaurant",
  promotion: {
    title: "Get 2 months 50% off Wolt+",
    subtitle: "Start saving now! 😋",
    badge: "Limited time"
  }
});

const mockMenuItems = [
  { id: '1', name: 'Pizza Margherita', photo_url: 'https://images.unsplash.com/photo-1593560704563-ef5a38a7c152?w=400&auto=format&fit=crop', price: 75.00 },
  { id: '2', name: 'Garlic Bread', photo_url: 'https://images.unsplash.com/photo-1627409249826-6a9b4d8d17f8?w=400&auto=format&fit=crop', price: 25.00 },
  { id: '3', name: 'Coke Zero', photo_url: 'https://images.unsplash.com/photo-1550974372-520e5e6e3d23?w=400&auto=format&fit=crop', price: 12.40 },
  { id: '4', name: 'Chicken Wings', photo_url: 'https://images.unsplash.com/photo-1559814421-e0c1b4b1a4c9?w=400&auto=format&fit=crop', price: 45.00 },
];

const RestaurantDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 animate-pulse">
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4 -mt-10 relative">
                <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="h-8 w-3/4 bg-gray-200 rounded-full mb-3" />
                    <div className="h-5 w-1/2 bg-gray-200 rounded-full mb-4" />
                    <div className="h-5 w-1/4 bg-gray-200 rounded-full" />
                </div>
            </div>
            <div className="px-4">
                <div className="flex flex-wrap gap-2 mb-6">
                    <div className="h-8 w-24 bg-gray-100 rounded-full" />
                    <div className="h-8 w-32 bg-gray-100 rounded-full" />
                </div>
                <div className="mb-6">
                    <div className="h-6 w-1/3 bg-gray-200 rounded-full mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded-full" />
                </div>
            </div>
            <div className="px-4">
                <div className="h-6 w-1/4 bg-gray-200 rounded-full mb-4" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-5 w-full bg-gray-200 rounded-full" />
                                    <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
                                    <div className="h-6 w-1/3 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function RestaurantDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('id');

  // CRITICAL: If restaurantId is missing from the URL, navigate back immediately
  useEffect(() => {
    if (!restaurantId) {
      navigate(-1);
    }
  }, [restaurantId, navigate]);

  // Stable fetcher function to prevent infinite loops
  const fetchRestaurantDetails = useCallback(async () => {
    // Double-check restaurantId exists before making API call
    if (!restaurantId) {
      return null;
    }
    
    try {
      // Fetch restaurant and dishes in parallel for efficiency
      const [restaurantData, allDishes] = await Promise.all([
          Restaurant.get(restaurantId),
          Dish.list() // NOTE: This is inefficient. Ideally, dishes would be linked to restaurants.
      ]);
      
      // For now, we replicate the original placeholder logic of showing the first 5 dishes.
      const restaurantDishes = allDishes ? allDishes.slice(0, 5) : [];

      return { restaurant: restaurantData, dishes: restaurantDishes };
    } catch (error) {
      console.log('Failed to fetch restaurant details:', error);
      // Return mock data on any error (including rate limits)
      return {
        restaurant: getMockRestaurant(restaurantId),
        dishes: mockMenuItems
      };
    }
  }, [restaurantId]); // Only depends on restaurantId for the fetch operation

  // Robust data fetching with caching and error recovery
  const { data, loading, error, retry } = useDataFetching(fetchRestaurantDetails, {
      cacheKey: `restaurant_details_${restaurantId}`,
      // CRITICAL: Only enable fetching if restaurantId is present
      enabled: !!restaurantId
  });

  // Safely destructure data, providing fallback values to prevent null errors
  const { restaurant, dishes } = data || { restaurant: null, dishes: [] };

  // Early return if no restaurantId - this prevents any rendering before redirect
  if (!restaurantId) {
    return null;
  }

  if (loading) {
    return <RestaurantDetailsSkeleton />;
  }

  // Handle error cases or if restaurant data is not found/loaded
  if (error && !restaurant) {
    const isNetworkError = error?.message?.includes('network') || error?.message?.includes('429') || error?.message?.includes('Rate limit');
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        {isNetworkError ? <WifiOff className="w-12 h-12 text-gray-400 mb-4" /> : <AlertCircle className="w-12 h-12 text-red-400 mb-4" />}
        <h2 className="text-xl font-semibold">
          {isNetworkError ? t('networkError', 'Connection Error') : t('restaurantNotFound', 'Restaurant not found')}
        </h2>
        <p className="text-gray-500 my-2">
          {isNetworkError ? 
            t('networkErrorDescription', 'Please check your internet connection and try again.') : 
            t('failedToLoadDetails', 'Failed to load restaurant details')
          }
        </p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>{t('back', 'Back')}</Button>
          <Button onClick={retry}>{t('retry', 'Retry')}</Button>
        </div>
      </div>
    );
  }

  // Use mock data if restaurant is still null
  const displayRestaurant = restaurant || getMockRestaurant(restaurantId);
  const displayDishes = dishes.length > 0 ? dishes : mockMenuItems;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section with Restaurant Image */}
      <div className="relative">
        <OptimizedImage
          src={displayRestaurant.image_url}
          className="w-full h-48 object-cover"
          alt={displayRestaurant.name}
        />
        
        {/* Header Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Restaurant Logo Overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
            {/* Displaying first letter of restaurant name for logo */}
            <span className="text-red-600 font-bold text-lg">{displayRestaurant.name.charAt(0)}</span>
          </div>
        </div>

        {/* Green Check Mark (assuming this indicates open status or something similar) */}
        {displayRestaurant.is_open && (
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 text-white" />
            </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="bg-white p-4 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{displayRestaurant.name}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{displayRestaurant.rating_average?.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>{displayRestaurant.hours}</span>
          <span>•</span>
          <span>Min. order <PriceDisplay price={displayRestaurant.min_order} /></span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span><PriceDisplay price={displayRestaurant.delivery_fee} /> delivery fee</span>
          <span>•</span>
          <span>Service fee up to 5%, {displayRestaurant.service_fee_range}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
          <span>Delivery by {displayRestaurant.delivery_by}</span>
          <span>•</span>
          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm font-semibold">More</Button>
        </div>

        {/* Delivery Time Selector */}
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-blue-600 border-blue-600 rounded-full px-4 py-2 text-base"
          >
            <MapPin className="w-4 h-4" />
            Delivery {displayRestaurant.delivery_time_minutes}-{displayRestaurant.delivery_time_minutes + 10} min
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
            <Users className="w-5 h-5 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
            <Share2 className="w-5 h-5 text-blue-600" />
          </Button>
        </div>

        {/* Promotion Banner */}
        {displayRestaurant.promotion && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {displayRestaurant.promotion.badge}
              </span>
            </div>
            <h3 className="font-bold text-blue-900 mb-1">{displayRestaurant.promotion.title}</h3>
            <p className="text-blue-700 text-sm">{displayRestaurant.promotion.subtitle}</p>
          </div>
        )}
      </div>

      {/* Recently Bought Items */}
      <div className="bg-white p-4 border-b border-gray-100 shadow-sm mt-3">
        <h3 className="font-bold text-lg mb-4">Recently bought items</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayDishes.slice(0, 2).map((item) => (
            <div key={item.id} className="flex-shrink-0 w-48 relative">
              <OptimizedImage
                src={item.photo_url}
                className="w-full h-24 object-cover rounded-lg"
                alt={item.name}
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                ★ POPULAR
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white rounded-full shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <p className="text-gray-900 font-medium mt-2">{item.name}</p>
              <PriceDisplay price={item.price} className="text-gray-700 text-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold mb-4">{t('menu', 'Menu')}</h2>
        {displayDishes && displayDishes.length > 0 ? (
          <div className="space-y-3">
            {displayDishes.map(dish => <DishListItem key={dish.id} dish={dish} />)}
          </div>
        ) : (
          <p className="text-gray-500">{t('noDishesAvailable', 'No dishes available at the moment.')}</p>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
        <Button
          onClick={() => navigate('/EnhancedCheckout')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="bg-white text-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>Show items</span>
          </div>
          <PriceDisplay price={122.40} className="text-white font-bold" />
        </Button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Estimated service fee <PriceDisplay price={5.90} />
        </p>
      </div>
    </div>
  );
}