import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, MapPin, Clock, Check, Star } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { cartStore } from '../components/stores/CartStore';
import { User } from '@/api/entities';
import { OrderSimulation } from '../components/simulation/OrderSimulation';
import { PriceDisplay } from '../components/utils/dd_currency';
import OptimizedImage from '../components/dd_OptimizedImage';
import { showToast } from '../components/common/ErrorBoundary';
import { createPageUrl } from '@/utils';

export default function MockCheckout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      const items = cartStore.loadFromStorage();
      if (items.length === 0) {
        navigate(createPageUrl('Cart'));
        return;
      }
      
      setCartItems(items);
      
      const userData = await User.me().catch(() => null);
      setUser(userData);
    } catch (error) {
      console.error('Error loading checkout data:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
    const deliveryFee = 3.50;
    const serviceFee = subtotal * 0.05;
    const tax = (subtotal + deliveryFee + serviceFee) * 0.08;
    const total = subtotal + deliveryFee + serviceFee + tax;

    return { subtotal, deliveryFee, serviceFee, tax, total };
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create fake order
      const order = await OrderSimulation.createFakeOrder(cartItems, user);
      
      // Clear cart
      cartStore.clear();
      
      // Navigate to order tracking
      navigate(createPageUrl(`MockOrderTracking?orderId=${order.id}`));
      
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Order failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const { subtotal, deliveryFee, serviceFee, tax, total } = calculateTotals();

  if (cartItems.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Delivery Address */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold">Delivery Address</h3>
          </div>
          <p className="text-gray-700">253 NE 2ND ST, Miami, FL 33132</p>
          <p className="text-sm text-gray-500 mt-1">Estimated delivery: 25-30 min</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Your Order</h3>
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <OptimizedImage
                src={item.dish.photos?.[0]}
                className="w-12 h-12 rounded-lg object-cover"
                alt={item.dish.name}
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.dish.name}</h4>
                <p className="text-sm text-gray-500">{item.dish.cook_name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  <PriceDisplay price={item.dish.price * item.quantity} className="text-black" />
                </p>
                <p className="text-sm text-gray-500">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold">Payment Method</h3>
          </div>
          <div className="space-y-2">
            {[
              { id: 'card', name: '**** **** **** 4242', icon: '💳' },
              { id: 'apple', name: 'Apple Pay', icon: '🍎' },
              { id: 'paypal', name: 'PayPal', icon: '🅿️' }
            ].map((method) => (
              <div
                key={method.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <span className="text-xl">{method.icon}</span>
                <span className="flex-1">{method.name}</span>
                {paymentMethod === method.id && <Check className="w-5 h-5 text-red-600" />}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <PriceDisplay price={subtotal} className="text-black" />
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <PriceDisplay price={deliveryFee} className="text-black" />
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <PriceDisplay price={serviceFee} className="text-black" />
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <PriceDisplay price={tax} className="text-black" />
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <PriceDisplay price={total} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Payment...
            </div>
          ) : (
            `Place Order • ${<PriceDisplay price={total} className="text-white" />}`
          )}
        </Button>
      </div>
    </div>
  );
}