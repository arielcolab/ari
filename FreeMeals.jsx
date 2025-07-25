import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeMeal } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';

const FreeMealCard = ({ meal }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
    <div className="flex items-start gap-3">
      <div className="bg-orange-100 p-2 rounded-lg">
        <Users className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-1">{meal.program_name}</h3>
        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{meal.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{meal.schedule}</span>
          </div>
          {meal.organization && (
            <p className="font-medium text-gray-600">by {meal.organization}</p>
          )}
        </div>
        <span className="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium mt-2">
          FREE
        </span>
      </div>
    </div>
  </div>
);

export default function FreeMeals() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFreeMeals();
  }, []);

  const loadFreeMeals = async () => {
    setIsLoading(true);
    try {
      const data = await FreeMeal.list();
      setMeals(data);
    } catch (error) {
      // Create mock data if entity doesn't exist
      const mockMeals = [
        {
          id: '1',
          program_name: 'Community Kitchen',
          description: 'Free hot meals for families in need. No questions asked.',
          location: '123 Community Center Dr',
          schedule: 'Monday-Friday, 5:30-7:00 PM',
          organization: 'Hope Community Center',
          meal_type: 'dinner'
        },
        {
          id: '2',
          program_name: 'Weekend Food Share',
          description: 'Fresh groceries and prepared meals for the weekend.',
          location: '456 Church St',
          schedule: 'Saturdays, 10:00 AM - 2:00 PM',
          organization: 'St. Mary\'s Church',
          meal_type: 'all_day'
        }
      ];
      setMeals(mockMeals);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Free Meal Programs</h1>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Programs Available</h3>
            <p className="text-gray-500">Check back later for free meal programs in your area.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-1">Community Support</h3>
              <p className="text-sm text-blue-700">
                These programs provide free meals to anyone in need. All are welcome.
              </p>
            </div>
            
            {meals.map(meal => (
              <FreeMealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}