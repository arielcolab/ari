import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { MealPrepService } from '@/api/entities';
import { User } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';
import { UploadFile } from '@/api/integrations';

export default function PostMealPrepForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    service_title: '',
    description: '',
    price_per_week: '',
    meals_per_week: '',
    cuisine_types: [],
    sample_menu: '',
    photo_url: ''
  });

  const cuisineOptions = [
    'Mediterranean', 'Asian', 'Italian', 'Mexican', 'Indian', 
    'Middle Eastern', 'American', 'Vegan', 'Keto', 'Healthy'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCuisineToggle = (cuisine) => {
    setFormData(prev => ({
      ...prev,
      cuisine_types: prev.cuisine_types.includes(cuisine)
        ? prev.cuisine_types.filter(c => c !== cuisine)
        : [...prev.cuisine_types, cuisine]
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.service_title || !formData.description || !formData.price_per_week) {
      showToast('אנא מלא את כל השדות הנדרשים', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await User.me();
      
      await MealPrepService.create({
        cook_id: user.id,
        cook_name: user.full_name,
        cook_avatar_url: user.profile_photo_url,
        service_title: formData.service_title,
        description: formData.description,
        price_per_week: parseFloat(formData.price_per_week),
        meals_per_week: parseInt(formData.meals_per_week) || 7,
        cuisine_types: formData.cuisine_types,
        sample_menu: formData.sample_menu,
        photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'
      });

      showToast('שירות הכנת הארוחות נוצר בהצלחה!', 'success');
      navigate(createPageUrl('MealPrep'));
    } catch (error) {
      console.error('Error creating meal prep service:', error);
      showToast('שגיאה ביצירת השירות', 'error');
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
          <h1 className="text-xl font-semibold">הוסף שירות הכנת ארוחות</h1>
          <div className="w-10" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">תמונה</h3>
          <div className="flex items-center gap-4">
            <img
              src={formData.photo_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop'}
              alt="Service preview"
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
            placeholder="שם השירות (למשל: תכנית ארוחות בריאות שבועית)"
            value={formData.service_title}
            onChange={(e) => handleInputChange('service_title', e.target.value)}
            required
          />
          
          <Textarea
            placeholder="תאר את השירות שלך - סוג האוכל, התהליך, מה כלול..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-24"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="מחיר לשבוע (₪)"
              value={formData.price_per_week}
              onChange={(e) => handleInputChange('price_per_week', e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="מספר ארוחות לשבוע"
              value={formData.meals_per_week}
              onChange={(e) => handleInputChange('meals_per_week', e.target.value)}
            />
          </div>
        </div>

        {/* Cuisine Types */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">סגנונות בישול</h3>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <Button
                key={cuisine}
                type="button"
                variant={formData.cuisine_types.includes(cuisine) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCuisineToggle(cuisine)}
                className={formData.cuisine_types.includes(cuisine) ? "bg-red-500" : ""}
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>

        {/* Sample Menu */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">תפריט לדוגמה</h3>
          <Textarea
            placeholder="תן דוגמה של תפריט שבועי - ארוחת בוקר, צהריים, ערב..."
            value={formData.sample_menu}
            onChange={(e) => handleInputChange('sample_menu', e.target.value)}
            className="h-32"
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
            {isLoading ? 'יוצר...' : 'יצור שירות'}
          </Button>
        </div>
      </form>
    </div>
  );
}