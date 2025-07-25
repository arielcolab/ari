import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, CreditCard, Gift, MessageSquare, Check } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { cartStore } from '../components/stores/CartStore';
import { PriceDisplay } from '../components/utils/dd_currency';
import { showToast } from '../components/common/ErrorBoundary';
import { OrderSimulation } from '../components/simulation/OrderSimulation';
import { User } from '@/api/entities';
import OptimizedImage from '../components/dd_OptimizedImage';

export default function EnhancedCheckout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState('address'); // address, timing, payment, summary
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [deliveryTime, setDeliveryTime] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const items = cartStore.loadFromStorage();
    setCartItems(items);
    
    // Mock address
    setSelectedAddress({
      id: '1',
      label: 'Home',
      address: '68 Hashiloah St, Apartment 2, Door code: 6868#',
      city: 'Tel Aviv'
    });
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const serviceFee = subtotal * 0.05;
  const deliveryFee = deliveryOption === 'delivery' ? (subtotal > 50 ? 0 : 16.00) : 0;
  const discount = promoCode ? 16.00 : 0;
  const total = subtotal + serviceFee + deliveryFee - discount;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const user = await User.me().catch(() => ({ id: 'guest', full_name: 'Guest User' }));
      
      // Create order through simulation
      await OrderSimulation.createFakeOrder(cartItems, user);
      
      // Clear cart
      cartStore.clear();
      
      // Navigate to order confirmation with tracking
      navigate('/MockOrderTracking?newOrder=true');
      showToast('Order placed successfully!', 'success');
    } catch (error) {
      console.error('Order error:', error);
      showToast('Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderAddressStep = () => (
    <div className="space-y-4">
      {/* Delivery/Pickup Toggle */}
      <div className="flex bg-gray-100 rounded-full p-1">
        <Button
          variant={deliveryOption === 'delivery' ? 'default' : 'ghost'}
          className={`flex-1 rounded-full ${deliveryOption === 'delivery' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setDeliveryOption('delivery')}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Delivery
        </Button>
        <Button
          variant={deliveryOption === 'pickup' ? 'default' : 'ghost'}
          className={`flex-1 rounded-full ${deliveryOption === 'pickup' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setDeliveryOption('pickup')}
        >
          Pickup
        </Button>
      </div>

      {deliveryOption === 'delivery' && (
        <>
          {/* Address Selection */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{selectedAddress?.address}</h3>
                  <p className="text-sm text-gray-500">{selectedAddress?.city}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
          </div>

          {/* Floor/Apartment Info */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Floor: 1</h3>
                <p className="text-sm text-gray-500">Apartment: 2, Door code: 6868#</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">Edit</Button>
            </div>
          </div>

          {/* Send as Gift Option */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Send as a gift</span>
              <Button variant="ghost" size="sm" className="ml-auto">Setup</Button>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-700">Instructions for the courier</span>
            </div>
            <textarea
              placeholder="Add delivery instructions..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none h-20 text-sm"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderTimingStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">When?</h3>
      
      {/* Standard Delivery Option */}
      <div className={`bg-white rounded-xl p-4 border-2 ${deliveryTime === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryTime === 'standard' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
              {deliveryTime === 'standard' && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h4 className="font-semibold">Standard</h4>
              <p className="text-sm text-gray-500">30-40 min</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setDeliveryTime('standard')}
            className="text-blue-500"
          >
            Select
          </Button>
        </div>
      </div>

      {/* Schedule Option (Disabled) */}
      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
            <div>
              <h4 className="font-semibold text-gray-500">Schedule</h4>
              <p className="text-sm text-gray-400">Currently unavailable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Payment</h3>
      
      {/* Payment Method */}
      <div className="bg-white rounded-xl p-4 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold">Card •••• 9288</h4>
              <p className="text-sm text-gray-500">Will be charged for <PriceDisplay price={total} /></p>
            </div>
          </div>
          <Button variant="ghost" size="sm">Change</Button>
        </div>
      </div>

      {/* Promo Code */}
      <div className="bg-white rounded-xl p-4 border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">W</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">Redeem code</h4>
            <input
              type="text"
              placeholder="Enter gift card or promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="text-sm text-gray-500 bg-transparent border-none outline-none w-full mt-1"
            />
          </div>
          <Button variant="ghost" size="sm">Apply</Button>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Summary</h3>
      <p className="text-sm text-gray-500">incl. taxes (if applicable)</p>
      
      <a href="#" className="text-blue-500 text-sm font-medium">How fees work</a>
      
      <div className="space-y-3 py-4">
        <div className="flex justify-between">
          <span>Item subtotal</span>
          <PriceDisplay price={subtotal} />
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <PriceDisplay price={serviceFee} />
        </div>
        <div className="flex justify-between">
          <div>
            <span>Delivery (95 m)</span>
            <p className="text-xs text-gray-500">Delivery provided by Restaurant</p>
          </div>
          <div className="text-right">
            {deliveryFee > 0 && <span className="text-gray-400 line-through text-sm"><PriceDisplay price={16.00} /></span>}
            <div><PriceDisplay price={deliveryFee} /></div>
          </div>
        </div>
        <hr />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <PriceDisplay price={total} />
        </div>
        {discount > 0 && (
          <>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Applied offers</span>
              <span>-<PriceDisplay price={discount} /></span>
            </div>
            <p className="text-sm text-gray-500">₪0 delivery fee</p>
          </>
        )}
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <Button onClick={() => navigate('/Home')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Restaurant Name</h1>
              <p className="text-sm text-gray-500">Currently unavailable</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-32">
        {currentStep === 'address' && renderAddressStep()}
        {currentStep === 'timing' && renderTimingStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'summary' && renderSummary()}
      </div>

      {/* Bottom Confirmation Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={currentStep === 'summary' ? handlePlaceOrder : () => {
            if (currentStep === 'address') setCurrentStep('timing');
            else if (currentStep === 'timing') setCurrentStep('payment');
            else if (currentStep === 'payment') setCurrentStep('summary');
          }}
          disabled={isProcessing}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg rounded-xl"
        >
          {isProcessing ? 'Processing...' : 
           currentStep === 'summary' ? 'Slide to confirm' : 'Continue'}
        </Button>
        {currentStep === 'timing' && (
          <p className="text-center text-sm text-gray-500 mt-2">Currently unavailable</p>
        )}
      </div>
    </div>
  );
}