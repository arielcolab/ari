import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useTranslation } from "../components/utils/translations";
import OptimizedImage from "../components/dd_OptimizedImage";
import { createPageUrl } from "@/utils";
import RatingDisplay from "../components/reviews/RatingDisplay";

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" onClick={() => navigate(createPageUrl(`RecipeDetails?id=${recipe.id}`))}>
            <OptimizedImage src={recipe.image_url} className="w-full h-40 object-cover"/>
            <div className="p-4">
                <h3 className="font-bold text-lg">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <RatingDisplay rating={recipe.rating} showCount={false}/>
                    <span className="text-sm text-gray-500">{`${recipe.prep_time + recipe.cook_time} ${t('minutes', 'min')}`}</span>
                </div>
            </div>
        </div>
    );
};

export default function RecipesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const data = await Recipe.list("-created_date");
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 flex items-center justify-between border-b">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5"/></Button>
            <h1 className="text-xl font-bold">{t('freeRecipes', 'Free Recipes')}</h1>
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('PostRecipeForm'))}><PlusCircle className="w-5 h-5 text-red-500"/></Button>
        </div>
        <div className="p-4 space-y-4">
            {isLoading ? (
                <p>{t('loading', 'Loading...')}</p>
            ) : (
                recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe}/>)
            )}
        </div>
    </div>
  );
}