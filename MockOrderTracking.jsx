import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock, User } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { OrderSimulation, useOrderSimulation } from '../components/simulation/OrderSimulation';
import OptimizedImage from '../components/dd_OptimizedImage';
import { PriceDisplay } from '../components/utils/dd_currency';
import { showToast } from '../components/common/ErrorBoundary';
import { createPageUrl } from '@/utils';

export default function MockOrderTracking() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { activeOrders } = useOrderSimulation();
  const [order, setOrder] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const foundOrder = activeOrders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [activeOrders, orderId]);

  const handleCall = (person) => {
    showToast(`Calling ${person}...`, 'info');
    setTimeout(() => showToast(`${person} is busy right now`, 'info'), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'cooking': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'nearby': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    if (!order) return 0;
    return Math.min(((order.currentStep + 1) / order.timeline.length) * 100, 100);
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Order not found</div>
      </div>
    );
  }

  const currentStatus = order.timeline[order.currentStep];
  const nextStatus = order.timeline[order.currentStep + 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('Home'))}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Order #{order.id.slice(-6)}</h1>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Banner */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {currentStatus.title}
          </div>
          <h2 className="text-lg font-semibold mt-2">{currentStatus.subtitle}</h2>
          {nextStatus && (
            <p className="text-gray-500 text-sm mt-1">
              Next: {nextStatus.title} at {new Date(nextStatus.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          )}
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Order placed</span>
              <span>Delivered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Map Button */}
        {['out_for_delivery', 'nearby'].includes(order.status) && (
          <Button
            onClick={() => navigate(createPageUrl(`MockDeliveryMap?orderId=${order.id}`))}
            className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-xl h-12"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Track on Map
          </Button>
        )}

        {/* Chef Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <OptimizedImage
              src={order.chef.avatar}
              className="w-16 h-16 rounded-full"
              alt={order.chef.name}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{order.chef.name}</h3>
              <p className="text-sm text-gray-500">{order.chef.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{order.chef.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowChat(true)}
                className="rounded-full"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCall(order.chef.name)}
                className="rounded-full"
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Driver Info (when out for delivery) */}
        {['picked_up', 'out_for_delivery', 'nearby'].includes(order.status) && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Your Driver</h4>
            <div className="flex items-center gap-4">
              <OptimizedImage
                src={order.driver.avatar}
                className="w-16 h-16 rounded-full"
                alt={order.driver.name}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{order.driver.name}</h3>
                <p className="text-sm text-gray-500">{order.driver.vehicle} • {order.driver.currentLocation}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{order.driver.rating}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowChat(true)}
                  className="rounded-full"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCall(order.driver.name)}
                  className="rounded-full"
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Order Details</h4>
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <OptimizedImage
                src={item.dish.photos?.[0]}
                className="w-12 h-12 rounded-lg object-cover"
                alt={item.dish.name}
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.dish.name}</h4>
                <p className="text-sm text-gray-500">x{item.quantity}</p>
              </div>
              <PriceDisplay price={item.dish.price * item.quantity} className="text-black font-medium" />
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <PriceDisplay price={order.total} className="text-black" />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Order Timeline</h4>
          <div className="space-y-3">
            {order.timeline.map((step, index) => {
              const isPast = index <= order.currentStep;
              const isCurrent = index === order.currentStep;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isPast ? 'bg-red-600' : 'bg-gray-300'
                  } ${isCurrent ? 'animate-pulse' : ''}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className={`text-sm ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.subtitle}
                    </p>
                  </div>
                  <p className={`text-sm ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
                    {isPast ? new Date(step.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                     new Date(step.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mock Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowChat(false)}>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl h-96"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold">Chat</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                Done
              </Button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <OptimizedImage src={order.chef.avatar} className="w-8 h-8 rounded-full" />
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-[80%]">
                    <p className="text-sm">Your order is being prepared with care! 👨‍🍳</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-red-600 text-white rounded-2xl px-4 py-2 max-w-[80%]">
                    <p className="text-sm">Thank you! Can't wait to try it 😊</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Type a message..."
                />
                <Button className="bg-red-600 hover:bg-red-700 rounded-2xl px-6">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}