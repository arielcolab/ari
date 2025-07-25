import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { showToast } from '../components/common/ErrorBoundary';

// Mock data, as we don't store full card details
const mockPaymentMethods = [
    { id: 1, type: 'visa', last4: '4242', isDefault: true },
    { id: 2, type: 'mastercard', last4: '5555', isDefault: false },
];

const CardIcon = ({ type }) => {
    // In a real app, you'd have proper icons
    if (type === 'visa') return <img src="https://js.stripe.com/v3/fingerprinted/img/visa-d773aa2840340e39665283b044a7a13c.svg" alt="Visa" className="w-10 h-auto"/>;
    if (type === 'mastercard') return <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8307445c086609300a28f28c1353e1.svg" alt="Mastercard" className="w-10 h-auto"/>;
    return <CreditCard className="w-8 h-8 text-gray-400" />;
};

export default function PaymentMethods() {
    const navigate = useNavigate();
    const [methods, setMethods] = useState(mockPaymentMethods);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this payment method?')) {
            setMethods(methods.filter(m => m.id !== id));
            showToast('Payment method removed.', 'success');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className="text-xl font-semibold text-gray-900">Payment Methods</h1>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {methods.map(method => (
                    <div key={method.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                        <CardIcon type={method.type} />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">•••• {method.last4}</p>
                            {method.isDefault && <p className="text-xs text-green-600">Default</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(method.id)}>
                            <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" className="w-full h-14" onClick={() => showToast('This would open a Stripe form to add a new card.', 'info')}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Payment Method
                </Button>
            </div>
        </div>
    );
}