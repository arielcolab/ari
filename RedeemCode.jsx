import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Ticket } from 'lucide-react';
import { showToast } from '../components/common/ErrorBoundary';

export default function RedeemCode() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRedeem = async (e) => {
        e.preventDefault();
        if (!code) {
            showToast('Please enter a code.', 'error');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));
        setIsLoading(false);

        if (code.toUpperCase() === 'WELCOME10') {
            showToast('₪10 in credits added to your account!', 'success');
            navigate(-1);
        } else {
            showToast('Invalid or expired code.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className="text-xl font-semibold text-gray-900">Redeem Code</h1>
                </div>
            </div>
            <div className="p-4 text-center">
                 <Ticket className="w-24 h-24 mx-auto text-red-500 mb-6"/>
                 <h2 className="text-2xl font-bold mb-2">Have a gift card or promo code?</h2>
                 <p className="text-gray-600 mb-8">Enter it here to add it to your account.</p>

                 <form onSubmit={handleRedeem} className="space-y-4 max-w-sm mx-auto">
                    <Input 
                        placeholder="Enter code" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="h-14 text-center text-lg tracking-widest"
                    />
                    <Button type="submit" disabled={isLoading} className="w-full h-14 bg-red-500 hover:bg-red-600 text-lg">
                        {isLoading ? 'Redeeming...' : 'Redeem'}
                    </Button>
                 </form>
            </div>
        </div>
    );
}