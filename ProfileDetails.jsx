import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProfileManager } from '../components/utils/ProfileManager';
import OptimizedImage from '../components/dd_OptimizedImage';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProfileDetails() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (!userId) {
      navigate(-1); // Go back if no userId is provided
      return;
    }

    const fetchProfileDetails = async () => {
      setIsLoading(true);
      try {
        const profileData = await ProfileManager.getProfileByUserId(userId);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile details:", error);
      }
      setIsLoading(false);
    };

    fetchProfileDetails();
  }, [userId, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>;
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
      <div className="relative pb-10">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="bg-white/80 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="h-48 bg-gray-200"></div>

        <div className="p-4">
          <div className="flex flex-col items-center -mt-20">
            <OptimizedImage
              src={profile.photo}
              alt={profile.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h1 className="text-2xl font-bold mt-4">{profile.fullName}</h1>
            {profile.city && (
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.city}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center max-w-2xl mx-auto">
            <p className="text-gray-700">{profile.bio}</p>
          </div>
          
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-center mb-4">Interests</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-sm cursor-default">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

           {/* Placeholder for user's dishes/activities */}
           <div className="mt-10">
             <h3 className="text-lg font-semibold text-center mb-4">Activity</h3>
             <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-sm">
                <p>User's dishes and activities will be displayed here.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}