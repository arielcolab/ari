import React from 'react';
import ServiceDetailPage from '../components/common/ServiceDetailPage';
import { CookingClass } from '@/api/entities';

export default function ClassDetails() {
  return (
    <ServiceDetailPage
      entity={CookingClass}
      itemType="class"
    />
  );
}