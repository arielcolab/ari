
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Address } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, MapPin, CreditCard, Search, ShoppingCart, Plus, CheckCircle2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";

const OnboardingStep = ({ step, title, children, onNext, onBack, isLastStep, nextDisabled }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? "bg-red-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{title}</h1>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Button>
          )}
          <Button 
            onClick={onNext} 
            disabled={nextDisabled}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            {isLastStep ? t('getStarted') : t('next')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    full_name: "",
    phone: "",
    bio: ""
  });
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
    label: "Home"
  });
  // New state to indicate if user data and a default address already exist, allowing quick completion
  const [canQuickComplete, setCanQuickComplete] = useState(false); 

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const user = await User.me();
        if (user?.onboarding_completed) {
          navigate(createPageUrl("Home"));
          return; // Exit early if onboarding is already completed
        }

        // User is logged in, but onboarding is not completed
        const prefilledUserData = {
          full_name: user?.full_name || "",
          phone: user?.phone || "",
          bio: user?.bio || ""
        };
        setUserData(prefilledUserData);

        let hasDefaultAddress = false;
        let prefilledAddressData = {
          street: "",
          city: "",
          state: "",
          zip_code: "",
          label: "Home"
        };

        try {
          // Attempt to fetch user's default address
          const defaultAddress = await Address.get_default();
          if (defaultAddress) {
            prefilledAddressData = {
              street: defaultAddress.street || "",
              city: defaultAddress.city || "",
              state: defaultAddress.state || "",
              zip_code: defaultAddress.zip_code || "",
              label: defaultAddress.label || "Home" // Preserve existing label
            };
            setAddressData(prefilledAddressData);
            hasDefaultAddress = true;
          }
        } catch (addressError) {
          // No default address found or error fetching it, which is acceptable for onboarding flow
          console.warn("No default address found or error fetching it for quick complete check:", addressError);
        }

        // Determine if quick completion is possible:
        // User must have full name, phone, and an existing default address with street and city
        if (prefilledUserData.full_name && prefilledUserData.phone && hasDefaultAddress && prefilledAddressData.street && prefilledAddressData.city) {
          setCanQuickComplete(true);
        } else {
          setCanQuickComplete(false); // Ensure it's false if conditions are not met
        }

      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // User not logged in, or token invalid. Redirect to home/login.
        navigate(createPageUrl("Home"));
      }
    };
    
    checkOnboarding();
  }, [navigate]);

  // Handler for the new "Complete Onboarding" button
  const handleQuickComplete = async () => {
    if (canQuickComplete) {
      await completeOnboarding();
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Update user data, marking onboarding as complete
      await User.updateMyUserData({
        ...userData,
        onboarding_completed: true
      });

      // Only create/update address if it was manually entered by the user during onboarding
      // and not already fetched as an existing default address (covered by !canQuickComplete)
      if (!canQuickComplete && addressData.street && addressData.city) {
        await Address.create({
          ...addressData,
          is_default: true // Assume any newly entered address should be the default
        });
      }

      showToast('Welcome to DishDash! 🎉', 'success');
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
      showToast('Error completing setup. Please try again.', 'error');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep
            step={1}
            title="Welcome to DishDash!"
            onNext={handleNext}
            onBack={handleBack}
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cf072fb66_b102d0cf-f2e2-44a6-8cc6-f4cf421f7dfe.jpeg" 
                  alt="DishDash Logo" 
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Discover Amazing Home-Cooked Meals</h3>
              <p className="text-gray-600">
                Connect with local cooks in your community. Order delicious homemade dishes or share your own culinary creations.
              </p>
              {/* Display "Complete Onboarding" button if user data and address are already complete */}
              {canQuickComplete && (
                <Button 
                  onClick={handleQuickComplete} 
                  className="w-full bg-green-500 hover:bg-green-600 mt-6"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t('quickCompleteOnboarding', 'Complete Onboarding')}
                </Button>
              )}
            </div>
          </OnboardingStep>
        );
      
      case 2:
        return (
          <OnboardingStep
            step={2}
            title="Tell us about yourself"
            onNext={handleNext}
            onBack={handleBack}
            // Next button is enabled if full name and phone are available (either pre-filled or manually entered)
            nextDisabled={!userData.full_name || !userData.phone}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={userData.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bio">Tell us about yourself (optional)</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData({...userData, bio: e.target.value})}
                  placeholder="I love trying new cuisines and sharing my family recipes..."
                  className="mt-1 h-20"
                />
              </div>
            </div>
          </OnboardingStep>
        );
      
      case 3:
        return (
          <OnboardingStep
            step={3}
            title="Add your delivery address"
            onNext={handleNext}
            onBack={handleBack}
            nextDisabled={!addressData.street || !addressData.city}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">This helps us show you nearby dishes</span>
              </div>
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={addressData.street}
                  onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                  placeholder="123 Main Street"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={addressData.city}
                    onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                    placeholder="San Francisco"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={addressData.state}
                    onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                    placeholder="CA"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  value={addressData.zip_code}
                  onChange={(e) => setAddressData({...addressData, zip_code: e.target.value})}
                  placeholder="94105"
                  className="mt-1"
                />
              </div>
            </div>
          </OnboardingStep>
        );
      
      case 4:
        return (
          <OnboardingStep
            step={4}
            title="How DishDash works"
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={true}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Search className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">1. Browse & Discover</h3>
                  <p className="text-sm text-gray-600">Find amazing homemade dishes from local cooks in your area</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2. Order & Enjoy</h3>
                  <p className="text-sm text-gray-600">Place your order and choose pickup or delivery</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">3. Share Your Food</h3>
                  <p className="text-sm text-gray-600">Post your own dishes and earn money from your cooking</p>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">You're all set!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Start exploring delicious homemade meals in your neighborhood
                </p>
              </div>
            </div>
          </OnboardingStep>
        );
      
      default:
        return null;
    }
  };

  return renderStep();
}
