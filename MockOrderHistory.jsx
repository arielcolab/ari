import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Star, Clock } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { useOrderSimulation } from '../components/simulation/OrderSimulation';
import { cartStore } from '../components/stores/CartStore';
import OptimizedImage from '../components/dd_OptimizedImage';
import { PriceDisplay } from '../components/utils/dd_currency';
import { showToast } from '../components/common/ErrorBoundary';
import { createPageUrl } from '@/utils';

export default function MockOrderHistory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orderHistory, activeOrders } = useOrderSimulation();
  const [showRating, setShowRating] = useState(null);
  const [rating, setRating] = useState(5);

  const handleReorder = (order) => {
    // Clear current cart and add items from this order
    cartStore.clear();
    order.items.forEach(item => {
      cartStore.addItem(item.dish, item.quantity, item.dish.type);
    });
    showToast('Items added to cart!', 'success');
    navigate(createPageUrl('Cart'));
  };

  const handleRate = (order) => {
    setShowRating(order.id);
  };

  const submitRating = () => {
    showToast('Thank you for your rating!', 'success');
    setShowRating(null);
  };

  const allOrders = [...activeOrders, ...orderHistory].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Order History</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {allOrders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">When you place orders, they'll show up here</p>
          </div>
        ) : (
          allOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                  order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'delivered' ? 'Delivered' : 
                   order.status === 'out_for_delivery' ? 'In Progress' : 'Processing'}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <OptimizedImage
                      src={item.dish.photos?.[0]}
                      className="w-10 h-10 rounded-lg object-cover"
                      alt={item.dish.name}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.dish.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-500 pl-13">
                    +{order.items.length - 2} more items
                  </p>
                )}
              </div>

              {/* Chef Info */}
              <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                <OptimizedImage
                  src={order.chef.avatar}
                  className="w-8 h-8 rounded-full"
                  alt={order.chef.name}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{order.chef.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{order.chef.rating}</span>
                  </div>
                </div>
                <PriceDisplay price={order.total} className="text-black font-medium" />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleReorder(order)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
                
                {order.status === 'delivered' && (
                  <Button
                    onClick={() => handleRate(order)}
                    className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate Order
                  </Button>
                )}

                {order.status !== 'delivered' && (
                  <Button
                    onClick={() => navigate(createPageUrl(`MockOrderTracking?orderId=${order.id}`))}
                    className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    Track Order
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowRating(null)}>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-center mb-6">Rate Your Order</h3>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star 
                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Tell us about your experience..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none h-20 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setShowRating(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                onClick={submitRating}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}