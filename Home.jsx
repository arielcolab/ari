
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../components/utils/translations";
import FeatureTile from "../components/home/FeatureTile";
import NewHeroHeader from "../components/home/NewHeroHeader";
import FilterModal from '../components/common/FilterModal';
import { LoadingOverlay, SkeletonList } from '../components/common/LoadingStates';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const tileImages = {
    marketplace: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8e0df44c0_ChatGPTImageJul23202509_03_28PM.png",
    mealPrep: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c38dcf426_CAA97D7B-18F4-47CC-A09C-3E676F516970.png",
    restaurants: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8c94de69b_4BD4D63D-F360-4190-AB23-1C5521839072.png",
    classes: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6dacf1125_ChatGPTImageJul23202508_33_39PM.png",
    lastCallEats: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/09e00a029_70D9B879-B736-B353E8BC0EB7.png",
    surplusGroceries: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ea132f1db_88CD1D1C-D011-4C8E-A3B6-CA422EF05808.png",
    leftovers: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/01192dbee_ChatGPTImageJul23202509_04_39PM.png",
    giveaways: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cdcb0fa3d_E324F138-B7FA-4517-9547-90E233E703C5.png"
  };

  const handleApplyFilters = (filters) => {
    const count = Object.values(filters).filter(v => v !== null && (!Array.isArray(v) || v.length > 0)).length;
    setActiveFilterCount(count);
  };
  
  // Reorganized by revenue priority - highest revenue generators first
  const featureTiles = [
    // TOP ROW - Highest Revenue (Large tiles for maximum visibility)
    { 
      image: tileImages.restaurants, 
      title: t('restaurants', 'Restaurants'), 
      route: 'Restaurants', 
      size: 'large',
      badge: t('badgeHighRevenue', '💰 High Revenue')
    },
    { 
      image: tileImages.mealPrep, 
      title: t('weeklyMealPrep'), 
      route: 'MealPrep', 
      size: 'large',
      badge: t('badgePremium', '💎 Premium')
    },
    
    // SECOND ROW - Medium-High Revenue
    { 
      image: tileImages.marketplace, 
      title: t('marketplace'), 
      route: 'ChefsMarketplace',
      badge: t('badgePopular', '🔥 Popular')
    },
    { 
      image: tileImages.classes, 
      title: t('cookingClasses'), 
      route: 'CookingClasses',
      badge: t('badgeHighValue', '💰 High Value')
    },
    
    // THIRD ROW - Medium Revenue
    { 
      image: tileImages.lastCallEats, 
      title: t('lastCallEats'), 
      route: 'LastCallEats',
      badge: t('badgeQuickSales', '⚡ Quick Sales')
    },
    { 
      image: tileImages.surplusGroceries, 
      title: t('surplusGroceries'), 
      route: 'SurplusGroceries',
      badge: t('badgeVolume', '📦 Volume')
    },
    
    // BOTTOM ROW - Lower Revenue (but important for user engagement)
    { 
      image: tileImages.leftovers, 
      title: t('leftoversNearYou'), 
      route: 'LeftoversMarket'
    },
    { 
      image: tileImages.giveaways, 
      title: t('giveaways'), 
      route: 'Giveaways',
      badge: t('badgeCommunity', '❤️ Community')
    }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* GlobalHeader is now in Layout.js - no duplicate header */}
        
        <div className="px-4 pt-4 pb-20">
          <NewHeroHeader />

          <LoadingOverlay isLoading={isLoading}>
            {/* Revenue-Optimized Layout */}
            <div className="space-y-3 mt-6">
              {/* TOP PRIORITY: Restaurants & Meal Prep (Large tiles) */}
              <div className="grid grid-cols-2 gap-3">
                {featureTiles.slice(0, 2).map((tile, index) => (
                  <FeatureTile key={index} {...tile} className="aspect-square" />
                ))}
              </div>
              
              {/* HIGH PRIORITY: Marketplace & Classes */}
              <div className="grid grid-cols-2 gap-3">
                {featureTiles.slice(2, 4).map((tile, index) => (
                  <FeatureTile key={index + 2} {...tile} />
                ))}
              </div>
              
              {/* MEDIUM PRIORITY: Last Call & Surplus */}
              <div className="grid grid-cols-2 gap-3">
                {featureTiles.slice(4, 6).map((tile, index) => (
                  <FeatureTile key={index + 4} {...tile} />
                ))}
              </div>
              
              {/* LOWER PRIORITY: Leftovers & Giveaways */}
              <div className="grid grid-cols-2 gap-3">
                {featureTiles.slice(6).map((tile, index) => (
                  <FeatureTile key={index + 6} {...tile} />
                ))}
              </div>
            </div>
          </LoadingOverlay>
        </div>
        
        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          initialFilters={{}}
          filterOptions={[]}
        />
      </div>
    </ErrorBoundary>
  );
}
