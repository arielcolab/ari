import React from 'react';
import ServiceDetailPage from '../components/common/ServiceDetailPage';
import { SurplusGrocery } from '@/api/entities';

export default function SurplusGroceryDetails() {
  return (
    <ServiceDetailPage
      entity={SurplusGrocery}
      itemType="surplus_grocery"
    />
  );
}