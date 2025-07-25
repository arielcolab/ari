import React from 'react';
import { useTranslation } from '../components/utils/translations';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function FixMe_List() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fixMeItems = [
    {
      id: 1,
      title: "WhatsApp Share Function",
      description: "The WhatsApp share modal needs proper implementation with working share buttons",
      status: "pending",
      priority: "high",
      component: "dd_WhatsAppShare.jsx"
    },
    {
      id: 2,
      title: "Location Manager Geocoding",
      description: "Replace mock geocoding with real Google Maps API or similar service",
      status: "pending",
      priority: "medium",
      component: "LocationManager.jsx"
    },
    {
      id: 3,
      title: "Payment Integration",
      description: "Complete Stripe payment integration for all checkout flows",
      status: "in-progress",
      priority: "high",
      component: "PaymentCheckout.js"
    },
    {
      id: 4,
      title: "Real-time Order Tracking",
      description: "Implement WebSocket or polling for live order status updates",
      status: "pending",
      priority: "medium",
      component: "OrderTracking.js"
    },
    {
      id: 5,
      title: "Image Upload Optimization",
      description: "Add image compression and CDN integration for better performance",
      status: "pending",
      priority: "low",
      component: "PhotoUpload.jsx"
    },
    {
      id: 6,
      title: "Push Notifications",
      description: "Implement web push notifications for order updates and promotions",
      status: "pending",
      priority: "medium",
      component: "NotificationSettings.js"
    },
    {
      id: 7,
      title: "Bulk Upload CSV Processing",
      description: "Complete the CSV/Excel parsing and validation for restaurant bulk uploads",
      status: "pending",
      priority: "medium",
      component: "dd_BulkUpload.js"
    },
    {
      id: 8,
      title: "Advanced Search Filters",
      description: "Implement complex filtering logic with proper database queries",
      status: "pending",
      priority: "high",
      component: "Search.js"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Development TODOs</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800">Development Notes</h3>
              <p className="text-yellow-700 text-sm mt-1">
                This page lists items that need completion or improvement. Remove this page before production deployment.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {fixMeItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Component: {item.component}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}