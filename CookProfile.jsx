import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Profile } from '@/api/entities';
import { Dish } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, MessageSquare } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import OptimizedImage from '../components/dd_OptimizedImage';
import RatingDisplay from '../components/reviews/RatingDisplay';
import ItemCard from '../components/common/ItemCard';

export default function CookProfile() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');

    const [profile, setProfile] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            navigate(-1);
            return;
        }
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const profileData = await Profile.filter({ userId: userId });
                if (profileData.length > 0) {
                    setProfile(profileData[0]);
                    const dishData = await Dish.filter({ cook_id: userId, is_active: true });
                    setDishes(dishData);
                } else {
                    // Handle case where profile doesn't exist
                }
            } catch (error) {
                console.error("Error loading cook profile:", error);
            }
            setIsLoading(false);
        };
        loadProfile();
    }, [userId]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>;
    }

    if (!profile) {
        return <div>{t('profileNotFound', 'Profile not found')}</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 bg-white border-b">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5"/></Button>
            </div>
            <div className="p-4 text-center bg-white">
                <OptimizedImage src={profile.photo} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"/>
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                <p className="text-gray-600">{profile.city}</p>
                <div className="my-4"><RatingDisplay rating={4.8} reviewCount={132}/></div>
                <p className="text-sm text-gray-500 max-w-md mx-auto">{profile.bio}</p>
                <div className="flex justify-center gap-2 mt-4">
                    <Button><Heart className="w-4 h-4 mr-2"/> {t('follow', 'Follow')}</Button>
                    <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2"/> {t('message', 'Message')}</Button>
                </div>
            </div>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">{t('dishesBy', 'Dishes by')} {profile.fullName.split(' ')[0]}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dishes.map(dish => <ItemCard key={dish.id} item={dish} itemType="chef_marketplace" />)}
                </div>
            </div>
        </div>
    )
}