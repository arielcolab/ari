import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Smartphone, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { cartStore } from '../components/stores/CartStore';
import { Payment } from '@/api/entities';
import { Order } from '@/api/entities';
import { User } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    loadCartAndUser();
  }, []);

  const loadCartAndUser = async () => {
    try {
      const items = cartStore.loadFromStorage();
      if (items.length === 0) {
        navigate(createPageUrl("Cart"));
        return;
      }
      setCartItems(items);

      const userData = await User.me();
      setUser(userData);
      if (userData.address) {
        setDeliveryAddress(userData.address);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Please log in to continue', 'error');
      navigate(createPageUrl('Profile'));
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.dish.price * item.quantity, 0);
    const deliveryFee = 2.99;
    const platformFee = Math.round(subtotal * 0.05 * 100) / 100; // 5% platform fee
    const total = subtotal + deliveryFee + platformFee;
    
    return { subtotal, deliveryFee, platformFee, total };
  };

  const createPaymentIntent = async (orderData) => {
    try {
      // This would be a backend API call to create Stripe Payment Intent
      // For demo, we'll simulate it
      const { total } = calculateTotals();
      const amountInCents = Math.round(total * 100);
      const platformFeeInCents = Math.round(calculateTotals().platformFee * 100);

      const mockPaymentIntent = {
        id: `pi_${Math.random().toString(36).substr(2, 16)}`,
        client_secret: `pi_${Math.random().toString(36).substr(2, 16)}_secret_${Math.random().toString(36).substr(2, 16)}`,
        amount: amountInCents,
        currency: 'usd',
        status: 'requires_payment_method'
      };

      // Create payment record
      const payment = await Payment.create({
        order_id: orderData.id,
        buyer_id: user.id,
        cook_id: cartItems[0].dish.cook_id || user.id, // Assuming single cook per order
        stripe_payment_intent_id: mockPaymentIntent.id,
        amount: amountInCents,
        application_fee: platformFeeInCents,
        cook_amount: amountInCents - platformFeeInCents,
        currency: 'usd',
        status: 'pending',
        payment_method: paymentMethod,
        client_secret: mockPaymentIntent.client_secret
      });

      return { paymentIntent: mockPaymentIntent, payment };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      // Validate form
      if (!deliveryAddress.trim()) {
        showToast('Please enter a delivery address', 'error');
        return;
      }

      if (paymentMethod === 'card') {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          showToast('Please fill in all card details', 'error');
          return;
        }
      }

      const { total } = calculateTotals();

      // Create order first
      const order = await Order.create({
        dish_id: cartItems[0].dish.id, // Simplified for single item
        quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: total,
        delivery_method: 'delivery',
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        cook_id: cartItems[0].dish.cook_id || user.id,
        delivery_fee: calculateTotals().deliveryFee,
        service_fee: calculateTotals().platformFee,
        status: 'pending'
      });

      // Create payment intent
      const { paymentIntent, payment } = await createPaymentIntent(order);

      // Simulate payment processing
      showToast('Processing payment...', 'info');
      
      // Simulate successful payment after 2 seconds
      setTimeout(async () => {
        try {
          // Update payment status
          await Payment.update(payment.id, {
            status: 'succeeded'
          });

          // Update order status
          await Order.update(order.id, {
            status: 'confirmed'
          });

          // Clear cart
          cartStore.clear();
          
          showToast('Payment successful! Order confirmed.', 'success');
          navigate(createPageUrl(`OrderConfirmation?orderId=${order.id}`));
        } catch (error) {
          console.error('Error updating payment status:', error);
          showToast('Payment processing error', 'error');
        }
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      showToast('Payment failed. Please try again.', 'error');
    }
    setIsProcessing(false);
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Secure Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.dish.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.dish.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.dish.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <Label htmlFor="address" className="text-lg font-semibold text-gray-900 mb-4 block">
            Delivery Address
          </Label>
          <Input
            id="address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="card"
                name="payment_method"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-red-500"
              />
              <Label htmlFor="card" className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="apple_pay"
                name="payment_method"
                value="apple_pay"
                checked={paymentMethod === 'apple_pay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-red-500"
              />
              <Label htmlFor="apple_pay" className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Apple Pay
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="google_pay"
                name="payment_method"
                value="google_pay"
                checked={paymentMethod === 'google_pay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-red-500"
              />
              <Label htmlFor="google_pay" className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Google Pay
              </Label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <Input
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="bg-white border-gray-200"
              />
              <Input
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                className="bg-white border-gray-200"
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="bg-white border-gray-200"
                  maxLength={5}
                />
                <Input
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  className="bg-white border-gray-200"
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>${totals.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span>${totals.platformFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Secure Payment</p>
            <p className="text-sm text-green-700">Your payment information is encrypted and secure. We use Stripe for payment processing.</p>
          </div>
        </div>

        <Button
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-2xl text-lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Processing Payment...
            </>
          ) : (
            `Pay $${totals.total.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}