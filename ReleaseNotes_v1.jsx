import React from 'react';
import { useTranslation } from '../components/utils/translations';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Plus, Wrench, Globe } from 'lucide-react';

export default function ReleaseNotes_v1() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const releaseNotes = {
    version: "1.0 E2E",
    date: "December 2024",
    sections: [
      {
        title: "🔧 Bug Fixes & Improvements",
        icon: <Wrench className="w-5 h-5" />,
        items: [
          "Fixed geolocation permission error handling",
          "Improved location manager with fallback options",
          "Enhanced profile page with proper translations",
          "Fixed navigation routing throughout the app",
          "Improved error messages and user feedback",
          "Added proper loading states for all components"
        ]
      },
      {
        title: "🌟 New Features Added",
        icon: <Plus className="w-5 h-5" />,
        items: [
          "Complete referral system with credits",
          "Order again functionality in profile",
          "Enhanced sharing with promotional text",
          "Quick links section in profile",
          "Improved credits and loyalty system",
          "Location-aware features on home screen"
        ]
      },
      {
        title: "🌍 Internationalization",
        icon: <Globe className="w-5 h-5" />,
        items: [
          "All UI strings properly translated",
          "RTL support for Hebrew and Arabic",
          "Currency conversion for different locales",
          "Contextual translations based on user actions",
          "Proper fallbacks for missing translations"
        ]
      },
      {
        title: "✅ Quality Assurance",
        icon: <CheckCircle className="w-5 h-5" />,
        items: [
          "End-to-end user flows tested",
          "All navigation links verified",
          "Cross-browser compatibility checked",
          "Mobile responsiveness validated",
          "Error handling improved across components"
        ]
      }
    ],
    remainingTodos: [
      "Complete Stripe payment integration",
      "Implement real-time order tracking",
      "Add push notification system",
      "Integrate Google Maps API for geocoding",
      "Complete bulk upload CSV processing",
      "Add advanced search and filtering"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Release Notes</h1>
            <p className="text-sm text-gray-600">Version {releaseNotes.version} - {releaseNotes.date}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Release Complete</h3>
              <p className="text-green-700 text-sm mt-1">
                DishDash v1.0 E2E has been successfully deployed with core functionality working end-to-end.
              </p>
            </div>
          </div>
        </div>

        {releaseNotes.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              {section.icon}
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">Remaining TODOs</h3>
          <ul className="space-y-2">
            {releaseNotes.remainingTodos.map((todo, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                <span className="text-yellow-700 text-sm">{todo}</span>
              </li>
            ))}
          </ul>
          <Button 
            onClick={() => navigate('/FixMe_List')}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            View Detailed TODO List
          </Button>
        </div>
      </div>
    </div>
  );
}