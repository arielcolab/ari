
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Review } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "../components/utils/translations";

const ReviewItem = ({ review }) => (
  <div className="py-6 border-b border-gray-100">
    <div className="flex items-start gap-4">
      <img
        src={review.reviewer_photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
        alt={review.reviewer_name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-900">{review.reviewer_name}</h4>
          <p className="text-xs text-gray-500">{new Date(review.created_date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-1 my-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mt-2">{review.comment}</p>
      </div>
    </div>
  </div>
);

export default function Reviews() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dishId = urlParams.get('dishId');
      const allReviews = await Review.list("-created_date");
      
      const filteredReviews = dishId 
        ? allReviews.filter(r => r.dish_id === dishId)
        : allReviews;
        
      setReviews(filteredReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
    setIsLoading(false);
  };
  
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_date) - new Date(a.created_date);
    }
    if (sortOption === "rating_high") {
      return b.rating - a.rating;
    }
     if (sortOption === "rating_low") {
      return a.rating - b.rating;
    }
    return 0;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
    
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
      return { star, count, percentage };
  });

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
          <h1 className="text-xl font-semibold text-gray-900">{t('reviews')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Rating Summary */}
        <div className="flex gap-6 items-center">
            <div className="text-center">
                <h2 className="text-5xl font-bold text-gray-900">{averageRating}</h2>
                <div className="flex items-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    ))}
                </div>
                <p className="text-sm text-gray-500">{reviews.length} {t('reviews')}</p>
            </div>
            <div className="flex-1">
                {ratingDistribution.map(item => (
                    <div key={item.star} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">{item.star}</span>
                        <Progress value={item.percentage} className="h-2" />
                    </div>
                ))}
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-auto bg-white rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('newest')}</SelectItem>
                <SelectItem value="rating_high">{t('ratingHighToLow')}</SelectItem>
                <SelectItem value="rating_low">{t('ratingLowToHigh')}</SelectItem>
              </SelectContent>
            </Select>
        </div>

        {/* Reviews List */}
        <div>
          {sortedReviews.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              {t('noReviewsYet')}
            </div>
          ) : (
            <div>
                {sortedReviews.map(review => (
                    <ReviewItem key={review.id} review={review} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
