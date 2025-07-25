import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift } from 'lucide-react';
import { PriceDisplay } from '../components/utils/dd_currency';
import { dd_Credits as Credits } from '@/api/entities';
import { User } from '@/api/entities';

export default function CreditsPage() {
    const navigate = useNavigate();
    const [credits, setCredits] = useState(null);

    useEffect(() => {
        User.me()
          .then(user => Credits.filter({ user_id: user.id }))
          .then(userCredits => setCredits(userCredits[0] || { balance: 0 }))
          .catch(() => setCredits({ balance: 0 }));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className="text-xl font-semibold text-gray-900">Credits & Tokens</h1>
                </div>
            </div>
            <div className="p-4">
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <div className="my-4">
                        <PriceDisplay price={credits?.balance || 0} className="text-5xl font-bold" />
                    </div>
                    <Button onClick={() => navigate('/gifting')} className="w-full h-12 bg-red-500 hover:bg-red-600">
                        <Gift className="w-5 h-5 mr-2" />
                        Buy Gift Card
                    </Button>
                </div>
                
                <div className="mt-6">
                    <h2 className="font-semibold text-lg mb-2">Transaction History</h2>
                    <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500">
                        <p>No transactions yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}