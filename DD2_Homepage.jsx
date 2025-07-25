import React, { useState, useEffect } from 'react';
import { Search, ChefHat, ShoppingCart, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RecipeCard from '../components/dd2/RecipeCard';
import { Button } from '@/components/ui/button';
import { DD2_Recipe } from '@/api/entities';

export default function DD2_Homepage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomePageData();
  }, []);

  const loadHomePageData = async () => {
    setIsLoading(true);
    try {
      const recipes = await DD2_Recipe.list();
      setTrendingRecipes(recipes.slice(0, 6));
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(createPageUrl(`DD2_SearchResults?q=${encodeURIComponent(searchTerm)}`));
    }
  };

  const heroImage = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-teal-600 to-teal-800 flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Your next meal, from plan to plate
          </h1>
          <p className="text-xl mb-8 text-teal-100">
            Discover recipes, plan meals, and get everything delivered
          </p>
          
          {/* Unified Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes, restaurants, or ingredients..."
                className="pl-12 h-14 bg-white text-gray-900 text-lg rounded-full border-0 shadow-lg"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Button
            onClick={() => navigate(createPageUrl('DD2_MealPlanner'))}
            className="h-20 text-lg bg-teal-600 hover:bg-teal-700"
          >
            <Calendar className="w-6 h-6 mr-2" />
            Plan Your Week
          </Button>
          <Button
            onClick={() => navigate(createPageUrl('DD2_MyPantry'))}
            className="h-20 text-lg bg-orange-600 hover:bg-orange-700"
          >
            <ChefHat className="w-6 h-6 mr-2" />
            Check My Pantry
          </Button>
          <Button
            onClick={() => navigate(createPageUrl('DD2_Restaurants'))}
            className="h-20 text-lg bg-green-600 hover:bg-green-700"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            Order Delivery
          </Button>
        </div>

        {/* Trending Recipes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Recipes</h2>
            <button 
              onClick={() => navigate(createPageUrl('DD2_Recipes'))}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              See all
            </button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}