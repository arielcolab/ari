import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/api/entities";
import { Dish } from "@/api/entities";
import { User } from "@/api/entities";
import { Review } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReviewForm from "../components/reviews/ReviewForm";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";

export default function OrderReview() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [dish, setDish] = useState(null);
  const [existingReviews, setExistingReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadOrderDetails();
  }, []);

  const loadOrderDetails = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');
      
      if (!orderId) {
        navigate(-1);
        return;
      }

      const [orderData, userData] = await Promise.all([
        Order.list().then(orders => orders.find(o => o.id === orderId)),
        User.me()
      ]);

      if (!orderData) {
        showToast("Order not found", "error");
        navigate(-1);
        return;
      }

      const dishData = await Dish.list().then(dishes => 
        dishes.find(d => d.id === orderData.dish_id)
      );

      // Check for existing reviews
      const allReviews = await Review.list();
      const dishReview = allReviews.find(r => 
        r.order_id === orderId && r.dish_id === orderData.dish_id
      );
      const cookReview = allReviews.find(r => 
        r.order_id === orderId && r.cook_id === dishData?.created_by
      );

      setOrder(orderData);
      setDish(dishData);
      setUser(userData);
      setExistingReviews({
        dish: dishReview,
        cook: cookReview
      });
    } catch (error) {
      console.error("Error loading order details:", error);
      showToast("Error loading order details", "error");
      navigate(-1);
    }
    setIsLoading(false);
  };

  const handleReviewSubmitted = () => {
    loadOrderDetails(); // Reload to get updated reviews
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!order || !dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  // Prevent self-review
  const canReviewCook = user && dish.created_by !== user.id;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Review Your Order</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Order Details</h2>
          <div className="flex gap-4">
            <img
              src={dish.photos?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
              alt={dish.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{dish.name}</h3>
              <p className="text-sm text-gray-600">by {dish.cook_name}</p>
              <p className="text-sm text-gray-500">
                Order #{order.id.slice(-8)} • ${order.total_amount}
              </p>
            </div>
          </div>
        </div>

        {/* Dish Review */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate the Dish</h2>
          <ReviewForm
            dishId={dish.id}
            orderId={order.id}
            existingReview={existingReviews.dish}
            onSubmitted={handleReviewSubmitted}
          />
        </div>

        {/* Cook Review */}
        {canReviewCook && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate the Cook</h2>
            <ReviewForm
              cookId={dish.created_by}
              orderId={order.id}
              existingReview={existingReviews.cook}
              onSubmitted={handleReviewSubmitted}
            />
          </div>
        )}

        {!canReviewCook && (
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-gray-600 text-center">
              You cannot review your own cooking
            </p>
          </div>
        )}
      </div>
    </div>
  );
}