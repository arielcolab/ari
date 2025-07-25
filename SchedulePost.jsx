
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ selectedDate, onDateSelect, currentMonth, onMonthChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = new Date().getFullYear();
  const daysInMonth = getDaysInMonth(year, currentMonth);
  const firstDay = getFirstDayOfMonth(year, currentMonth);
  // `today` and `currentMonthIndex` are used to mark the actual current day/month
  const today = new Date().getDate();
  const currentMonthIndex = new Date().getMonth();

  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
  }

  // Days of the month - initial push without full styling, which is applied in the map below
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(day)}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onMonthChange(currentMonth - 1)}>
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {months[currentMonth]} {year}
        </h3>
        <button onClick={() => onMonthChange(currentMonth + 1)}>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="w-10 h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (React.isValidElement(day)) {
            // Check if it's a button element representing a day
            const dayNumber = Number(day.key); // Convert key to number, as it was pushed as a number
            const isSelected = selectedDate === dayNumber;
            // Mark 'today' if the displayed month is the actual current month
            const isToday = new Date().getDate() === dayNumber && new Date().getMonth() === currentMonth;
            
            return React.cloneElement(day, {
              className: `w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                isSelected 
                  ? 'bg-red-500 text-white' 
                  : isToday 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            });
          }
          return day; // For empty divs
        })}
      </div>
    </div>
  );
};

const TimePicker = ({ selectedTime, onTimeChange }) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  const periods = ['AM', 'PM'];

  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Select Time</h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Hours */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Hour</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {hours.map(hour => (
              <button
                key={hour}
                onClick={() => onTimeChange({ ...selectedTime, hour })}
                className={`w-full p-2 text-sm rounded ${
                  selectedTime.hour === hour 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Min</div>
          <div className="space-y-1">
            {minutes.map(minute => (
              <button
                key={minute}
                onClick={() => onTimeChange({ ...selectedTime, minute })}
                className={`w-full p-2 text-sm rounded ${
                  selectedTime.minute === minute 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* AM/PM */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Period</div>
          <div className="space-y-1">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => onTimeChange({ ...selectedTime, period })}
                className={`w-full p-2 text-sm rounded ${
                  selectedTime.period === period 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SchedulePost() {
  const navigate = useNavigate();
  // Initialize selected date to the current date if no specific date is selected, or a default
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  // Initialize current month to the current month (0-indexed)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 0, period: 'AM' });
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleMonthChange = (newMonth) => {
    // Logic to loop months (December to January, January to December)
    if (newMonth < 0) {
      setCurrentMonth(11); // Go to December
    } else if (newMonth > 11) {
      setCurrentMonth(0); // Go to January
    } else {
      setCurrentMonth(newMonth);
    }
    // When month changes, selectedDate should ideally reset or check validity for new month
    // For now, keep the selectedDate as is, assuming it handles out-of-bounds gracefully or will be re-selected.
    // A more robust implementation might reset setSelectedDate(1) or last valid day of month.
  };

  const handleSchedulePost = () => {
    // In a real app, you'd save the scheduled post here
    console.log({
      date: selectedDate,
      month: currentMonth,
      time: selectedTime,
      dishName,
      description,
      price
    });
    navigate(-1); // Navigate back after scheduling
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Schedule Post</h1>
        <div></div> {/* Placeholder for right-aligned item if needed */}
      </div>

      <div className="p-4 space-y-6">
        {/* Date Selection */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Date</h2>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Time Selection */}
        <TimePicker
          selectedTime={selectedTime}
          onTimeChange={setSelectedTime}
        />

        {/* Dish Details */}
        <div className="space-y-4">
          <Input
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Dish Name"
            className="bg-gray-100 border-0 rounded-xl h-12"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="bg-gray-100 border-0 rounded-xl h-24 resize-none"
          />
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
            step="0.01"
            className="bg-gray-100 border-0 rounded-xl h-12"
          />
        </div>

        {/* Schedule Button */}
        <Button
          onClick={handleSchedulePost}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-2xl text-lg"
        >
          Schedule Post
        </Button>
      </div>
    </div>
  );
}
