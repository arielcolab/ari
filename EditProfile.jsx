import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";
import { showToast } from "../components/common/ErrorBoundary";
import { UploadFile } from "@/api/integrations";

export default function EditProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    bio: "",
    profile_photo_url: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        username: userData.username || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        profile_photo_url: userData.profile_photo_url || ""
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      showToast('Error loading profile data', 'error');
      navigate(createPageUrl("Profile"));
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPEG, PNG)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5MB', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const result = await UploadFile({ file });
      handleInputChange('profile_photo_url', result.file_url);
      showToast('Avatar updated!', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast('Error uploading image. Please try again.', 'error');
    }
    setIsUploadingAvatar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      showToast('Full name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      await User.updateMyUserData(formData);
      showToast('Profile updated successfully!', 'success');
      navigate(createPageUrl("Profile"));
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast('Error updating profile. Please try again.', 'error');
    }
    setSaving(false);
  };

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('editProfile')}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={formData.profile_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={isUploadingAvatar}
              />
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="flex items-center gap-2" disabled={isUploadingAvatar}>
                  <Camera className="w-4 h-4" />
                  {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
                </Button>
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          
          <div>
            <Label htmlFor="full_name" className="text-gray-700 font-medium">{t('fullName')} *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 bg-gray-50 border-gray-200 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="username" className="text-gray-700 font-medium">{t('username')}</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="@username"
              className="mt-1 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium">{t('phoneNumber')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself, your cooking style, favorite cuisines..."
              className="mt-1 bg-gray-50 border-gray-200 rounded-xl h-24 resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            {isSaving ? t('saving') : t('saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
}