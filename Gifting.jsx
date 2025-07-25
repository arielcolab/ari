import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';

const GiftOptionCard = ({ title, description, image, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors w-full">
        <div className="flex-1 text-left">
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <img src={image} alt={title} className="w-20 h-20 rounded-lg object-cover" />
    </button>
);

export default function Gifting() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const options = [
        { 
            title: t('giftADish'), 
            description: t('giftADishDescription'), 
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200",
            onClick: () => {}
        },
        { 
            title: t('giftAMealPlan'), 
            description: t('giftAMealPlanDescription'), 
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200",
            onClick: () => {}
        },
        { 
            title: t('giftACookingClass'), 
            description: t('giftACookingClassDescription'), 
            image: "https://images.unsplash.com/photo-1556910110-a5a637d53c6c?w=200",
            onClick: () => {}
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900">{t('giftingOptions')}</h1>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {options.map(option => (
                    <GiftOptionCard key={option.title} {...option} />
                ))}
            </div>
        </div>
    );
}