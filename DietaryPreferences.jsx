
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from "../components/utils/translations";

const PreferenceItem = ({ id, label, description, isChecked, onCheckedChange }) => (
    <div className="flex justify-between items-center py-4">
        <div>
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <Switch checked={isChecked} onCheckedChange={onCheckedChange} />
    </div>
);

export default function DietaryPreferences() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [preferences, setPreferences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        setIsLoading(true);
        try {
            const user = await User.me();
            setPreferences(user.dietary_preferences || []);
        } catch (error) {
            console.error("Error loading user preferences", error);
        }
        setIsLoading(false);
    };

    const handlePreferenceChange = (preferenceId) => {
        setPreferences(prev =>
            prev.includes(preferenceId)
                ? prev.filter(p => p !== preferenceId)
                : [...prev, preferenceId]
        );
    };

    const handleSave = async () => {
        try {
            await User.updateMyUserData({ dietary_preferences: preferences });
            navigate(-1);
        } catch (error) {
            console.error("Error saving preferences", error);
            alert(t('couldNotSavePreferences'));
        }
    };

    const preferenceOptions = [
        { id: 'vegetarian', label: t('vegetarian'), description: t('noMeat') },
        { id: 'vegan', label: t('vegan'), description: t('noAnimalProducts') },
        { id: 'gluten-free', label: t('glutenFree'), description: t('noGluten') },
        { id: 'dairy-free', label: 'Dairy-Free', description: t('noDairy') },
        { id: 'nut-free', label: 'Nut-Free', description: t('noNuts') },
    ];

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
             <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900">{t('dietaryPreferences')}</h1>
                </div>
            </div>

            <div className="p-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{t('dietaryPreferencesTitle')}</h2>
                    <p className="text-gray-600 mt-1">{t('dietaryPreferencesDescription')}</p>
                </div>

                <div className="bg-white rounded-xl p-4 divide-y divide-gray-100">
                    {preferenceOptions.map(opt => (
                        <PreferenceItem
                            key={opt.id}
                            id={opt.id}
                            label={opt.label}
                            description={opt.description}
                            isChecked={preferences.includes(opt.id)}
                            onCheckedChange={() => handlePreferenceChange(opt.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                <Button onClick={handleSave} className="w-full bg-orange-400 hover:bg-orange-500 text-white text-lg h-12 rounded-xl">
                    {t('savePreferences')}
                </Button>
            </div>
        </div>
    );
}
