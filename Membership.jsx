import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Membership } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Crown, Check, TrendingUp, Truck, DollarSign } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";

const BenefitItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3">
    <div className="bg-yellow-100 p-2 rounded-lg">
      <Icon className="w-5 h-5 text-yellow-600" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const PlanCard = ({ plan, isActive, onSelect, savings }) => (
  <Card className={`relative ${isActive ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-md'} transition-all cursor-pointer`} onClick={() => onSelect(plan.type)}>
    {plan.popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle className="text-xl">{plan.name}</CardTitle>
      <div className="mt-2">
        <span className="text-3xl font-bold">${plan.price}</span>
        <span className="text-gray-500">/{plan.period}</span>
      </div>
      {plan.savings && (
        <p className="text-green-600 font-medium">Save ${plan.savings} vs monthly</p>
      )}
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      {savings && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            You've saved <span className="font-bold">${savings}</span> with your membership!
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function MembershipPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const plans = [
    {
      type: 'monthly',
      name: 'DishDash Premium',
      price: 9.99,
      period: 'month',
      features: [
        'Free delivery on orders over $15',
        'Reduced service fees',
        'Priority customer support',
        'Exclusive member discounts',
        'Early access to new features'
      ]
    },
    {
      type: 'annual',
      name: 'DishDash Premium',
      price: 99.99,
      period: 'year',
      popular: true,
      savings: 19.89,
      features: [
        'Free delivery on orders over $15',
        'Reduced service fees',
        'Priority customer support',
        'Exclusive member discounts',
        'Early access to new features',
        'Monthly bonus credits ($5 value)'
      ]
    }
  ];

  useEffect(() => {
    loadUserAndMembership();
  }, []);

  const loadUserAndMembership = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Try to load existing membership
      const memberships = await Membership.list();
      const userMembership = memberships.find(m => m.user_id === userData.id && m.status === 'active');
      setMembership(userMembership);
      
    } catch (error) {
      console.error("Error loading user/membership:", error);
      navigate(createPageUrl("Profile"));
    }
    setIsLoading(false);
  };

  const handleSubscribe = async (planType) => {
    if (!user) return;
    
    setIsSubscribing(true);
    try {
      const plan = plans.find(p => p.type === planType);
      const endDate = new Date();
      if (planType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const membershipData = {
        user_id: user.id,
        plan_type: planType,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        stripe_subscription_id: `sub_${Date.now()}`, // Mock subscription ID
        total_savings: 0,
        orders_count: 0
      };

      await Membership.create(membershipData);
      setMembership(membershipData);
      showToast(`Welcome to DishDash Premium! Your ${planType} membership is now active.`, 'success');
      
    } catch (error) {
      console.error("Error creating membership:", error);
      showToast('Error activating membership. Please try again.', 'error');
    }
    setIsSubscribing(false);
  };

  const handleCancelMembership = async () => {
    if (!membership) return;
    
    if (confirm('Are you sure you want to cancel your DishDash Premium membership? You will lose all membership benefits.')) {
      try {
        await Membership.update(membership.id, { status: 'cancelled' });
        setMembership(null);
        showToast('Your membership has been cancelled.', 'success');
      } catch (error) {
        console.error("Error cancelling membership:", error);
        showToast('Error cancelling membership. Please try again.', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">DishDash Premium</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto flex items-center justify-center">
            <Crown className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unlock Premium Benefits</h2>
          <p className="text-gray-600">Save money and enjoy exclusive perks with DishDash Premium membership</p>
        </div>

        {/* Current Membership Status */}
        {membership && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                Active Premium Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Plan Type</p>
                  <p className="font-semibold capitalize">{membership.plan_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className="font-semibold">{new Date(membership.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Savings</p>
                  <p className="font-semibold text-green-600">${membership.total_savings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Orders with Benefits</p>
                  <p className="font-semibold">{membership.orders_count}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancelMembership}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Membership
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Premium Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BenefitItem
              icon={Truck}
              title="Free Delivery"
              description="No delivery fees on orders over $15"
            />
            <BenefitItem
              icon={DollarSign}
              title="Reduced Service Fees"
              description="Save up to 50% on service fees"
            />
            <BenefitItem
              icon={TrendingUp}
              title="Exclusive Discounts"
              description="Member-only deals and promotions"
            />
          </CardContent>
        </Card>

        {/* Plans */}
        {!membership && (
          <>
            <div className="grid gap-4">
              {plans.map(plan => (
                <PlanCard
                  key={plan.type}
                  plan={plan}
                  isActive={selectedPlan === plan.type}
                  onSelect={setSelectedPlan}
                />
              ))}
            </div>

            <Button
              onClick={() => handleSubscribe(selectedPlan)}
              disabled={isSubscribing}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 text-lg"
            >
              {isSubscribing ? 'Activating...' : `Start ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Membership`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Membership automatically renews. Cancel anytime in your account settings.
            </p>
          </>
        )}
      </div>
    </div>
  );
}