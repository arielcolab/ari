import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { Dish } from '@/api/entities'; // Assuming leftovers are also `Dish` entities
import { useTranslation } from '../components/utils/translations';

export default function LeftoversMarket() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={Dish}
      itemType="leftovers"
      title={t('leftoversNearYou', 'Leftovers Near You')}
      subtitle={t('deliciousFoodForLess', 'Find delicious homemade leftovers for less')}
    />
  );
}