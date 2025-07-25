import React from 'react';
import ServiceDetailPage from '../components/common/ServiceDetailPage';
import { Giveaway } from '@/api/entities';

export default function GiveawayDetails() {
  return (
    <ServiceDetailPage
      entity={Giveaway}
      itemType="giveaway"
    />
  );
}