import React from 'react';
import ServiceDetailPage from '../components/common/ServiceDetailPage';
import { LastCallEat } from '@/api/entities';

export default function LastCallEatDetails() {
  return (
    <ServiceDetailPage
      entity={LastCallEat}
      itemType="last_call"
    />
  );
}