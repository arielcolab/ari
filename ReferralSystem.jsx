import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Share2, Gift } from 'lucide-react';
import { showToast } from '../components/common/ErrorBoundary';

export default function ReferralSystem() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        User.me().then(setUser).catch(() => navigate('/'));
    }, [navigate]);

    const handleCopy = async () => {
        if (!user || !user.ref_code) return;
        try {
            await navigator.clipboard.writeText(user.ref_code);
            showToast('Referral code copied!', 'success');
        } catch (err) {
            showToast('Failed to copy code.', 'error');
        }
    };
    
    const handleShare = async () => {
        if (!user || !user.ref_code) return;
        const shareData = {
            title: 'Join me on DishDash!',
            text: `I'm using DishDash to get amazing food from local cooks. Sign up with my code ${user.ref_code} and we both get credits!`,
            url: window.location.origin,
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className="text-xl font-semibold text-gray-900">Invite Friends</h1>
                </div>
            </div>
            <div className="p-4 text-center">
                <Gift className="w-24 h-24 mx-auto text-red-500 mb-6"/>
                <h2 className="text-2xl font-bold mb-2">Give ₪10, Get ₪10</h2>
                <p className="text-gray-600 mb-8">Share your code with friends. When they place their first order, you'll both get ₪10 in credits.</p>
                
                <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-red-700 mb-2">YOUR REFERRAL CODE</p>
                    <p className="text-3xl font-bold tracking-widest text-red-900">{user.ref_code || 'DISH-123'}</p>
                </div>

                <div className="flex gap-4">
                    <Button onClick={handleCopy} variant="outline" className="w-full h-12">
                        <Copy className="w-5 h-5 mr-2" />
                        Copy
                    </Button>
                    <Button onClick={handleShare} className="w-full h-12 bg-red-500 hover:bg-red-600">
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
}