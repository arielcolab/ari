import React from 'react';
import ServiceDetailPage from '../components/common/ServiceDetailPage';
import { MealPrepService } from '@/api/entities';

export default function MealPrepDetails() {
  return (
    <ServiceDetailPage
      entity={MealPrepService}
      itemType="meal_prep"
    />
  );
}