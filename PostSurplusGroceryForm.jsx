import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, ShoppingBasket } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { SurplusGrocery } from '@/api/entities';
import { User } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';
import { UploadFile } from '@/api/integrations';

export default function PostSurplusGroceryForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    product_title: '',
    description: '',
    category: 'food',
    original_price: '',
    discount_percentage: '',
    quantity_available: '',
    expiry_date: '',
    pickup_location: '',
    pickup_instructions: '',
    brand: '',
    size: '',
    condition: 'new',
    photo_url: ''
  });

  const categories = [
    { value: 'food', label: 'מזון' },
    { value: 'canned_goods', label: 'שימורים' },
    { value: 'baby_products', label: 'מוצרי תינוקות' },
    { value: 'cleaning_supplies', label: 'חומרי ניקוי' },
    { value: 'dry_goods', label: 'מוצרים יבשים' },
    { value: 'dairy', label: 'מוצרי חלב' },
    { value: 'frozen', label: 'קפואים' },
    { value: 'household', label: 'מוצרי בית' }
  ];

  const conditions = [
    { value: 'new', label: 'חדש' },
    { value: 'near_expiry', label: 'קרוב לתאריך' },
    { value: 'damaged_packaging', label: 'אריזה פגומה' },
    { value: 'bulk_break', label: 'שבירת כמויות' }
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
    
    if (!formData.product_title || !formData.original_price || !formData.pickup_location) {
      showToast('אנא מלא את כל השדות הנדרשים', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await User.me();
      
      await SurplusGrocery.create({
        seller_id: user.id,
        seller_name: user.full_name,
        seller_avatar_url: user.profile_photo_url,
        product_title: formData.product_title,
        description: formData.description,
        category: formData.category,
        original_price: parseFloat(formData.original_price),
        discounted_price: calculateDiscountedPrice(),
        discount_percentage: parseInt(formData.discount_percentage) || 0,
        quantity_available: parseInt(formData.quantity_available) || 1,
        expiry_date: formData.expiry_date,
        pickup_location: formData.pickup_location,
        pickup_instructions: formData.pickup_instructions,
        brand: formData.brand,
        size: formData.size,
        condition: formData.condition,
        photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      });

      showToast('מוצר עודף נוצר בהצלחה!', 'success');
      navigate(createPageUrl('SurplusGroceries'));
    } catch (error) {
      console.error('Error creating surplus grocery:', error);
      showToast('שגיאה ביצירת המוצר', 'error');
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
          <h1 className="text-xl font-semibold">מוצר עודף למכירה</h1>
          <div className="w-10" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">תמונה</h3>
          <div className="flex items-center gap-4">
            <img
              src={formData.photo_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'}
              alt="Product preview"
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

        {/* Product Info */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <Input
            placeholder="שם המוצר"
            value={formData.product_title}
            onChange={(e) => handleInputChange('product_title', e.target.value)}
            required
          />
          
          <Textarea
            placeholder="תיאור המוצר - מה זה, למה עודף, מצב המוצר..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-20"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="מותג"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
            />
            <Input
              placeholder="גודל/משקל"
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
            />
          </div>

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
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">מחירים</h3>
          
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
                מחיר מוזל: ₪{calculateDiscountedPrice().toFixed(2)}
              </p>
            </div>
          )}

          <Input
            type="number"
            placeholder="כמות זמינה"
            value={formData.quantity_available}
            onChange={(e) => handleInputChange('quantity_available', e.target.value)}
            min="1"
          />
        </div>

        {/* Pickup Details */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">פרטי איסוף</h3>
          
          <Input
            placeholder="מיקום איסוף"
            value={formData.pickup_location}
            onChange={(e) => handleInputChange('pickup_location', e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">תאריך תפוגה (אם רלוונטי):</label>
            <Input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
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
            {isLoading ? 'יוצר...' : 'פרסם מוצר'}
          </Button>
        </div>
      </form>
    </div>
  );
}