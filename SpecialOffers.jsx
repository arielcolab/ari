import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { createPageUrl } from '@/utils';

export default function SpecialOffers() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(createPageUrl("Home"))}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('specialOffers')}</h1>
        </div>
      </div>
      <div className="p-4 text-center">
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a04a37805_4444.png" className="mx-auto my-8 w-64 h-auto" alt="Special Offer"/>
        <h2 className="text-2xl font-bold text-gray-800">{t('getFreeDelivery')}</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">This is a special promotional page. All orders placed this week will have the delivery fee waived at checkout!</p>
        <Button onClick={() => navigate(createPageUrl("Home"))} className="mt-8 bg-red-500 hover:bg-red-600">Start Shopping</Button>
      </div>
    </div>
  );
}