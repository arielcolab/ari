import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeFoodGiveaway } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin, Clock, Users as UsersIcon, Gift } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { showToast } from '../components/common/ErrorBoundary';
import OptimizedImage from '../components/dd_OptimizedImage';

const FoodGiveawayCard = ({ giveaway, onClaim }) => {
  const { t } = useTranslation();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <div className="flex items-start gap-4">
        <OptimizedImage
          src={giveaway.photo_url}
          alt={giveaway.food_title}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{giveaway.food_title}</h3>
              <p className="text-sm text-gray-600">{giveaway.giver_name}</p>
              {giveaway.is_claimed && (
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {t('claimed')}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600 font-bold">
                <Gift className="w-4 h-4" />
                <span className="text-sm">חינם</span>
              </div>
              <p className="text-xs text-gray-500">{giveaway.quantity} {t('portions')}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{giveaway.description}</p>
          
          <div className="space-y-2 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{giveaway.pickup_location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{t('availableUntil')}: {formatTime(giveaway.available_until)}</span>
            </div>
          </div>
          
          {giveaway.allergens && giveaway.allergens.length > 0 && (
            <div className="flex gap-1 mb-3">
              {giveaway.allergens.map((allergen, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs"
                >
                  {t(allergen)}
                </span>
              ))}
            </div>
          )}
          
          <Button
            onClick={() => onClaim(giveaway)}
            disabled={giveaway.is_claimed}
            className={`w-full ${
              giveaway.is_claimed 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {giveaway.is_claimed ? t('claimed') : t('claimFood')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FreeFood() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [giveaways, setGiveaways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadGiveaways();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // User not logged in
    }
  };

  const loadGiveaways = async () => {
    setIsLoading(true);
    try {
      const allGiveaways = await FreeFoodGiveaway.list('-created_date');
      // Only show active giveaways that haven't expired
      const activeGiveaways = allGiveaways.filter(giveaway => 
        giveaway.is_active && 
        new Date(giveaway.available_until) > new Date()
      );
      setGiveaways(activeGiveaways);
    } catch (error) {
      console.error('Error loading food giveaways:', error);
    }
    setIsLoading(false);
  };

  const handleClaim = async (giveaway) => {
    if (!user) {
      showToast('יש להתחבר כדי לתפוס אוכל', 'error');
      return;
    }

    try {
      await FreeFoodGiveaway.update(giveaway.id, {
        is_claimed: true,
        claimed_by: user.id
      });
      
      showToast('האוכל נתפס בהצלחה! אנא פנה למיקום האיסוף', 'success');
      loadGiveaways(); // Refresh the list
    } catch (error) {
      console.error('Error claiming food:', error);
      showToast('שגיאה בתפיסת האוכל', 'error');
    }
  };

  const filteredGiveaways = giveaways.filter(giveaway =>
    searchTerm === '' ||
    giveaway.food_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giveaway.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giveaway.pickup_location.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{t('freeFood')}</h1>
            <p className="text-sm text-gray-600">אוכל חינם זמין לאיסוף</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="חפש אוכל חינם..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 rounded-xl"
          />
        </div>
      </div>

      <div className="p-4">
        {filteredGiveaways.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">אין אוכל חינם זמין כרגע</h3>
            <p className="text-gray-500">חזור מאוחר יותר או נסה לחפש במילות מפתח אחרות</p>
          </div>
        ) : (
          filteredGiveaways.map((giveaway) => (
            <FoodGiveawayCard 
              key={giveaway.id} 
              giveaway={giveaway} 
              onClaim={handleClaim}
            />
          ))
        )}
      </div>
    </div>
  );
}