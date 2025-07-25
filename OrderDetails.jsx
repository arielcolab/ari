import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/api/entities";
import { Dish } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, CheckCircle2, Clock, Truck } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";

const TimelineStep = ({ icon: Icon, title, timestamp, isCompleted, isActive, description }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isCompleted ? 'bg-green-500' : isActive ? 'bg-red-500' : 'bg-gray-200'
      }`}>
        <Icon className={`w-5 h-5 ${
          isCompleted || isActive ? 'text-white' : 'text-gray-400'
        }`} />
      </div>
      <div className="w-0.5 h-8 bg-gray-200 mt-2" />
    </div>
    <div className="flex-1 pb-8">
      <h3 className={`font-semibold ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'}`}>
        {title}
      </h3>
      {timestamp && (
        <p className="text-sm text-gray-500 mt-1">
          {new Date(timestamp).toLocaleString()}
        </p>
      )}
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  </div>
);

export default function OrderDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [dish, setDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

      // Load order and dish details
      const orders = await Order.list();
      const foundOrder = orders.find(o => o.id === orderId);
      
      if (!foundOrder) {
        navigate(-1);
        return;
      }

      setOrder(foundOrder);

      // Load associated dish
      const dishes = await Dish.list();
      const foundDish = dishes.find(d => d.id === foundOrder.dish_id);
      setDish(foundDish);

    } catch (error) {
      console.error("Error loading order details:", error);
    }
    setIsLoading(false);
  };

  const getTimelineSteps = () => {
    const baseSteps = [
      {
        id: 'pending',
        icon: Clock,
        title: 'Order Placed',
        description: 'Waiting for cook confirmation'
      },
      {
        id: 'confirmed',
        icon: CheckCircle2,
        title: 'Order Confirmed',
        description: 'Cook has accepted your order'
      },
      {
        id: 'in-progress',
        icon: Clock,
        title: 'Preparing',
        description: 'Your meal is being prepared'
      },
      {
        id: 'ready',
        icon: CheckCircle2,
        title: 'Ready',
        description: order?.delivery_method === 'self-pickup' ? 'Ready for pickup' : 'Ready for delivery'
      }
    ];

    if (order?.delivery_method !== 'self-pickup') {
      baseSteps.push({
        id: 'delivered',
        icon: Truck,
        title: 'Delivered',
        description: 'Order delivered successfully'
      });
    }

    return baseSteps;
  };

  const getStepStatus = (stepId) => {
    const statusOrder = ['pending', 'confirmed', 'in-progress', 'ready', 'delivered', 'completed'];
    const currentIndex = statusOrder.indexOf(order?.status);
    const stepIndex = statusOrder.indexOf(stepId);
    
    return {
      isCompleted: stepIndex < currentIndex,
      isActive: stepIndex === currentIndex
    };
  };

  const getStepTimestamp = (stepId) => {
    const statusHistory = order?.status_history || [];
    const step = statusHistory.find(s => s.status === stepId);
    return step?.timestamp;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Order #{order.id.slice(-8)}
            </h1>
            <p className="text-sm text-gray-500">
              {order.delivery_method === 'self-pickup' ? 'Self Pickup' : 'Delivery'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(createPageUrl(`Messages?userId=${order.cook_id}&orderId=${order.id}`))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Cook
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          {dish && (
            <div className="flex items-center gap-3">
              <img 
                src={dish.photos?.[0]} 
                alt={dish.name}
                className="w-16 h-16 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{dish.name}</h3>
                <p className="text-sm text-gray-600">{t('by')} {dish.cook_name}</p>
                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">${order.total_amount.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-0">
            {getTimelineSteps().map((step) => {
              const { isCompleted, isActive } = getStepStatus(step.id);
              const timestamp = getStepTimestamp(step.id);
              
              return (
                <TimelineStep
                  key={step.id}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  timestamp={timestamp}
                  isCompleted={isCompleted}
                  isActive={isActive}
                />
              );
            })}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">
            {order.delivery_method === 'self-pickup' ? 'Pickup Information' : 'Delivery Information'}
          </h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-600">Method: </span>
              <span className="text-gray-900">
                {order.delivery_method === 'self-pickup' ? 'Self Pickup' : 'Delivery'}
              </span>
            </p>
            {order.delivery_address && (
              <p className="text-sm">
                <span className="text-gray-600">Address: </span>
                <span className="text-gray-900">{order.delivery_address}</span>
              </p>
            )}
            <p className="text-sm">
              <span className="text-gray-600">Payment: </span>
              <span className="text-gray-900 capitalize">{order.payment_method}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}