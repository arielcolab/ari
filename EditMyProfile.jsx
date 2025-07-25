import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react';
import { ProfileManager } from '../components/utils/ProfileManager';
import { User } from '@/api/entities';
import OptimizedImage from '../components/dd_OptimizedImage';
import { showToast } from '../components/common/ErrorBoundary';
import { useTranslation } from '../components/utils/translations';

export default function EditMyProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    photo: '',
    city: '',
    bio: '',
    interests: []
  });
  
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      if (!userData) {
        showToast(t('loginRequired', 'Please log in to edit your profile'), 'error');
        navigate(-1);
        return;
      }
      
      setUser(userData);
      const userProfile = await ProfileManager.getCurrentUserProfile();
      setProfile(userProfile);
      
      setFormData({
        fullName: userProfile.fullName || '',
        photo: userProfile.photo || '',
        city: userProfile.city || '',
        bio: userProfile.bio || '',
        interests: userProfile.interests || []
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
      showToast(t('errorLoadingProfile', 'Failed to load profile'), 'error');
      navigate(-1);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      showToast(t('fullNameRequired', 'Full name is required'), 'error');
      return;
    }

    setIsSaving(true);
    try {
      await ProfileManager.updateCurrentUserProfile(formData);
      showToast(t('profileUpdated', 'Profile updated successfully!'), 'success');
      navigate(-1);
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast(t('errorUpdatingProfile', 'Failed to update profile'), 'error');
    }
    setIsSaving(false);
  };

  const handlePhotoUpload = () => {
    // For now, we'll use a placeholder URL generator
    // In a real app, this would open a file picker and upload to cloud storage
    const newPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random&size=200`;
    handleInputChange('photo', newPhotoUrl);
    showToast('Profile photo updated!', 'success');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-xl font-semibold">Profile Not Found</h2>
        <Button onClick={() => navigate(-1)} className="mt-6">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">{t('editProfile', 'Edit Profile')}</h1>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSaving ? t('saving', 'Saving...') : t('save', 'Save')}
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <OptimizedImage
              src={formData.photo}
              alt={formData.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <Button
              onClick={handlePhotoUpload}
              size="icon"
              className="absolute -bottom-2 -right-2 rounded-full bg-red-600 hover:bg-red-700 w-8 h-8"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">{t('tapToChangePhoto', 'Tap to change photo')}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">{t('fullName', 'Full Name')} *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder={t('enterFullName', 'Enter your full name')}
              className="mt-1"
            />
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city">{t('city', 'City')}</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder={t('enterCity', 'Enter your city')}
              className="mt-1"
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">{t('bio', 'Bio')}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder={t('tellAboutYourself', 'Tell us about yourself...')}
              className="mt-1 h-24"
            />
          </div>

          {/* Interests */}
          <div>
            <Label>{t('interests', 'Interests')}</Label>
            <div className="mt-2">
              {/* Add Interest Input */}
              <div className="flex gap-2 mb-3">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('addInterest', 'Add an interest...')}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddInterest}
                  variant="outline"
                  size="icon"
                  disabled={!newInterest.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Interest Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{interest}</span>
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:bg-red-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {formData.interests.length === 0 && (
                <p className="text-gray-500 text-sm">{t('noInterestsYet', 'No interests added yet')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="mt-8 sm:hidden">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-red-600 hover:bg-red-700 h-12"
          >
            {isSaving ? t('saving', 'Saving...') : t('saveChanges', 'Save Changes')}
          </Button>
        </div>
      </div>
    </div>
  );
}