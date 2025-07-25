import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Clock } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { LastCallEat } from '@/api/entities';
import { User } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';
import { UploadFile } from '@/api/integrations';

export default function PostLastCallForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    food_title: '',
    description: '',
    original_price: '',
    discount_percentage: '',
    quantity_available: '',
    pickup_location: '',
    expires_at: '',
    pickup_window_end: '',
    pickup_instructions: '',
    photo_url: '',
    food_type: 'prepared_meal',
    condition: 'fresh'
  });

  const foodTypes = [
    { value: 'prepared_meal', label: 'ארוחה מוכנה' },
    { value: 'baked_goods', label: 'מאפים' },
    { value: 'produce', label: 'פירות וירקות' },
    { value: 'dairy', label: 'מוצרי חלב' },
    { value: 'packaged_food', label: 'מזון ארוז' }
  ];

  const conditions = [
    { value: 'fresh', label: 'טרי' },
    { value: 'near_expiry', label: 'קרוב לפקיעה' },
    { value: 'day_old', label: 'מאתמול' },
    { value: 'still_good', label: 'עדיין טוב' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      handleInputChange('photo_url', result.file_url);
      showToast('תמונה הועלתה בהצלחה!', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('שגיאה בהעלאת התמונה', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const calculateDiscountedPrice = () => {
    const original = parseFloat(formData.original_price) || 0;
    const discount = parseFloat(formData.discount_percentage) || 0;
    return original * (1 - discount / 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.food_title || !formData.original_price || !formData.expires_at) {
      showToast('אנא מלא את כל השדות הנדרשים', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await User.me();
      
      await LastCallEat.create({
        seller_id: user.id,
        seller_name: user.full_name,
        seller_avatar_url: user.profile_photo_url,
        food_title: formData.food_title,
        description: formData.description,
        original_price: parseFloat(formData.original_price),
        discounted_price: calculateDiscountedPrice(),
        discount_percentage: parseInt(formData.discount_percentage) || 0,
        quantity_available: parseInt(formData.quantity_available) || 1,
        pickup_location: formData.pickup_location,
        expires_at: formData.expires_at,
        pickup_window_end: formData.pickup_window_end || formData.expires_at,
        pickup_instructions: formData.pickup_instructions,
        photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        food_type: formData.food_type,
        condition: formData.condition
      });

      showToast('המבצע נוצר בהצלחה!', 'success');
      navigate(createPageUrl('LastCallEats'));
    } catch (error) {
      console.error('Error creating last call eat:', error);
      showToast('שגיאה ביצירת המבצע', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">קריאה אחרונה - מבצע חם</h1>
          <div className="w-10" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">תמונה</h3>
          <div className="flex items-center gap-4">
            <img
              src={formData.photo_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop'}
              alt="Food preview"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={isUploading}
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={isUploading}>
                  <Camera className="w-4 h-4 mr-2" />
                  {isUploading ? 'מעלה...' : 'העלה תמונה'}
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <Input
            placeholder="שם המוצר/האוכל"
            value={formData.food_title}
            onChange={(e) => handleInputChange('food_title', e.target.value)}
            required
          />
          
          <Textarea
            placeholder="תיאור המוצר - מה זה, איך נעשה, למה במבצע..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-20"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="מחיר מקורי (₪)"
              value={formData.original_price}
              onChange={(e) => handleInputChange('original_price', e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="אחוז הנחה"
              value={formData.discount_percentage}
              onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
              min="0"
              max="90"
            />
          </div>

          {formData.original_price && formData.discount_percentage && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-800 font-medium">
                מחיר אחרי הנחה: ₪{calculateDiscountedPrice().toFixed(2)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.food_type}
              onChange={(e) => handleInputChange('food_type', e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-lg"
            >
              {foodTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-lg"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>{condition.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timing and Pickup */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">זמנים ואיסוף</h3>
          
          <Input
            placeholder="כמות זמינה"
            type="number"
            value={formData.quantity_available}
            onChange={(e) => handleInputChange('quantity_available', e.target.value)}
            min="1"
          />

          <Input
            placeholder="מיקום איסוף"
            value={formData.pickup_location}
            onChange={(e) => handleInputChange('pickup_location', e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">נגמר ב:</label>
            <Input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => handleInputChange('expires_at', e.target.value)}
              required
            />
          </div>

          <Textarea
            placeholder="הוראות איסוף (אופציונלי)"
            value={formData.pickup_instructions}
            onChange={(e) => handleInputChange('pickup_instructions', e.target.value)}
            className="h-16"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            ביטול
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            {isLoading ? 'יוצר...' : 'יצור מבצע'}
          </Button>
        </div>
      </form>
    </div>
  );
}