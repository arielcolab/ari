import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Gift } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { Giveaway } from '@/api/entities';
import { User } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';
import { UploadFile } from '@/api/integrations';

export default function PostGiveawayForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    item_title: '',
    description: '',
    category: 'food',
    quantity: '1',
    pickup_location: '',
    available_until: '',
    pickup_instructions: '',
    condition: 'good',
    photo_url: ''
  });

  const categories = [
    { value: 'food', label: 'אוכל' },
    { value: 'clothing', label: 'בגדים' },
    { value: 'furniture', label: 'רהיטים' },
    { value: 'electronics', label: 'אלקטרוניקה' },
    { value: 'books', label: 'ספרים' },
    { value: 'toys', label: 'צעצועים' },
    { value: 'household', label: 'כלי בית' },
    { value: 'other', label: 'אחר' }
  ];

  const conditions = [
    { value: 'new', label: 'חדש' },
    { value: 'like_new', label: 'כמעט חדש' },
    { value: 'good', label: 'טוב' },
    { value: 'fair', label: 'בסדר' },
    { value: 'needs_repair', label: 'צריך תיקון' }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.item_title || !formData.pickup_location || !formData.available_until) {
      showToast('אנא מלא את כל השדות הנדרשים', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await User.me();
      
      await Giveaway.create({
        giver_id: user.id,
        giver_name: user.full_name,
        giver_avatar_url: user.profile_photo_url,
        item_title: formData.item_title,
        description: formData.description,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
        pickup_location: formData.pickup_location,
        available_until: formData.available_until,
        pickup_instructions: formData.pickup_instructions,
        condition: formData.condition,
        photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1549298916-f52d724204b4?w=400&h=300&fit=crop'
      });

      showToast('הודעת מסירה נוצרה בהצלחה!', 'success');
      navigate(createPageUrl('Giveaways'));
    } catch (error) {
      console.error('Error creating giveaway:', error);
      showToast('שגיאה ביצירת המסירה', 'error');
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
          <h1 className="text-xl font-semibold">מסור בחינם</h1>
          <div className="w-10" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">תמונה</h3>
          <div className="flex items-center gap-4">
            <img
              src={formData.photo_url || 'https://images.unsplash.com/photo-1549298916-f52d724204b4?w=200&h=200&fit=crop'}
              alt="Item preview"
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

        {/* Item Info */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <Input
            placeholder="מה אתה מוסר? (למשל: כיסא משרדי, בגדי ילדים, ספרים...)"
            value={formData.item_title}
            onChange={(e) => handleInputChange('item_title', e.target.value)}
            required
          />
          
          <Textarea
            placeholder="תאר את הפריט - מצב, מדוע אתה מוסר, פרטים נוספים..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-24"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-lg"
            >
              {conditions.map(cond => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
          </div>

          <Input
            type="number"
            placeholder="כמות"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            min="1"
          />
        </div>

        {/* Pickup Details */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">פרטי איסוף</h3>
          
          <Input
            placeholder="מיקום איסוף (כתובת או אזור)"
            value={formData.pickup_location}
            onChange={(e) => handleInputChange('pickup_location', e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">זמין עד:</label>
            <Input
              type="datetime-local"
              value={formData.available_until}
              onChange={(e) => handleInputChange('available_until', e.target.value)}
              required
            />
          </div>

          <Textarea
            placeholder="הוראות איסוף - מתי לבוא, איך ליצור קשר, הערות מיוחדות..."
            value={formData.pickup_instructions}
            onChange={(e) => handleInputChange('pickup_instructions', e.target.value)}
            className="h-20"
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
            {isLoading ? 'יוצר...' : 'פרסם מסירה'}
          </Button>
        </div>
      </form>
    </div>
  );
}