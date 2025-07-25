import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../components/utils/ProfileManager';
import OptimizedImage from '../components/dd_OptimizedImage';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilesGallery() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const allProfiles = await ProfileManager.getAllProfiles();
        setProfiles(allProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
      setIsLoading(false);
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (userId) => {
    navigate(createPageUrl(`ProfileDetails?userId=${userId}`));
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Community Members</h1>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {profiles.map(profile => (
          <div 
            key={profile.id}
            onClick={() => handleProfileClick(profile.userId)}
            className="bg-white rounded-lg shadow-sm overflow-hidden text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <OptimizedImage
              src={profile.photo}
              alt={profile.fullName}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-800 truncate">{profile.fullName}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}