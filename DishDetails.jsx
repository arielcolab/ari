import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dish } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Share2, Star, Clock, Users, Flame, Tag, Shield, Info, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import OptimizedImage from '../components/dd_OptimizedImage';
import { PriceDisplay } from '../components/utils/dd_currency';
import RatingDisplay from '../components/reviews/RatingDisplay';
import { cartStore } from '../components/stores/CartStore';
import { showToast } from '../components/common/ErrorBoundary';
import { ShareModal } from '../components/dd_WhatsAppShare';
import QuickAddToCart from '../components/common/QuickAddToCart';

const InfoPill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-800">
    <Icon className="w-4 h-4 text-gray-600" />
    <span>{text}</span>
  </div>
);

const AllergenNotice = ({ allergens }) => {
  const { t } = useTranslation();
  if (!allergens || allergens.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
        <div>
          <h4 className="font-semibold text-yellow-800">{t('allergens', 'Allergens')}</h4>
          <p className="text-sm text-yellow-700">{allergens.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default function DishDetails() {
  const [searchParams] = useSearchParams();
  const dishId = searchParams.get('id');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [dish, setDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const loadDish = async () => {
      if (dishId) {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedDish = await Dish.get(dishId);
          setDish(fetchedDish);
        } catch (error) {
          console.error('Failed to load dish details:', error);
          setError(t('dishNotFound', 'Dish not found'));
        } finally {
          setIsLoading(false);
        }
      } else {
        setError(t('noDishId', 'No dish specified'));
        setIsLoading(false);
      }
    };
    loadDish();
  }, [dishId, t]);

  if (isLoading) {
    return <div>{t('loading', 'Loading...')}</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">{error}</div>
    );
  }
  
  if (!dish) {
    return <div>{t('dishNotFound', 'Dish not found')}</div>;
  }

  const handleAddToCart = () => {
    cartStore.addItem(dish, 1, 'dish');
    showToast(t('addedToCartToast', `Added ${dish.name} to cart!`), 'success');
  };
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => {/* Handle favorite */}}>
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Image */}
      <div className="relative">
        <OptimizedImage
          src={dish.photo_url}
          alt={dish.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h1 className="text-2xl font-bold text-white shadow-lg">{dish.name}</h1>
          <p className="text-sm text-gray-200 mt-1">by {dish.cook_name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <PriceDisplay price={dish.price} className="text-2xl font-bold text-red-600" />
          <RatingDisplay rating={dish.rating_average || 0} count={dish.rating_count || 0} />
        </div>
        
        {/* Info Pills */}
        <div className="flex flex-wrap gap-2">
          <InfoPill icon={Users} text={`${dish.servings} ${t('servingsUnit', 'servings')}`} />
          <InfoPill icon={Flame} text={t(dish.condition, dish.condition)} />
          {dish.diet_tags?.map(tag => (
            <InfoPill key={tag} icon={Tag} text={t(tag, tag)} />
          ))}
        </div>
        
        {/* Description */}
        <div>
          <h3 className="font-bold text-lg mb-2">{t('description', 'Description')}</h3>
          <p className="text-gray-700">{dish.description}</p>
        </div>

        {/* Reheating Instructions */}
        {dish.reheating_instructions && (
          <div>
            <h3 className="font-bold text-lg mb-2">{t('reheatingInstructions', 'Reheating Instructions')}</h3>
            <p className="text-gray-700">{dish.reheating_instructions}</p>
          </div>
        )}

        {/* Allergen Notice */}
        <AllergenNotice allergens={dish.allergen_list} />
        
        {/* Cook Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">{dish.cook_name}</p>
            <p className="text-sm text-blue-600 cursor-pointer">{t('viewProfile', 'View Profile')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><Phone className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><MessageSquare className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 border-t border-gray-100">
        <QuickAddToCart item={dish} itemType="dish" />
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={shareUrl}
        title={`Check out this dish: ${dish.name}!`}
      />
    </div>
  );
}