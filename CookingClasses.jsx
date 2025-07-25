import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { CookingClass } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';

export default function CookingClasses() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={CookingClass}
      itemType="class"
      pageTitle={t('cookingClasses', 'Cooking Classes')}
      pageSubtitle={t('learnFromLocalChefs', 'Learn new skills from talented local chefs')}
    />
  );
}