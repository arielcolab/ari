
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderTracking() {
  const navigate = useNavigate();
  const [deliveryStatus] = useState("in-progress");
  const [estimatedTime] = useState("15-20 min");

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/80 backdrop-blur-sm rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Map */}
      <div className="h-2/3">
        <MapContainer
          center={[37.7749, -122.4194]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[37.7749, -122.4194]}>
            <Popup>Your delivery location</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Status Card */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b120"
            alt="Delivery person"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">Delivery in progress</h3>
            <p className="text-sm text-gray-600">Estimated arrival: {estimatedTime}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className="font-medium text-red-500">On the way</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full w-3/4 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
