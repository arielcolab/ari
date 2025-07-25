
import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { createPageUrl } from "@/utils"; // Added createPageUrl

const GroupCard = ({ name, image, userAvatars = [] }) => ( // 'members' prop is now passed but not used by this component as per outline
    <div className="flex flex-col items-center flex-shrink-0 w-24">
        <div className="relative">
            <img src={image} alt={name} className="w-20 h-20 rounded-full object-cover" />
            {userAvatars.length > 0 && (
                <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                    {userAvatars.slice(0, 2).map((avatar, i) => (
                        <img key={i} src={avatar} className="w-6 h-6 rounded-full border-2 border-white" />
                    ))}
                </div>
            )}
        </div>
        <p className="text-sm font-medium text-center mt-2">{name}</p>
    </div>
);

const DiscoverGroupCard = ({ name, image }) => (
    <div className="relative aspect-square rounded-xl overflow-hidden group">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <p className="absolute bottom-2 left-2 text-white font-semibold">{name}</p>
    </div>
);

export default function Community() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const yourGroups = [
        { id: '1', name: 'Vegan Recipes', members: '1.2k members', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300' },
        { id: '2', name: 'Baking Enthusiasts', members: '3.4k members', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
    ];

    const discoverGroups = [
        { name: "Vegetarian Cooking", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400" },
        { name: "Baking Enthusiasts", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400" },
        { name: "Italian Cuisine", image: "https://images.unsplash.com/photo-1621996346565-e326e20f4423?w=400" },
        { name: "Grilling Masters", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400" },
        { name: "Healthy Eating", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17025?w=400" },
        { name: "Dessert Lovers", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900">{t('community')}</h1>
                </div>
            </div>

            <div className="p-4 space-y-8">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input placeholder={t('search')} className="pl-12 h-12 rounded-xl bg-white" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('yourGroups')}</h2>
                    <div className="space-y-4"> {/* Changed from flex to space-y-4 */}
                        {yourGroups.map((group) => (
                            <Link to={createPageUrl(`GroupDetails?id=${group.id}`)} key={group.id}> {/* Wrapped GroupCard in Link */}
                                <GroupCard {...group} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('discoverGroups')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {discoverGroups.map(group => <DiscoverGroupCard key={group.name} {...group} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}
