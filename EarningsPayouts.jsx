import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { Payment } from '@/api/entities';
import { Payout } from '@/api/entities';
import { User } from '@/api/entities';

const EarningsCard = ({ title, amount, subtitle, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>${amount.toFixed(2)}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        color.includes('green') ? 'bg-green-100' :
        color.includes('blue') ? 'bg-blue-100' :
        color.includes('orange') ? 'bg-orange-100' : 'bg-gray-100'
      }`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const PaymentItem = ({ payment }) => (
  <div className="flex justify-between items-center py-3">
    <div>
      <p className="font-medium text-gray-900">Order Payment</p>
      <p className="text-sm text-gray-500">
        {new Date(payment.created_date).toLocaleDateString()} • 
        <span className={`ml-1 ${
          payment.status === 'succeeded' ? 'text-green-600' :
          payment.status === 'pending' ? 'text-orange-600' :
          'text-red-600'
        }`}>
          {payment.status.toUpperCase()}
        </span>
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-900">+${(payment.cook_amount / 100).toFixed(2)}</p>
      <p className="text-xs text-gray-500">after fees</p>
    </div>
  </div>
);

const PayoutItem = ({ payout }) => (
  <div className="flex justify-between items-center py-3">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        payout.status === 'paid' ? 'bg-green-100' :
        payout.status === 'in_transit' ? 'bg-blue-100' :
        payout.status === 'pending' ? 'bg-orange-100' : 'bg-red-100'
      }`}>
        {payout.status === 'paid' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
         payout.status === 'in_transit' ? <TrendingUp className="w-4 h-4 text-blue-600" /> :
         <Clock className="w-4 h-4 text-orange-600" />}
      </div>
      <div>
        <p className="font-medium text-gray-900">Bank Transfer</p>
        <p className="text-sm text-gray-500">
          {new Date(payout.created_date).toLocaleDateString()} • 
          <span className={`ml-1 ${
            payout.status === 'paid' ? 'text-green-600' :
            payout.status === 'in_transit' ? 'text-blue-600' :
            payout.status === 'pending' ? 'text-orange-600' :
            'text-red-600'
          }`}>
            {payout.status.replace('_', ' ').toUpperCase()}
          </span>
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-900">${(payout.amount / 100).toFixed(2)}</p>
      {payout.arrival_date && (
        <p className="text-xs text-gray-500">
          Arrives {new Date(payout.arrival_date).toLocaleDateString()}
        </p>
      )}
    </div>
  </div>
);

export default function EarningsPayouts() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('earnings');

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Load payments for this cook
      const cookPayments = await Payment.filter({ cook_id: userData.id });
      setPayments(cookPayments);

      // Load payouts for this cook
      const cookPayouts = await Payout.filter({ cook_id: userData.id });
      setPayouts(cookPayouts);

    } catch (error) {
      console.error('Error loading earnings data:', error);
    }
    setIsLoading(false);
  };

  const calculateEarnings = () => {
    const totalEarnings = payments.reduce((sum, payment) => 
      payment.status === 'succeeded' ? sum + payment.cook_amount : sum, 0
    ) / 100;

    const pendingEarnings = payments.reduce((sum, payment) => 
      payment.status === 'pending' ? sum + payment.cook_amount : sum, 0
    ) / 100;

    const totalPayouts = payouts.reduce((sum, payout) => 
      payout.status === 'paid' ? sum + payout.amount : sum, 0
    ) / 100;

    const availableForPayout = totalEarnings - totalPayouts;

    return { totalEarnings, pendingEarnings, totalPayouts, availableForPayout };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  const earnings = calculateEarnings();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('earningsPayouts')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Earnings Overview */}
        <div className="grid grid-cols-2 gap-4">
          <EarningsCard
            title="Available"
            amount={earnings.availableForPayout}
            subtitle="Ready for payout"
            icon={DollarSign}
            color="text-green-600"
          />
          <EarningsCard
            title="Total Earned"
            amount={earnings.totalEarnings}
            subtitle="All time"
            icon={TrendingUp}
            color="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <EarningsCard
            title="Pending"
            amount={earnings.pendingEarnings}
            subtitle="Processing"
            icon={Clock}
            color="text-orange-600"
          />
          <EarningsCard
            title="Paid Out"
            amount={earnings.totalPayouts}
            subtitle="To your bank"
            icon={CheckCircle}
            color="text-green-600"
          />
        </div>

        {/* Quick Payout Button */}
        {earnings.availableForPayout > 0 && (
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl">
            Request Payout • ${earnings.availableForPayout.toFixed(2)}
          </Button>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 ${activeTab === 'earnings' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
          >
            Earnings
          </Button>
          <Button
            onClick={() => setActiveTab('payouts')}
            className={`flex-1 ${activeTab === 'payouts' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
          >
            Payouts
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {activeTab === 'earnings' ? (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Earnings</h3>
              {payments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {payments.slice(0, 10).map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No earnings yet</p>
                  <p className="text-sm">Start selling to see your earnings here</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Payout History</h3>
              {payouts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {payouts.map((payout) => (
                    <PayoutItem key={payout.id} payout={payout} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No payouts yet</p>
                  <p className="text-sm">Payouts will appear here once processed</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payout Schedule Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Payout Schedule</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Automatic payouts every Friday</li>
            <li>• Instant payouts available for a small fee</li>
            <li>• Funds typically arrive in 1-2 business days</li>
            <li>• $1 minimum payout amount</li>
          </ul>
        </div>
      </div>
    </div>
  );
}