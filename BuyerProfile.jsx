import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Review } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useTranslation } from "../components/utils/translations";

export default function BuyerProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      
      // Mock user data
      const mockUser = {
        id: userId || '1',
        full_name: 'Sophia',
        profile_photo_url: "https://images.unsplash.com/photo-1494790108755-2616b612b120",
        created_date: '2022-01-01',
        dishes_ordered: 12,
        reviews_written: 3,
        favorite_cuisines: [t('italian'), t('mexican'), t('indian')]
      };
      
      const mockReviews = [
        {
          id: '1',
          reviewer_name: 'Liam',
          reviewer_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          rating: 5,
          comment: t('greatBuyerReview'),
          created_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setUser(mockUser);
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('buyerProfile')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-amber-200 mx-auto mb-4 overflow-hidden">
            <img
              src={user.profile_photo_url}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{user.full_name}</h2>
          <p className="text-gray-500">{t('joined')} {new Date(user.created_date).getFullYear()}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-gray-900">{user.dishes_ordered}</div>
            <div className="text-gray-500">{t('dishesOrdered')}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-gray-900">{user.reviews_written}</div>
            <div className="text-gray-500">{t('reviewsWritten')}</div>
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('favoriteCuisines')}</h3>
          <div className="flex flex-wrap gap-2">
            {user.favorite_cuisines.map((cuisine, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('reviews')}</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-xl">
                <div className="flex items-start gap-4">
                  <img
                    src={review.reviewer_photo}
                    alt={review.reviewer_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{review.reviewer_name}</h4>
                      <p className="text-xs text-gray-500">2 {t('weeksAgo')}</p>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">1</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}