import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliveryService } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Star, MapPin, Clock, Truck } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';

const ServiceCard = ({ service }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <div className="flex items-start gap-4">
        <img
          src={service.photo_url || service.provider_avatar_url}
          alt={service.service_title}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{service.service_title}</h3>
              <p className="text-sm text-gray-600">{service.provider_name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{service.rating_average || '4.8'}</span>
                <span className="text-xs text-gray-500">({service.rating_count || '12'})</span>
              </div>
              <p className="text-lg font-bold text-green-600">₪{service.price_per_delivery}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{service.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{service.service_areas?.[0] || 'Local Area'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{service.availability_hours || '9:00-21:00'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span className="capitalize">{service.vehicle_type || 'car'}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {service.delivery_types?.map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <Button
        onClick={() => navigate(createPageUrl(`DeliveryServiceDetails?id=${service.id}`))}
        className="w-full mt-4 bg-red-500 hover:bg-red-600"
      >
        {t('viewDetails')}
      </Button>
    </div>
  );
};

export default function DeliveryServices() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const allServices = await DeliveryService.list('-rating_average');
      setServices(allServices);
    } catch (error) {
      console.error('Error loading delivery services:', error);
    }
    setIsLoading(false);
  };

  const filteredServices = services.filter(service =>
    searchTerm === '' ||
    service.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('deliveryServices')}</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="חפש שירותי משלוחים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 rounded-xl"
          />
        </div>
      </div>

      <div className="p-4">
        {filteredServices.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">אין שירותי משלוחים זמינים</h3>
            <p className="text-gray-500">נסה לחפש במילות מפתח אחרות או חזור מאוחר יותר</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        )}
      </div>
    </div>
  );
}