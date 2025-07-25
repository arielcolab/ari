import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { SurplusGrocery } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';

export default function SurplusGroceries() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={SurplusGrocery}
      itemType="surplus_grocery"
      title={t('surplusGroceries', 'Surplus Groceries')}
      subtitle={t('discountedGroceryItems', 'Save on groceries and reduce waste')}
    />
  );
}