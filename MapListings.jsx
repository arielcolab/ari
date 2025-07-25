
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Dish } from '@/api/entities';
import { LastCallEat } from '@/api/entities';
import { CookingClass } from '@/api/entities';
import { SurplusGrocery } from '@/api/entities';
import { Giveaway } from '@/api/entities';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, Search, List } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import { PriceDisplay } from '../components/utils/dd_currency';
import OptimizedImage from '../components/dd_OptimizedImage';

const MarkerPopupContent = ({ item, type }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const getDetails = () => {
    switch(type) {
      case 'dish': return { title: item.name, price: item.price, route: `DishDetails?id=${item.id}` };
      case 'last_call': return { title: item.food_title, price: item.discounted_price, route: `LastCallEatDetails?id=${item.id}` };
      case 'class': return { title: item.title, price: item.price, route: `ClassDetails?id=${item.id}` };
      case 'surplus': return { title: item.product_title, price: item.discounted_price, route: `SurplusGroceryDetails?id=${item.id}` };
      case 'giveaway': return { title: item.item_title, price: 0, route: `GiveawayDetails?id=${item.id}` };
      default: return { title: 'Unknown Item' };
    }
  };
  
  const details = getDetails();

  return (
    <div className="w-48">
      <OptimizedImage src={item.photo_url || item.image_url} className="w-full h-24 object-cover rounded-t-lg" />
      <div className="p-2">
        <h3 className="font-bold text-sm truncate">{details.title}</h3>
        <div className="flex justify-between items-center mt-2">
          {details.price > 0 ? <PriceDisplay price={details.price} /> : <span className="text-green-600 font-bold">{t('free', 'Free')}</span>}
          <Button size="sm" onClick={() => navigate(createPageUrl(details.route))}>{t('view', 'View')}</Button>
        </div>
      </div>
    </div>
  );
};


const CustomMarkerIcon = ({ imageUrl, title }) => {
  return L.divIcon({
    className: 'custom-map-marker-container',
    html: `
      <div class="custom-map-marker">
        <img src="${imageUrl}" alt="${title}" />
      </div>
    `
  });
};


export default function MapListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const [dishes, lastCalls, classes, surplus, giveaways] = await Promise.all([
          Dish.list().catch(() => []),
          LastCallEat.list().catch(() => []),
          CookingClass.list().catch(() => []),
          SurplusGrocery.list().catch(() => []),
          Giveaway.list().catch(() => [])
        ]);

        const allListings = [
          ...dishes.map(item => ({ ...item, type: 'dish' })),
          ...lastCalls.map(item => ({ ...item, type: 'last_call' })),
          ...classes.map(item => ({ ...item, type: 'class' })),
          ...surplus.map(item => ({ ...item, type: 'surplus' })),
          ...giveaways.map(item => ({ ...item, type: 'giveaway' }))
        ];
        
        const geoListings = allListings.filter(item => item.latitude && item.longitude);
        setListings(geoListings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
      setIsLoading(false);
    };

    fetchListings();
  }, []);
  
  const telAvivPosition = [32.0853, 34.7818];

  return (
    <>
    <style>{`
      .custom-map-marker-container {
        border: none;
        background: transparent;
      }
      .custom-map-marker {
        background-color: white;
        border: 2px solid white;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 4px;
        position: relative;
        transform: translate(-50%, -100%);
      }
      .custom-map-marker img {
        width: 52px;
        height: 52px;
        object-fit: cover;
        border-radius: 10px;
      }
      .custom-map-marker::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 12px;
        padding: 0;
      }
      .leaflet-popup-content {
        margin: 0;
      }
      .leaflet-popup-tip {
        background: white;
      }
    `}</style>
    <div className="h-screen w-screen relative">
      {/* NOTE: This page intentionally has no GlobalHeader - it's fullscreen */}
      
      {isLoading && (
         <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[1001]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
         </div>
      )}

      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col gap-2 items-end">
             <Button variant="default" className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-800 hover:bg-gray-100 p-3">
               <Filter className="w-5 h-5" />
             </Button>
             <Button variant="default" className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-800 hover:bg-gray-100 p-3">
               <Search className="w-5 h-5" />
             </Button>
             <Button variant="default" className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-800 hover:bg-gray-100 p-3">
               <List className="w-5 h-5" />
             </Button>
        </div>
      </div>

      <MapContainer center={telAvivPosition} zoom={14} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map(item => (
          <Marker
            key={`${item.type}-${item.id}`}
            position={[item.latitude, item.longitude]}
            icon={CustomMarkerIcon({
                imageUrl: item.photo_url || item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100',
                title: item.name || item.title || item.food_title || item.product_title || 'Listing'
            })}
          >
            <Popup>
                <MarkerPopupContent item={item} type={item.type} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
    </>
  );
}
