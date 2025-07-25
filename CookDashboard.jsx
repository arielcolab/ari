import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/api/entities";
import { Dish } from "@/api/entities";
import { Review } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Clock, Star, Plus, Eye, Edit3 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";

const StatCard = ({ icon: Icon, title, value, subtitle, onClick }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="bg-red-100 p-2 rounded-lg">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const OrderItem = ({ order, dish, onUpdateStatus }) => {
  const { t } = useTranslation();
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'confirmed',
      'confirmed': 'in-progress',
      'in-progress': 'ready',
      'ready': order.delivery_method === 'self-pickup' ? 'completed' : 'delivered',
      'delivered': 'completed'
    };
    return statusFlow[currentStatus];
  };

  const getNextActionLabel = (currentStatus) => {
    const labels = {
      'pending': 'Confirm Order',
      'confirmed': 'Start Preparing',
      'in-progress': 'Mark as Ready',
      'ready': order.delivery_method === 'self-pickup' ? 'Mark as Picked Up' : 'Mark as Delivered',
      'delivered': 'Complete Order'
    };
    return labels[currentStatus];
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
      <img 
        src={dish?.photos?.[0]} 
        alt={dish?.name}
        className="w-12 h-12 rounded-lg object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{dish?.name}</h4>
        <p className="text-sm text-gray-600">Qty: {order.quantity} • ${order.total_amount.toFixed(2)}</p>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      {order.status !== 'completed' && (
        <Button 
          size="sm" 
          onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {getNextActionLabel(order.status)}
        </Button>
      )}
    </div>
  );
};

const DishItem = ({ dish, onToggleAvailability, onEdit }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
      <img 
        src={dish.photos?.[0]} 
        alt={dish.name}
        className="w-12 h-12 rounded-lg object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{dish.name}</h4>
        <p className="text-sm text-gray-600">${dish.price} • {dish.quantity} available</p>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          dish.available_today ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {dish.available_today ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(dish)}>
          <Edit3 className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onToggleAvailability(dish.id, !dish.available_today)}
          className={dish.available_today ? 'text-red-600' : 'text-green-600'}
        >
          {dish.available_today ? 'Mark Sold Out' : 'Mark Available'}
        </Button>
      </div>
    </div>
  );
};

export default function CookDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [myDishes, setMyDishes] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load dishes created by this cook
      const allDishes = await Dish.list('-created_date');
      const cookDishes = allDishes.filter(dish => dish.created_by === currentUser.id);
      setMyDishes(cookDishes);

      // Load orders for this cook's dishes
      const allOrders = await Order.list('-created_date');
      const cookOrders = allOrders.filter(order => 
        cookDishes.some(dish => dish.id === order.dish_id)
      );
      setMyOrders(cookOrders);

      // Load reviews for this cook
      const allReviews = await Review.list('-created_date');
      const cookReviews = allReviews.filter(review => 
        review.cook_id === currentUser.id
      );
      setMyReviews(cookReviews);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = myOrders.find(o => o.id === orderId);
      const statusHistory = order.status_history || [];
      statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: `Status updated to ${newStatus}`
      });

      await Order.update(orderId, { 
        status: newStatus, 
        status_history: statusHistory 
      });
      
      // Reload orders
      loadDashboardData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleToggleDishAvailability = async (dishId, available) => {
    try {
      await Dish.update(dishId, { available_today: available });
      loadDashboardData();
    } catch (error) {
      console.error("Error updating dish availability:", error);
    }
  };

  const activeOrders = myOrders.filter(order => 
    !['delivered', 'completed'].includes(order.status)
  );

  const averageRating = myReviews.length > 0 
    ? (myReviews.reduce((sum, review) => sum + review.rating, 0) / myReviews.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Cook Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.full_name}!</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={TrendingUp}
            title="Active Dishes"
            value={myDishes.filter(d => d.available_today).length}
            subtitle="Available today"
            onClick={() => navigate(createPageUrl("MyDishes"))}
          />
          <StatCard
            icon={Clock}
            title="Pending Orders"
            value={activeOrders.length}
            subtitle="Need attention"
          />
          <StatCard
            icon={Star}
            title="Rating"
            value={averageRating}
            subtitle={`${myReviews.length} reviews`}
            onClick={() => navigate(createPageUrl("MyReviews"))}
          />
          <StatCard
            icon={TrendingUp}
            title="Total Orders"
            value={myOrders.length}
            subtitle="All time"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate(createPageUrl("PostDish"))}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Dish
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(createPageUrl("MyDishes"))}
              >
                <Eye className="w-4 h-4 mr-2" />
                View My Dishes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(createPageUrl("EarningsPayouts"))}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Earnings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeOrders.slice(0, 3).map((order) => {
                const dish = myDishes.find(d => d.id === order.dish_id);
                return (
                  <OrderItem
                    key={order.id}
                    order={order}
                    dish={dish}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                );
              })}
              {activeOrders.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{activeOrders.length - 3} more orders
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* My Dishes Preview */}
        {myDishes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Dishes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myDishes.slice(0, 3).map((dish) => (
                <DishItem
                  key={dish.id}
                  dish={dish}
                  onToggleAvailability={handleToggleDishAvailability}
                  onEdit={(dish) => navigate(createPageUrl(`PostDish?edit=${dish.id}`))}
                />
              ))}
              {myDishes.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(createPageUrl("MyDishes"))}
                >
                  View All {myDishes.length} Dishes
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}