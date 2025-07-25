import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Terms of Service</h1>
        </div>
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using DishDash, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              As a user of DishDash, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate and truthful information about food items</li>
              <li>Ensure food safety and hygiene standards</li>
              <li>Respect other users and maintain appropriate communication</li>
              <li>Comply with local food service regulations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Food Safety</h2>
            <p className="text-gray-700 leading-relaxed">
              All food providers must follow proper food safety guidelines, including proper storage, preparation, and handling of food items. DishDash is not responsible for food-related illness or injury.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              DishDash facilitates payments between buyers and sellers. We charge a service fee for transactions processed through our platform. Refunds are handled according to our Refund Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              DishDash serves as a platform connecting food providers and consumers. We are not responsible for the quality, safety, or legality of food items, the truth or accuracy of listings, or the ability of users to complete transactions.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}