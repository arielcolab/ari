
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react'; // Added MapPin icon
import { useTranslation } from '../components/utils/translations';
import { Address } from '@/api/entities';
import { showToast } from '../components/common/ErrorBoundary';

export default function AddAddress() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false); // New state for location fetching
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(null); // null: not tried, true: granted, false: denied/error

  useEffect(() => {
    // Pre-fetch existing addresses for duplicate check
    const fetchAddresses = async () => {
      const addresses = await Address.list();
      setExistingAddresses(addresses || []);
    };
    fetchAddresses();
  }, []);

  const handleSaveAddress = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Validate required fields
      if (!newAddress.street.trim() || !newAddress.city.trim()) {
        showToast(t('pleaseEnterAddressDetails', 'Please enter street and city'), 'error');
        setIsSaving(false);
        return;
      }

      // Check for duplicates
      const fullAddress = `${newAddress.street}, ${newAddress.city}`;
      const isDuplicate = existingAddresses.some(addr => 
        `${addr.street}, ${addr.city}`.toLowerCase() === fullAddress.toLowerCase()
      );

      if (isDuplicate) {
        showToast(t('addressAlreadyExists', 'This address already exists'), 'error');
        setIsSaving(false);
        return;
      }

      // Create new address
      await Address.create({
        ...newAddress,
        label: newAddress.label.trim() || `${newAddress.street}`
      });
      
      showToast(t('addressAdded', 'Address added successfully'), 'success');
      navigate(-1); // Go back to the previous screen

    } catch (error) {
      console.error('Error adding address:', error);
      showToast(t('errorAddingAddress', 'Error adding address'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles fetching the current user's location using Geolocation API
   * and attempting to pre-fill address fields.
   */
  const handleUseCurrentLocation = () => {
    if (isLocating) return; // Prevent multiple clicks while locating

    if (!('geolocation' in navigator)) {
      showToast(t('geolocationNotSupported', 'Geolocation is not supported by your browser.'), 'error');
      setLocationPermissionGranted(false);
      return;
    }

    setIsLocating(true);
    showToast(t('fetchingLocation', 'Fetching your location...'), 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real application, you would integrate with a reverse geocoding API here
        // (e.g., Google Maps Geocoding API, OpenStreetMap Nominatim, etc.)
        // to convert latitude/longitude into a street address, city, state, etc.
        // For this demonstration, we'll fill with mock data based on coordinates and show how it would integrate.
        setNewAddress(prev => ({
          ...prev,
          street: t('mockStreet', `(Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)})`), // Example: Street derived from coords
          city: t('mockCity', 'Fetched City'),
          state: t('mockState', 'Fetched State'),
          zip_code: t('mockZip', '00000'),
          country: t('mockCountry', 'Fetched Country')
        }));
        showToast(t('locationFetchedSuccess', 'Location fetched successfully! Please review details.'), 'success');
        setLocationPermissionGranted(true);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = t('failedToFetchLocation', 'Failed to fetch location.');
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = t('locationPermissionDenied', 'Location access denied. Please enable it in your browser settings.');
          setLocationPermissionGranted(false); // User denied permission
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = t('locationUnavailable', 'Location information is unavailable.');
          setLocationPermissionGranted(false); // Location source error
        } else if (error.code === error.TIMEOUT) {
          errorMessage = t('locationTimeout', 'The request to get user location timed out.');
        }
        showToast(errorMessage, 'error');
        setLocationPermissionGranted(false); // Set to false on any error
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true, // Request more accurate position
        timeout: 10000, // Maximum time (ms) to wait for a position
        maximumAge: 0 // Force retrieval of a fresh position, no cached data
      }
    );
  };

  /**
   * Determines the text to display on the "Use Current Location" button.
   */
  const getLocationButtonText = () => {
    if (isLocating) return t('locating', 'Locating...');
    if (locationPermissionGranted === false) return t('tryAgainOrManual', 'Location Denied / Try Again');
    return t('useCurrentLocation', 'Use Current Location');
  };

  /**
   * Determines the variant/color of the "Use Current Location" button based on permission status.
   */
  const getLocationButtonVariant = () => {
    if (locationPermissionGranted === false) return 'destructive'; // Red if permission denied
    return 'outline'; // Default outline for normal state
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm p-4 border-b border-gray-200 flex items-center gap-4 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">{t('addNewAddress', 'Add New Address')}</h1>
      </header>

      {/* Form Content */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t('addressLabel', 'Label (e.g. Home, Work)')}
            value={newAddress.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
          
          {/* New "Use Current Location" button */}
          <Button 
            onClick={handleUseCurrentLocation}
            className="w-full h-12 text-md flex items-center justify-center gap-2"
            variant={getLocationButtonVariant()}
            disabled={isLocating}
          >
            <MapPin className="w-5 h-5" />
            {getLocationButtonText()}
          </Button>

          <input
            type="text"
            placeholder={t('streetAddress', 'Street Address')}
            value={newAddress.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('city', 'City')}
              value={newAddress.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder={t('state', 'State')}
              value={newAddress.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('zipCode', 'Zip Code')}
              value={newAddress.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
            <input
              type="text"
              placeholder={t('country', 'Country')}
              value={newAddress.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
        </div>
      </main>

      {/* Footer Button */}
      <footer className="p-4 sticky bottom-0 bg-white border-t border-gray-200">
        <Button 
          onClick={handleSaveAddress}
          className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
          disabled={isSaving}
        >
          {isSaving ? t('saving', 'Saving...') : t('saveAddress', 'Save Address')}
        </Button>
      </footer>
    </div>
  );
}
