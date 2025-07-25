import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { LastCallEat } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';

export default function LastCallEats() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={LastCallEat}
      itemType="last_call"
      pageTitle={t('lastCallEats', 'Last Call Eats')}
      pageSubtitle={t('discountedFoodNearExpiry', "Great food at a discount before it's gone")}
    />
  );
}