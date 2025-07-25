import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MessageCircle, Navigation } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { useOrderSimulation } from '../components/simulation/OrderSimulation';
import OptimizedImage from '../components/dd_OptimizedImage';
import { showToast } from '../components/common/ErrorBoundary';

export default function MockDeliveryMap() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { activeOrders } = useOrderSimulation();
  const [order, setOrder] = useState(null);
  const [driverPosition, setDriverPosition] = useState({ lat: 0, lng: 0 });
  const [eta, setEta] = useState(8);
  const mapRef = useRef(null);

  useEffect(() => {
    const foundOrder = activeOrders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      setDriverPosition(foundOrder.location.restaurant);
    }
  }, [activeOrders, orderId]);

  useEffect(() => {
    if (!order) return;

    // Animate driver movement
    const animateDriver = () => {
      const restaurant = order.location.restaurant;
      const customer = order.location.customer;
      
      // Calculate movement based on order progress
      const progress = Math.min((order.currentStep + 1) / order.timeline.length, 1);
      const adjustedProgress = Math.max(progress - 0.4, 0) / 0.6; // Start moving after 40% progress
      
      const newLat = restaurant.lat + (customer.lat - restaurant.lat) * adjustedProgress;
      const newLng = restaurant.lng + (customer.lng - restaurant.lng) * adjustedProgress;
      
      setDriverPosition({ lat: newLat, lng: newLng });
      setEta(Math.max(1, Math.round(8 * (1 - adjustedProgress))));
    };

    const interval = setInterval(animateDriver, 2000);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Delivery Map</h1>
            <p className="text-sm text-gray-500">ETA: {eta} minutes</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-green-100 to-blue-100">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 600">
            {/* Streets */}
            <line x1="0" y1="200" x2="400" y2="200" stroke="#ccc" strokeWidth="2"/>
            <line x1="0" y1="350" x2="400" y2="350" stroke="#ccc" strokeWidth="2"/>
            <line x1="100" y1="0" x2="100" y2="600" stroke="#ccc" strokeWidth="2"/>
            <line x1="250" y1="0" x2="250" y2="600" stroke="#ccc" strokeWidth="2"/>
            
            {/* Buildings */}
            <rect x="20" y="120" width="60" height="60" fill="#ddd" rx="4"/>
            <rect x="150" y="270" width="80" height="60" fill="#ddd" rx="4"/>
            <rect x="300" y="150" width="70" height="80" fill="#ddd" rx="4"/>
          </svg>
        </div>

        {/* Restaurant Marker */}
        <div 
          className="absolute w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg transform -translate-x-3 -translate-y-3 z-20"
          style={{
            left: `${(order.location.restaurant.lng - 34.7718) * 10000 + 200}px`,
            top: `${400 - (order.location.restaurant.lat - 32.0753) * 10000}px`
          }}
        >
          <div className="absolute -top-8 -left-6 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Restaurant
          </div>
        </div>

        {/* Customer Marker */}
        <div 
          className="absolute w-6 h-6 bg-green-600 rounded-full border-2 border-white shadow-lg transform -translate-x-3 -translate-y-3 z-20"
          style={{
            left: `${(order.location.customer.lng - 34.7718) * 10000 + 200}px`,
            top: `${400 - (order.location.customer.lat - 32.0753) * 10000}px`
          }}
        >
          <div className="absolute -top-8 -left-6 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            You
          </div>
        </div>

        {/* Driver Marker - Animated */}
        <div 
          className="absolute z-30 transform -translate-x-4 -translate-y-4 transition-all duration-2000 ease-in-out"
          style={{
            left: `${(driverPosition.lng - 34.7718) * 10000 + 200}px`,
            top: `${400 - (driverPosition.lat - 32.0753) * 10000}px`
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
              <Navigation className="w-4 h-4 text-white fill-current" />
            </div>
            <div className="absolute -top-12 -left-8 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
              {order.driver.name}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d={`M ${(order.location.restaurant.lng - 34.7718) * 10000 + 200} ${400 - (order.location.restaurant.lat - 32.0753) * 10000} 
                Q ${(driverPosition.lng - 34.7718) * 10000 + 200} ${400 - (driverPosition.lat - 32.0753) * 10000}
                  ${(order.location.customer.lng - 34.7718) * 10000 + 200} ${400 - (order.location.customer.lat - 32.0753) * 10000}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Bottom Driver Info */}
      <div className="bg-white p-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <OptimizedImage
            src={order.driver.avatar}
            className="w-12 h-12 rounded-full"
            alt={order.driver.name}
          />
          <div className="flex-1">
            <h3 className="font-semibold">{order.driver.name}</h3>
            <p className="text-sm text-gray-500">
              {order.driver.vehicle} • {eta} min away
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => showToast('Opening chat...', 'info')}
              className="rounded-full"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => showToast(`Calling ${order.driver.name}...`, 'info')}
              className="rounded-full"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}