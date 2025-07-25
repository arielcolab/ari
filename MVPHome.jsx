import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Listing } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';
import OptimizedImage from '../components/dd_OptimizedImage';
import { PriceDisplay } from '../components/utils/dd_currency';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategorySection = ({ category, title, listings, onViewAll }) => {
  const navigate = useNavigate();
  
  const handleListingClick = (listing) => {
    navigate(createPageUrl(`MVPListingDetail?id=${listing.id}`));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-red-600">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto px-4 pb-2">
        {listings.slice(0, 5).map(listing => (
          <div 
            key={listing.id}
            onClick={() => handleListingClick(listing)}
            className="bg-white rounded-xl shadow-sm min-w-[280px] cursor-pointer hover:shadow-md transition-shadow"
          >
            <OptimizedImage
              src={listing.photos?.[0]}
              className="w-full h-32 object-cover rounded-t-xl"
              alt={listing.title}
            />
            <div className="p-3">
              <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
              <p className="text-gray-600 text-xs mt-1">by {listing.seller_name}</p>
              <div className="flex items-center justify-between mt-2">
                <PriceDisplay price={listing.price} className="font-bold text-red-600" />
                <span className="text-xs text-gray-500">{listing.quantity_available} left</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MVPHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listings, setListings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { key: 'home', title: 'Home Leftovers', route: 'MVPCategoryList?category=home' },
    { key: 'chef', title: 'Private Chefs', route: 'MVPCategoryList?category=chef' },
    { key: 'restaurant', title: 'Restaurant Deals', route: 'MVPCategoryList?category=restaurant' },
    { key: 'class', title: 'Cooking Classes', route: 'MVPCategoryList?category=class' },
    { key: 'eat_today', title: 'Eat-It-Today', route: 'MVPCategoryList?category=eat_today' }
  ];

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        // Load listings for all categories
        const categoryListings = {};
        
        for (const category of categories) {
          try {
            const categoryData = await Listing.filter({ 
              category: category.key,
              is_active: true 
            });
            categoryListings[category.key] = categoryData || [];
          } catch (error) {
            console.log(`Error loading ${category.key} listings:`, error);
            categoryListings[category.key] = [];
          }
        }
        
        setListings(categoryListings);
      } catch (error) {
        console.error('Error loading listings:', error);
        setListings({});
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">DishDash MVP</h1>
        <p className="text-red-100">Discover local food from trusted sellers in your city</p>
      </div>

      {/* Category Sections */}
      {categories.map(category => (
        <CategorySection
          key={category.key}
          category={category.key}
          title={category.title}
          listings={listings[category.key] || []}
          onViewAll={() => navigate(createPageUrl(category.route))}
        />
      ))}

      {/* Empty State */}
      {Object.values(listings).every(arr => arr.length === 0) && (
        <div className="text-center py-20 px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-4">Be the first to list food in your area!</p>
          <Button 
            onClick={() => navigate(createPageUrl('MVPSellerOnboarding'))}
            className="bg-red-600 hover:bg-red-700"
          >
            Become a Seller
          </Button>
        </div>
      )}
    </div>
  );
}