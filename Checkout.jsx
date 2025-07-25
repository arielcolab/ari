
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { createPageUrl } from "@/utils";
import { cartStore } from "../components/stores/CartStore";
import { showToast } from "../components/common/ErrorBoundary";
import { User } from "@/api/entities";
import { PriceDisplay } from "../components/utils/dd_currency";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const items = cartStore.loadFromStorage();
    if (items.length === 0) {
      navigate(createPageUrl("Cart"));
      return;
    }
    setCartItems(items);
    
    User.me().then(userData => {
        if (userData) {
            setUser(userData);
            if (userData.address) {
                setDeliveryAddress(userData.address);
            }
        }
    }).catch(() => {/* User not logged in, continue without pre-filled address */});

  }, [navigate]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.dish.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return 2.99;
  };

  const getTipAmount = () => {
    return tipAmount;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTipAmount();
  };

  const handleTipSelect = (amount) => {
    setTipAmount(amount);
    setCustomTip("");
  };

  const handleCustomTipChange = (value) => {
    setCustomTip(value);
    const numValue = parseFloat(value) || 0;
    setTipAmount(numValue);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      showToast('Please enter a delivery address', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      cartStore.clear();
      showToast('Order placed successfully!', 'success');
      
      // Correctly navigate to the confirmation page ONLY after a successful order.
      navigate(createPageUrl("OrderConfirmation"));
    } catch (error) {
      console.error('Order failed:', error);
      showToast('Order failed. Please try again.', 'error');
    }
    setIsProcessing(false);
  };

  const suggestedTips = [
    { label: "15%", amount: getSubtotal() * 0.15 },
    { label: "18%", amount: getSubtotal() * 0.18 },
    { label: "20%", amount: getSubtotal() * 0.20 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Order Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Your Order</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.dish.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.dish.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <PriceDisplay price={item.dish.price * item.quantity} className="font-semibold" />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Address
          </h3>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              className="mt-1"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Label htmlFor="card">Credit Card</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="cash"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Label htmlFor="cash">Cash on Delivery</Label>
            </div>
          </div>
        </div>

        {/* Tip Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Add Tip</h3>
          <p className="text-sm text-gray-600 mb-4">Show your appreciation for great food!</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {suggestedTips.map((tip, index) => (
              <Button
                key={index}
                variant={tipAmount.toFixed(2) === tip.amount.toFixed(2) ? "default" : "outline"}
                onClick={() => handleTipSelect(tip.amount)}
                className={tipAmount.toFixed(2) === tip.amount.toFixed(2) ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
                {tip.label}
                <br />
                <PriceDisplay price={tip.amount} className="text-xs" />
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="custom-tip" className="text-sm">Custom tip:</Label>
            <Input
              id="custom-tip"
              type="number"
              step="0.01"
              min="0"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
              placeholder="0.00"
              className="w-24"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <PriceDisplay price={getSubtotal()} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <PriceDisplay price={getDeliveryFee()} />
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tip</span>
                <PriceDisplay price={getTipAmount()} />
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <PriceDisplay price={getTotal()} />
            </div>
          </div>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl text-lg"
        >
          {isProcessing ? 'Processing Order...' : <>Place Order - <PriceDisplay price={getTotal()} /></>}
        </Button>
      </div>
    </div>
  );
}
