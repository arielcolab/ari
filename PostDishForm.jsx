
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react'; // Removed unused imports: Upload, Clock, Users, AlertCircle, MapPin, DollarSign
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { showToast } from '../components/common/ErrorBoundary';
import { Dish } from '@/api/entities';
import { User } from '@/api/entities';

export default function PostDishForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dishType = searchParams.get('type') || 'chef_dish';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    servings: '1',
    photo_url: '',
    allergen_list: [],
    diet_tags: [],
    pickup_start_time: '',
    pickup_end_time: '',
    location: '',
    condition: dishType === 'leftovers' ? 'refrigerated' : 'fresh',
    cooked_at: '',
    expires_at: '',
    fridge_since: dishType === 'leftovers' ? new Date().toISOString() : '',
    reheating_instructions: '',
    storage_instructions: '',
    quantity: '1',
    product_type: dishType === 'chef_dish' ? 'prepared_meal' : 'leftovers'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const allergenOptions = [
    'gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'
  ];

  const dietTagOptions = [
    'vegan', 'vegetarian', 'kosher', 'halal', 'gluten_free', 'dairy_free', 'organic', 'keto', 'paleo'
  ];

  const conditionOptions = {
    chef_dish: [
      { value: 'fresh', label: t('freshCookedToday', 'Fresh - Cooked today') },
      { value: 'made_to_order', label: t('madeToOrder', 'Made to order') }
    ],
    leftovers: [
      { value: 'fresh', label: t('freshCookedToday', 'Fresh - Cooked today') },
      { value: 'refrigerated', label: t('refrigeratedStoredInFridge', 'Refrigerated - Stored in fridge') },
      { value: 'frozen', label: t('frozenStoredInFreezer', 'Frozen - Stored in freezer') }
    ]
  };

  const handleAllergenToggle = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergen_list: prev.allergen_list.includes(allergen)
        ? prev.allergen_list.filter(a => a !== allergen)
        : [...prev.allergen_list, allergen]
    }));
  };

  const handleDietTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      diet_tags: prev.diet_tags.includes(tag)
        ? prev.diet_tags.filter(t => t !== tag)
        : [...prev.diet_tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    try {
      const user = await User.me();

      const dishData = {
        ...formData,
        cook_id: user.id,
        cook_name: user.full_name,
        price: parseFloat(formData.price),
        servings: parseInt(formData.servings),
        quantity: parseInt(formData.quantity),
        isChef: user.role === 'cook' || user.is_verified_cook,
        is_active: true
      };

      await Dish.create(dishData);
      showToast(
        dishType === 'chef_dish'
          ? t('chefDishPostedSuccess', 'Chef dish posted successfully!')
          : t('leftoversPostedSuccess', 'Leftovers posted successfully!'),
        'success'
      );
      navigate(createPageUrl('MyDishes'));

    } catch (error) {
      console.error('Error creating dish:', error);
      showToast(t('errorPostingDish', 'Error posting dish'), 'error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('postDish', 'Post Dish')}</h1>
          <Button
            type="submit" // This button will trigger the form submission
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? t('saving', 'Saving...') : t('save', 'Save')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('basicInfo', 'Basic Info')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dishName', 'Dish name')} *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('enterDishName', 'Enter dish name')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('description', 'Description')} *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('describeDish', 'Describe your dish...')}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('price', 'Price')} (₪) *</label>
              <Input
                type="number"
                placeholder={t('enterPrice', 'Enter price')}
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('numberOfServings', 'Number of Servings')} *</label>
              <Select value={formData.servings} onValueChange={(value) => setFormData(prev => ({ ...prev, servings: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{t('numServings', '{{num}} servings', { num: num })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Condition & Timing */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('conditionAndTime', 'Dish Condition & Timing')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('dishCondition', 'Dish Condition')}</label>
            <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions[dishType]?.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('cookedAt', 'Cooked At')}</label>
              <Input
                type="datetime-local"
                value={formData.cooked_at}
                onChange={(e) => setFormData(prev => ({ ...prev, cooked_at: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('expiresAt', 'Expires At')}</label>
              <Input
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Pickup Details */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('pickupDetails', 'Pickup Details')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pickupLocation', 'Pickup Location')} *</label>
            <Input
              placeholder={t('enterPickupLocation', 'Enter pickup location')}
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('pickupFrom', 'Pickup From')}</label>
              <Input
                type="time"
                value={formData.pickup_start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, pickup_start_time: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('pickupUntil', 'Pickup Until')}</label>
              <Input
                type="time"
                value={formData.pickup_end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, pickup_end_time: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Allergens & Diet Tags */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('allergensAndDietTags', 'Allergens & Diet Tags')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('allergensInDish', 'Allergens in Dish')}</label>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map(allergen => (
                <Button
                  key={allergen}
                  type="button"
                  variant={formData.allergen_list.includes(allergen) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAllergenToggle(allergen)}
                  className={formData.allergen_list.includes(allergen) ? "bg-red-500" : ""}
                >
                  {t(allergen, allergen)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('dietaryTags', 'Dietary Tags')}</label>
            <div className="flex flex-wrap gap-2">
              {dietTagOptions.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant={formData.diet_tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDietTagToggle(tag)}
                  className={formData.diet_tags.includes(tag) ? "bg-green-500" : ""}
                >
                  {t(tag, tag)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('instructions', 'Instructions')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('reheatingInstructions', 'Reheating Instructions')} ({t('optional', 'optional')})</label>
            <Textarea
              placeholder={t('reheatingInstructionsPlaceholder', 'e.g., Heat in microwave for 2 minutes')}
              value={formData.reheating_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, reheating_instructions: e.target.value }))}
              className="h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('storageInstructions', 'Storage Instructions')} ({t('optional', 'optional')})</label>
            <Textarea
              placeholder={t('storageInstructionsPlaceholder', 'e.g., Store in refrigerator for up to 3 days')}
              value={formData.storage_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, storage_instructions: e.target.value }))}
              className="h-20"
            />
          </div>
        </div>

        {/* The submit button is now in the header, this one is removed */}
      </form>
    </div>
  );
}
