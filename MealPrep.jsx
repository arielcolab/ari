import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { MealPrepService } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';

export default function MealPrep() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={MealPrepService}
      itemType="meal_prep"
      title={t('weeklyMealPrep', 'Weekly Meal Prep')}
      subtitle={t('healthyMealsDelivered', 'Healthy meals, prepared and delivered weekly')}
    />
  );
}