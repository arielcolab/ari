
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Address } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ChevronRight, 
  Home, 
  Briefcase, 
  MapPin,
  Plus
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";

const AddressItem = ({ icon: Icon, label, address, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
    <div className="bg-gray-100 p-3 rounded-lg mr-4">
      <Icon className="w-5 h-5 text-gray-700" />
    </div>
    <div className="flex-1 text-left">
      <div className="font-semibold text-gray-900">{label}</div>
      <div className="text-sm text-gray-500">{address}</div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);

export default function SavedAddresses() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await Address.list("-created_date");
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
    setIsLoading(false);
  };

  const getIconForLabel = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("home")) return Home;
    if (lowerLabel.includes("work")) return Briefcase;
    return MapPin;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('savedAddresses')}</h1>
        </div>
      </div>

      <div className="flex-grow p-4 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{t('myAddresses')}</h2>
        {addresses.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            {t('noSavedAddresses')}
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <AddressItem
                key={addr.id}
                icon={getIconForLabel(addr.label)}
                label={addr.label}
                address={`${addr.street}, ${addr.city}`}
                onClick={() => navigate(createPageUrl(`EditAddress?id=${addr.id}`))}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 mt-auto">
         <Button
            onClick={() => navigate(createPageUrl("AddAddress"))}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-2xl h-14 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('addNewAddress')}
          </Button>
      </div>
    </div>
  );
}
