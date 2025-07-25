import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Review } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { useTranslation } from "../components/utils/translations";
import RatingDisplay from "../components/reviews/RatingDisplay";

const ReviewStatsCard = ({ averageRating, totalReviews, ratingDistribution }) => (
  <div className="bg-white rounded-xl p-6 mb-6">
    <div className="flex gap-6 items-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">{averageRating}</h2>
        <div className="flex items-center gap-1 my-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">{totalReviews} reviews</p>
      </div>
      <div className="flex-1">
        {ratingDistribution.map(item => (
          <div key={item.star} className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-600 w-2">{item.star}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full" 
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReviewItem = ({ review }) => (
  <div className="py-4 border-b border-gray-100 last:border-b-0">
    <div className="flex items-start gap-4">
      <img
        src={review.reviewer_photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
        alt={review.reviewer_name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewer_name}</h4>
            {review.is_verified_purchase && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="text-right">
            <RatingDisplay rating={review.rating} showCount={false} size="sm" />
            <p className="text-xs text-gray-500 mt-1">
              {new Date(review.created_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {review.review_type === 'dish' ? 'Dish Review' : 'Cook Review'}
        </p>
        
        {review.comment && (
          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
        )}
      </div>
    </div>
  </div>
);

export default function MyReviews() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadMyReviews();
  }, []);

  const loadMyReviews = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Get reviews where the current user is the cook being reviewed
      const allReviews = await Review.list("-created_date");
      const myReviews = allReviews.filter(r => r.cook_id === userData.id);
      
      setReviews(myReviews);

      // Calculate stats
      if (myReviews.length > 0) {
        const avgRating = myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length;
        const distribution = [5, 4, 3, 2, 1].map(star => {
          const count = myReviews.filter(r => r.rating === star).length;
          const percentage = (count / myReviews.length) * 100;
          return { star, count, percentage };
        });

        setStats({
          averageRating: avgRating.toFixed(1),
          totalReviews: myReviews.length,
          ratingDistribution: distribution
        });
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">My Reviews</h1>
        </div>
      </div>

      <div className="p-4">
        {reviews.length > 0 ? (
          <>
            <ReviewStatsCard {...stats} />
            
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">All Reviews</h3>
              </div>
              <div className="p-4">
                {reviews.map(review => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              When customers review your dishes and cooking, they'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}