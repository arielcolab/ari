import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { Giveaway } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';

export default function Giveaways() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={Giveaway}
      itemType="giveaway"
      title={t('giveaways', 'Giveaways')}
      subtitle={t('freeItemsForCommunity', 'Share and receive free items in your community')}
    />
  );
}