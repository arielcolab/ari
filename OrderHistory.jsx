import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { dd_Order as Order } from '@/api/entities';
import { Dish } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { createPageUrl } from '@/utils';
import OptimizedImage from '../components/dd_OptimizedImage';
import { PriceDisplay } from '../components/utils/dd_currency';

const OrderItem = ({ order, dish }) => {
    const navigate = useNavigate();
    if (!dish) return null;

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm" onClick={() => navigate(createPageUrl(`OrderDetails?id=${order.id}`))}>
            <div className="flex items-start gap-4">
                <OptimizedImage src={dish.photo_url} alt={dish.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                    <p className="text-sm text-gray-500">{new Date(order.created_date).toLocaleDateString()}</p>
                    <h3 className="font-semibold text-gray-900">{dish.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{dish.cook_name}</p>
                    <div className="flex justify-between items-center mt-2">
                        <PriceDisplay price={order.amount_total} className="font-bold" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OrderHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [dishes, setDishes] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const user = await User.me();
                const userOrders = await Order.filter({ buyer_id: user.id }, "-created_date");
                setOrders(userOrders);

                const dishIds = [...new Set(userOrders.map(o => o.dish_id))];
                const dishPromises = dishIds.map(id => Dish.get(id).catch(() => null));
                const fetchedDishes = await Promise.all(dishPromises);
                
                const dishMap = fetchedDishes.reduce((acc, dish) => {
                    if (dish) acc[dish.id] = dish;
                    return acc;
                }, {});
                setDishes(dishMap);

            } catch (error) {
                console.error("Failed to load order history", error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className="text-xl font-semibold text-gray-900">Orders & Returns</h1>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {orders.length > 0 ? (
                    orders.map(order => <OrderItem key={order.id} order={order} dish={dishes[order.dish_id]} />)
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <p>You haven't placed any orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}