import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { StripeAccount } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChefHat, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { showToast } from '../components/common/ErrorBoundary';
import { useTranslation } from '../components/utils/translations';

export default function CookOnboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [stripeAccount, setStripeAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isStartingOnboarding, setIsStartingOnboarding] = useState(false);

  useEffect(() => {
    loadUserAndStripeAccount();
  }, []);

  const loadUserAndStripeAccount = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Check if user already has a Stripe account
      const accounts = await StripeAccount.filter({ user_id: userData.id });
      if (accounts.length > 0) {
        setStripeAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate(createPageUrl('Profile'));
    }
    setIsLoading(false);
  };

  const createStripeAccount = async () => {
    setIsCreatingAccount(true);
    try {
      // This would typically be a backend API call
      // For now, we'll simulate creating a Stripe Express account
      const mockStripeAccountId = `acct_${Math.random().toString(36).substr(2, 16)}`;
      
      const newAccount = await StripeAccount.create({
        user_id: user.id,
        stripe_account_id: mockStripeAccountId,
        kyc_status: 'pending',
        charges_enabled: false,
        payouts_enabled: false,
        onboarding_completed: false
      });

      setStripeAccount(newAccount);
      showToast('Stripe account created successfully!', 'success');
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      showToast('Failed to create payment account. Please try again.', 'error');
    }
    setIsCreatingAccount(false);
  };

  const startOnboarding = async () => {
    setIsStartingOnboarding(true);
    try {
      // This would typically generate an onboarding link via backend
      // For demo purposes, we'll simulate the onboarding completion
      showToast('Starting onboarding process...', 'info');
      
      // Simulate onboarding completion after 3 seconds
      setTimeout(async () => {
        await StripeAccount.update(stripeAccount.id, {
          kyc_status: 'completed',
          charges_enabled: true,
          payouts_enabled: true,
          onboarding_completed: true
        });
        
        await User.updateMyUserData({ 
          role: 'cook',
          is_verified_cook: true 
        });
        
        showToast('Onboarding completed! You can now start selling.', 'success');
        navigate(createPageUrl('Profile'));
      }, 3000);
      
    } catch (error) {
      console.error('Error starting onboarding:', error);
      showToast('Failed to start onboarding. Please try again.', 'error');
    }
    setIsStartingOnboarding(false);
  };

  const getStatusInfo = () => {
    if (!stripeAccount) {
      return {
        icon: ChefHat,
        title: 'Ready to Start Selling?',
        description: 'Create your payment account to start accepting orders and earning money.',
        color: 'blue',
        action: 'Create Payment Account'
      };
    }

    switch (stripeAccount.kyc_status) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Complete Your Setup',
          description: 'Finish setting up your payment account to start selling.',
          color: 'orange',
          action: 'Continue Onboarding'
        };
      case 'under_review':
        return {
          icon: AlertCircle,
          title: 'Under Review',
          description: 'Your account is being reviewed. This usually takes 1-2 business days.',
          color: 'yellow',
          action: null
        };
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'Ready to Sell!',
          description: 'Your payment account is set up and ready to accept orders.',
          color: 'green',
          action: 'Start Selling'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          title: 'Account Issues',
          description: 'There are issues with your account that need to be resolved.',
          color: 'red',
          action: 'Fix Issues'
        };
      default:
        return {
          icon: Clock,
          title: 'Setting Up...',
          description: 'Please wait while we set up your account.',
          color: 'gray',
          action: null
        };
    }
  };

  const handleAction = () => {
    if (!stripeAccount) {
      createStripeAccount();
    } else if (stripeAccount.kyc_status === 'pending') {
      startOnboarding();
    } else if (stripeAccount.kyc_status === 'completed') {
      navigate(createPageUrl('MyDishes'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Cook Setup</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto mt-8">
        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
          statusInfo.color === 'blue' ? 'bg-blue-100' :
          statusInfo.color === 'orange' ? 'bg-orange-100' :
          statusInfo.color === 'yellow' ? 'bg-yellow-100' :
          statusInfo.color === 'green' ? 'bg-green-100' :
          statusInfo.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <IconComponent className={`w-12 h-12 ${
            statusInfo.color === 'blue' ? 'text-blue-500' :
            statusInfo.color === 'orange' ? 'text-orange-500' :
            statusInfo.color === 'yellow' ? 'text-yellow-500' :
            statusInfo.color === 'green' ? 'text-green-500' :
            statusInfo.color === 'red' ? 'text-red-500' : 'text-gray-500'
          }`} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          {statusInfo.title}
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          {statusInfo.description}
        </p>

        {stripeAccount && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">KYC Status</span>
                <span className={`text-sm font-medium ${
                  stripeAccount.kyc_status === 'completed' ? 'text-green-600' :
                  stripeAccount.kyc_status === 'pending' ? 'text-orange-600' :
                  stripeAccount.kyc_status === 'under_review' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stripeAccount.kyc_status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Charges Enabled</span>
                <span className={`text-sm font-medium ${
                  stripeAccount.charges_enabled ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stripeAccount.charges_enabled ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payouts Enabled</span>
                <span className={`text-sm font-medium ${
                  stripeAccount.payouts_enabled ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stripeAccount.payouts_enabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {statusInfo.action && (
          <Button 
            onClick={handleAction}
            disabled={isCreatingAccount || isStartingOnboarding}
            className={`w-full h-12 text-lg ${
              statusInfo.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
              'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isCreatingAccount || isStartingOnboarding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              statusInfo.action
            )}
          </Button>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">Why do we need this?</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Securely process customer payments</li>
            <li>• Comply with financial regulations</li>
            <li>• Transfer earnings directly to your bank</li>
            <li>• Provide purchase protection for customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}