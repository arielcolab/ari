import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const CalendarHeader = ({ currentMonth, onMonthChange }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => onMonthChange(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => onMonthChange(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
};

const CalendarGrid = ({ currentMonth, selectedDate, onDateClick }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map(day => (
                    <button
                        key={day.toString()}
                        onClick={() => onDateClick(day)}
                        className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm transition-colors
                            ${!isSameMonth(day, monthStart) ? 'text-gray-300' : ''}
                            ${isSameDay(day, selectedDate) ? 'bg-red-500 text-white' : ''}
                            ${!isSameDay(day, selectedDate) && isSameMonth(day, monthStart) ? 'hover:bg-gray-100' : ''}
                        `}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function MealPlanning() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const plannedDishes = [
        { id: 1, name: "Pasta Carbonara", image: "https://images.unsplash.com/photo-1608796837872-f3b333465d83" },
        { id: 2, name: "Fresh Garden Salad", image: "https://images.unsplash.com/photo-1550547660-d9450f859349" },
        { id: 3, name: "Tomato Bruschetta", image: "https://images.unsplash.com/photo-1505253716362-afb542c526b6" },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900">{t('mealPlanning')}</h1>
                </div>
            </div>

            <div className="p-4 space-y-8">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <CalendarHeader currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
                    <CalendarGrid currentMonth={currentMonth} selectedDate={selectedDate} onDateClick={setSelectedDate} />
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dishes')}</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                        {plannedDishes.map(dish => (
                            <div key={dish.id} className="w-32 flex-shrink-0">
                                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-2">
                                     <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 truncate">{dish.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('shoppingList')}</h2>
                    <Button variant="outline" className="w-full bg-white h-12">
                        <List className="w-5 h-5 mr-3" />
                        {t('generateShoppingList')}
                    </Button>
                </div>
            </div>
        </div>
    );
}