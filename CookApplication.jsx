import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChefHat, Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { showToast } from '../components/common/ErrorBoundary';

export default function CookApplication() {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBecomeCook = async () => {
    setIsUpdating(true);
    try {
      await User.updateMyUserData({ 
        role: 'cook',
        is_verified_cook: true // Auto-verify for now
      });
      showToast("Congratulations! You are now a cook.", 'success');
      navigate(createPageUrl('Profile'));
    } catch (error) {
      console.error('Failed to update role:', error);
      showToast('Something went wrong. Please try again.', 'error');
    }
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Become a Cook</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto mt-8 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <ChefHat className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Share Your Passion for Cooking</h2>
        <p className="text-gray-600 mb-8">
          Join our community of talented home cooks and chefs. Turn your kitchen into a business and earn money by selling your delicious creations.
        </p>

        <div className="space-y-4 text-left bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Set Your Own Schedule</h3>
              <p className="text-sm text-gray-600">Cook when you want, as much as you want.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Reach New Customers</h3>
              <p className="text-sm text-gray-600">We connect you with hungry neighbors in your community.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Simple & Secure Payments</h3>
              <p className="text-sm text-gray-600">Get paid securely for every order, directly to your bank account.</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleBecomeCook} 
          disabled={isUpdating}
          className="w-full bg-red-500 hover:bg-red-600 h-12 mt-8 text-lg"
        >
          {isUpdating ? 'Setting up...' : 'Start Selling'}
        </Button>
      </div>
    </div>
  );
}