import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User as UserIcon, Mail, Shuffle } from "lucide-react";
import { createPageUrl } from "@/utils";
import { showToast } from "../components/common/ErrorBoundary";

const generateRandomEmail = () => {
  const names = ['alex', 'sarah', 'mike', 'emma', 'david', 'lisa', 'john', 'anna', 'chris', 'maya'];
  const domains = ['test.com', 'demo.app', 'example.org'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(Math.random() * 9999);
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomName}${randomNumber}@${randomDomain}`;
};

const generateRandomName = () => {
  const firstNames = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Anna', 'Chris', 'Maya'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Garcia', 'Miller', 'Taylor', 'Anderson', 'Thomas'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

export default function DevLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    bio: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleRandomize = () => {
    setFormData({
      email: generateRandomEmail(),
      full_name: generateRandomName(),
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      bio: `Food enthusiast who loves to cook and share delicious meals! 👨‍🍳`
    });
  };

  const handleQuickLogin = async (userType) => {
    setIsCreating(true);
    try {
      // Generate user data based on type
      let userData;
      if (userType === 'cook') {
        userData = {
          email: generateRandomEmail(),
          full_name: generateRandomName(),
          phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          bio: "Experienced home cook sharing authentic recipes and fresh meals with my community! 🍽️",
          is_cook: true,
          onboarding_completed: true
        };
      } else {
        userData = {
          email: generateRandomEmail(),
          full_name: generateRandomName(),
          phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          bio: "Food lover always looking for amazing homemade dishes! 🥘",
          is_cook: false,
          onboarding_completed: true
        };
      }

      // Create user account (simulated)
      await User.updateMyUserData(userData);
      
      showToast(`Welcome ${userData.full_name}! Account created successfully.`, 'success');
      navigate(createPageUrl("Home"));
      
    } catch (error) {
      console.error("Error creating test account:", error);
      showToast('Error creating account. Please try again.', 'error');
    }
    setIsCreating(false);
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.full_name) {
      showToast('Email and name are required', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const userData = {
        ...formData,
        onboarding_completed: true
      };

      await User.updateMyUserData(userData);
      showToast(`Welcome ${userData.full_name}! Account created successfully.`, 'success');
      navigate(createPageUrl("Home"));
      
    } catch (error) {
      console.error("Error creating custom account:", error);
      showToast('Error creating account. Please try again.', 'error');
    }
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Development Login</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-1">Testing Mode</h3>
          <p className="text-sm text-blue-700">
            This is a development tool for easy testing. Choose a quick login or create a custom profile.
          </p>
        </div>

        {/* Quick Login Options */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Quick Login</h2>
          
          <Button
            onClick={() => handleQuickLogin('cook')}
            disabled={isCreating}
            className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 h-12"
          >
            <UserIcon className="w-5 h-5" />
            Login as Random Cook
          </Button>
          
          <Button
            onClick={() => handleQuickLogin('buyer')}
            disabled={isCreating}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 h-12"
          >
            <UserIcon className="w-5 h-5" />
            Login as Random Buyer
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or create custom profile</span>
          </div>
        </div>

        {/* Custom Profile Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="test@example.com"
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleRandomize}
                className="px-3"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="John Doe"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio (optional)</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about yourself..."
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isCreating}
            className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
          >
            {isCreating ? "Creating Account..." : "Create Custom Profile"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This bypasses normal authentication for testing. In production, users would go through proper signup/login flows.
          </p>
        </div>
      </div>
    </div>
  );
}