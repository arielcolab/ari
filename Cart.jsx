
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { cartStore } from "../components/stores/CartStore";
import { showToast } from "../components/common/ErrorBoundary";
import OptimizedImage from "../components/dd_OptimizedImage";
import { PriceDisplay } from "../components/utils/dd_currency";
import CheckoutButton from '../components/cart/CheckoutButton'; // Added new import

const CartItem = ({ item, onUpdate, onRemove }) => {
  const { t } = useTranslation();
  const mainPhoto = item.dish.photos?.[0] || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&auto=format&fit=crop";
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <OptimizedImage
          src={mainPhoto}
          alt={item.dish.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.dish.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{item.dish.cook_name}</p>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              <span className="text-black">
                <PriceDisplay price={item.dish.price * item.quantity} className="text-black" />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdate(item.dish.id, item.quantity - 1)}
                className="h-8 w-8 rounded-full"
                disabled={item.dish.type === 'class' || item.dish.type === 'meal_prep' || item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[2rem] text-center bg-gray-50 px-2 py-1 rounded">
                {item.quantity}
              </span>
              <Button
                variant="outline" 
                size="icon"
                onClick={() => onUpdate(item.dish.id, item.quantity + 1)}
                className="h-8 w-8 rounded-full"
                disabled={item.dish.type === 'class' || item.dish.type === 'meal_prep'}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.dish.id)}
                className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// OrderSummaryRow is now likely used internally by CheckoutButton or not directly used in Cart
// const OrderSummaryRow = ({ label, value, isTotal = false, isPromo = false }) => (
//   <div className={`flex justify-between ${isTotal ? 'text-lg font-bold border-t border-gray-200 pt-3' : 'text-gray-600'} ${isPromo ? 'text-green-600' : ''}`}>
//     <span>{label}</span>
//     <span className={isTotal ? 'text-black' : ''}>{value}</span>
//   </div>
// );

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Load cart items on mount
    loadCartItems();
    
    // Subscribe to cart updates
    const unsubscribe = cartStore.subscribe((items) => {
      setCartItems([...items]);
    });

    return unsubscribe;
  }, []);

  const loadCartItems = () => {
    try {
      const items = cartStore.loadFromStorage();
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  };

  const updateQuantity = (dishId, newQuantity) => {
    try {
      cartStore.updateQuantity(dishId, newQuantity);
      showToast(t('quantityUpdated', 'Quantity updated'), 'success');
    } catch (error) {
      console.error("Error updating quantity:", error);
      showToast(t('errorUpdatingQuantity', 'Error updating quantity'), 'error');
    }
  };

  const removeFromCart = (dishId) => {
    try {
      cartStore.removeItem(dishId);
      showToast(t('itemRemovedFromCart', 'Item removed from cart'), 'success');
    } catch (error) {
      console.error("Error removing item:", error);
      showToast(t('errorRemovingItem', 'Error removing item'), 'error');
    }
  };

  const applyPromoCode = () => {
    // Simple promo code logic - in real app this would be server-side
    const validPromoCodes = {
      'SAVE10': 0.10,
      'WELCOME15': 0.15,
      'FIRST20': 0.20
    };
    
    if (validPromoCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(validPromoCodes[promoCode.toUpperCase()]);
      showToast(t('promoApplied', 'Promo code applied!'), 'success');
    } else {
      showToast(t('invalidPromo', 'Invalid promo code'), 'error');
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful checkout
      cartStore.clear();
      
      // Show success message
      showToast(t('orderPlaced', 'Order placed successfully!'), 'success');
      
      // Navigate to order confirmation
      navigate(createPageUrl('OrderConfirmation'));
    } catch (error) {
      console.error("Checkout error:", error);
      showToast(t('checkoutError', 'Checkout failed. Please try again.'), 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const promoAmount = subtotal * promoDiscount;
  const discountedSubtotal = subtotal - promoAmount;
  
  // Additional fees
  const serviceFee = subtotal > 0 ? subtotal * 0.05 : 0; // 5% service fee
  const processingFee = subtotal > 0 ? 1.99 : 0; // $1.99 processing fee
  const deliveryFee = discountedSubtotal > 0 ? (discountedSubtotal >= 25 ? 0 : 2.99) : 0;
  const tax = (discountedSubtotal + serviceFee + processingFee + deliveryFee) * 0.08; // 8% tax
  
  const total = discountedSubtotal + serviceFee + processingFee + deliveryFee + tax; // Renamed from grandTotal to total

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('yourCartIsEmpty', 'Your cart is empty')}</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          {t('yourCartIsEmptyDesc', 'Looks like you haven\'t added anything to your cart yet.')}
        </p>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3 h-12 text-base font-semibold"
          onClick={() => navigate(createPageUrl('Home'))}
        >
          {t('startShopping', 'Start Shopping')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24"> {/* Added pb-24 for spacing */}
      {/* Page Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{t('cart', 'Cart')}</h1>
            <p className="text-sm text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? t('item', 'item') : t('items', 'items')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-96">
        {/* Cart Items */}
        {cartItems.map(item => (
          <CartItem key={item.dish.id} item={item} onUpdate={updateQuantity} onRemove={removeFromCart} />
        ))}

        {/* Promo Code Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">{t('promoCode', 'Promo Code')}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('enterPromoCode', 'Enter promo code')}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Button 
              onClick={applyPromoCode}
              variant="outline"
              disabled={!promoCode.trim()}
            >
              {t('apply', 'Apply')}
            </Button>
          </div>
          {promoDiscount > 0 && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {t('promoAppliedSuccess', `${(promoDiscount * 100).toFixed(0)}% discount applied!`)}
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {deliveryFee === 0 ? 
                t('freeDeliveryUnlocked', 'Free delivery unlocked!') : 
                t('freeDeliveryAt', `Free delivery on orders over $25`)
              }
            </span>
          </div>
        </div>
      </div>

      {/* Replace bottom checkout section with CheckoutButton component */}
      <CheckoutButton 
        total={total} 
        itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        disabled={isCheckingOut}
        onCheckout={handleCheckout} // Pass the handleCheckout function to the button
        promoDiscount={promoDiscount} // Pass promo discount for display logic
        subtotal={subtotal} // Pass subtotal for summary rows
        promoAmount={promoAmount}
        serviceFee={serviceFee}
        processingFee={processingFee}
        deliveryFee={deliveryFee}
        tax={tax}
      />
    </div>
  );
}
