import React, { useState, useEffect } from 'react';
import { Dish } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { createPageUrl } from '@/utils';

const IngredientCard = ({ item }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
    <div className="aspect-square overflow-hidden">
        <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-3">
        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.quantity} {item.unit || ''}</p>
    </div>
  </div>
);

const FilterButton = ({ label }) => (
    <Button variant="outline" className="rounded-full bg-white">{label}</Button>
);

export default function Ingredients() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadIngredients = async () => {
            setIsLoading(true);
            try {
                const allItems = await Dish.list();
                const ingredientItems = allItems.filter(item => item.product_type === 'ingredients');
                setIngredients(ingredientItems);
            } catch (error) {
                console.error("Failed to load ingredients:", error);
            }
            setIsLoading(false);
        }
        loadIngredients();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }
    
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900">{t('ingredients')}</h1>
                </div>
            </div>

            <div className="p-4 space-y-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input placeholder={t('searchIngredients')} className="pl-12 h-12 rounded-xl bg-white" />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <FilterButton label={t('category')} />
                    <FilterButton label={t('dietary')} />
                    <FilterButton label={t('price')} />
                    <FilterButton label={t('more')} />
                    <Button variant="ghost" size="icon" className="rounded-full bg-white"><SlidersHorizontal className="w-5 h-5" /></Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {ingredients.map(item => (
                        <IngredientCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}