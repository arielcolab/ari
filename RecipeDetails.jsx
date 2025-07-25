import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Recipe } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Clock, Users, Star, ChefHat } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';
import OptimizedImage from '../components/dd_OptimizedImage';
import RatingDisplay from '../components/reviews/RatingDisplay';
import { ShareModal } from '../components/dd_WhatsAppShare';

export default function RecipeDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('id');

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!recipeId) {
      navigate(createPageUrl('Home'));
      return;
    }
    const loadRecipe = async () => {
      setIsLoading(true);
      try {
        const recipeData = await Recipe.get(recipeId);
        setRecipe(recipeData);
      } catch (error) {
        console.error("Failed to load recipe details", error);
      }
      setIsLoading(false);
    };
    loadRecipe();
  }, [recipeId]);

  if (isLoading || !recipe) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative">
        <OptimizedImage src={recipe.image_url} className="w-full h-64 object-cover" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="bg-white/80 rounded-full"><ArrowLeft /></Button>
          <Button variant="ghost" size="icon" onClick={() => setShowShare(true)} className="bg-white/80 rounded-full"><Share2 /></Button>
        </div>
      </div>
      
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-6 text-center">
            <div className="flex-1"><Clock className="mx-auto mb-1"/> <span className="text-sm">{`${recipe.prep_time + recipe.cook_time} ${t('minutes')}`}</span></div>
            <div className="flex-1"><Users className="mx-auto mb-1"/> <span className="text-sm">{`${recipe.servings} ${t('servings')}`}</span></div>
            <div className="flex-1"><ChefHat className="mx-auto mb-1"/> <span className="text-sm">{t(recipe.difficulty)}</span></div>
            <div className="flex-1"><Star className="mx-auto mb-1 text-yellow-400 fill-yellow-400"/> <span className="text-sm">{recipe.rating}</span></div>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-xl mb-3">{t('ingredients', 'Ingredients')}</h3>
            <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-lg">
                {recipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
        </div>
        
        <div>
            <h3 className="font-bold text-xl mb-3">{t('instructions', 'Instructions')}</h3>
            <ol className="list-decimal list-inside space-y-4">
                {recipe.instructions?.map((step, i) => <li key={i} className="pl-2">{step}</li>)}
            </ol>
        </div>
      </div>
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} item={recipe} type="recipe" />
    </div>
  );
}