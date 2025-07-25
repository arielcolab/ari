import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Edit3 } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { showToast } from '../components/common/ErrorBoundary';
import OptimizedImage from '../components/dd_OptimizedImage';

export default function OrderRating() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [experience, setExperience] = useState(null);
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');

  // Mock order data
  const orderData = {
    restaurant: "Shawarma Ha'carmel",
    orderId: searchParams.get('orderId') || '12345',
    deliveryPartner: 'Wolt'
  };

  const experiences = [
    { id: 'horrible', emoji: '😠', label: 'Horrible', color: 'text-red-500' },
    { id: 'bad', emoji: '😞', label: 'Bad', color: 'text-orange-500' },
    { id: 'meh', emoji: '😐', label: 'Meh', color: 'text-yellow-500' },
    { id: 'good', emoji: '🙂', label: 'Good', color: 'text-green-500' },
    { id: 'awesome', emoji: '😃', label: 'Awesome', color: 'text-green-600' }
  ];

  const tipAmounts = [0, 5.00, 10.00, 15.00];

  const handleSubmitRating = () => {
    showToast('Thank you for your feedback!', 'success');
    navigate('/Home');
  };

  const handleSkip = () => {
    navigate('/Home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={handleSkip} className="text-blue-500 font-medium">
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {/* App Icon and Restaurant */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Wolt Icon */}
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">Wolt</span>
            </div>
            {/* Restaurant Image */}
            <OptimizedImage
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&auto=format&fit=crop"
              className="w-16 h-16 rounded-full object-cover"
              alt={orderData.restaurant}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{orderData.restaurant}</h2>
        </div>

        {/* Experience Rating */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-2">How was your experience?</h3>
          <p className="text-gray-600 text-center mb-6">Your feedback helps us improve.</p>
          
          <div className="flex justify-center gap-4 mb-6">
            {experiences.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setExperience(exp.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                  experience === exp.id ? 'bg-orange-100 scale-110' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-4xl mb-2">{exp.emoji}</span>
                <span className={`text-sm font-medium ${exp.color}`}>{exp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tip Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-2">Say thanks with a tip</h3>
          <p className="text-gray-600 text-center text-sm mb-6">
            100% of the tip goes to your courier. VAT will be deducted if required by law.
          </p>
          
          <div className="flex gap-3 justify-center mb-4">
            {tipAmounts.map((amount) => (
              <Button
                key={amount}
                variant={tip === amount ? 'default' : 'outline'}
                onClick={() => setTip(amount)}
                className={`px-6 py-3 rounded-full ${
                  tip === amount ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
                }`}
              >
                ₪{amount.toFixed(2)}
              </Button>
            ))}
            <Button
              variant={customTip ? 'default' : 'outline'}
              className={`px-4 py-3 rounded-full flex items-center ${
                customTip ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Custom Tip Input */}
          {customTip && (
            <div className="flex justify-center">
              <input
                type="number"
                placeholder="Custom amount"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-center w-32"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          onClick={handleSubmitRating}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg rounded-xl"
        >
          Next
        </Button>
      </div>
    </div>
  );
}