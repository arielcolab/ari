import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Loader2, Sparkles, Plus, Minus, Clock, Users, BarChart } from 'lucide-react';
import { showToast } from '../components/common/ErrorBoundary';
import { createPageUrl } from '@/utils';
import { UploadFile, InvokeLLM } from '@/api/integrations';

export default function PostRecipeForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prep_time: 30,
    cook_time: 30,
    servings: 4,
    difficulty: 'medium',
    category: 'dinner',
  });
  const [photos, setPhotos] = useState([]);
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzePhotoWithAI = async (photoUrl) => {
    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze this food image for a recipe. Provide:
1. Recipe title (e.g., "Homestyle Chicken Noodle Soup")
2. Description (2-3 sentences about the dish)
3. Main ingredients list (5-8 items)
4. Estimated prep time in minutes
5. Estimated cook time in minutes
6. Estimated number of servings
7. Difficulty level (easy, medium, hard)
8. Recipe category (e.g., breakfast, lunch, dinner, dessert, healthy)`,
        file_urls: [photoUrl],
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            prep_time: { type: "number" },
            cook_time: { type: "number" },
            servings: { type: "number" },
            difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
            category: { type: "string" },
          }
        }
      });
      if (response && typeof response === 'object') {
        setFormData(prev => ({
          ...prev,
          title: response.title || prev.title,
          description: response.description || prev.description,
          prep_time: response.prep_time || prev.prep_time,
          cook_time: response.cook_time || prev.cook_time,
          servings: response.servings || prev.servings,
          difficulty: response.difficulty || prev.difficulty,
          category: response.category || prev.category,
        }));
        if (response.ingredients?.length > 0) setIngredients(response.ingredients);
        showToast('✨ AI analyzed your photo and suggested details!', 'success');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      showToast('AI analysis failed, but photo uploaded.', 'info');
    }
    setIsAnalyzing(false);
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setPhotos([file_url]);
      await analyzePhotoWithAI(file_url);
    } catch (error) {
      showToast('Photo upload failed.', 'error');
    }
    setIsUploading(false);
  };

  const handleListChange = (list, setList, index, value) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };
  const addListItem = (setList) => setList(prev => [...prev, '']);
  const removeListItem = (list, setList, index) => {
    if (list.length > 1) setList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || photos.length === 0) {
      showToast('Please add a title and a photo.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await Recipe.create({
        ...formData,
        image_url: photos[0],
        ingredients: ingredients.filter(i => i.trim()),
        instructions: instructions.filter(i => i.trim()),
        rating: 0, // Initial rating
      });
      showToast('🎉 Recipe posted successfully!', 'success');
      navigate(createPageUrl('Recipes'));
    } catch (error) {
      console.error('Failed to post recipe:', error);
      showToast('Failed to post recipe.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><X className="w-6 h-6" /></Button>
          <h1 className="text-lg font-semibold">Post a Recipe</h1>
          <div className="w-10" />
        </div>
      </div>
      <div className="px-4 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <Input value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Recipe title" className="h-12 text-base bg-amber-50 border-0" required />
            <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="A short, enticing description..." className="min-h-24 text-base bg-amber-50 border-0 resize-none" required />
            {isAnalyzing && <div className="flex items-center gap-2 text-sm text-orange-600"><Sparkles className="w-4 h-4 animate-pulse" /><span>AI is analyzing your photo...</span></div>}
          </div>

          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Recipe Photo</h3>
            {photos.length > 0 ? (
              <div className="relative"><img src={photos[0]} alt="Recipe" className="w-full h-48 object-cover rounded-lg" /><button type="button" onClick={() => setPhotos([])} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"><X className="w-3 h-3" /></button></div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="photo-upload">
                  <Button type="button" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isUploading || isAnalyzing}>{isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload Photo'}</Button>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" disabled={isUploading || isAnalyzing} />
                </label>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gray-500" /><Input type="number" value={formData.prep_time} onChange={e => handleInputChange('prep_time', parseInt(e.target.value))} placeholder="Prep" /><span className="text-sm text-gray-500">min</span></div>
              <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gray-500" /><Input type="number" value={formData.cook_time} onChange={e => handleInputChange('cook_time', parseInt(e.target.value))} placeholder="Cook" /><span className="text-sm text-gray-500">min</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-500" /><Input type="number" value={formData.servings} onChange={e => handleInputChange('servings', parseInt(e.target.value))} placeholder="Serves" /></div>
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <Label>Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={v => handleInputChange('difficulty', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select>
               </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="breakfast">Breakfast</SelectItem><SelectItem value="lunch">Lunch</SelectItem><SelectItem value="dinner">Dinner</SelectItem><SelectItem value="dessert">Dessert</SelectItem><SelectItem value="snack">Snack</SelectItem><SelectItem value="healthy">Healthy</SelectItem></SelectContent></Select>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center mb-2"><h3 className="text-lg font-semibold">Ingredients</h3><Button type="button" onClick={() => addListItem(setIngredients)} size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add</Button></div>
            {ingredients.map((item, index) => <div key={index} className="flex items-center gap-2"><Input value={item} onChange={e => handleListChange(ingredients, setIngredients, index, e.target.value)} placeholder="e.g., 2 cups flour" /><Button type="button" onClick={() => removeListItem(ingredients, setIngredients, index)} size="icon" variant="ghost" className="text-red-500 hover:text-red-700"><Minus className="w-4 h-4" /></Button></div>)}
          </div>
          
          <div className="bg-white rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center mb-2"><h3 className="text-lg font-semibold">Instructions</h3><Button type="button" onClick={() => addListItem(setInstructions)} size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add</Button></div>
            {instructions.map((item, index) => <div key={index} className="flex items-start gap-2"><span className="font-bold text-lg text-orange-500 pt-1">{index + 1}.</span><Textarea value={item} onChange={e => handleListChange(instructions, setInstructions, index, e.target.value)} placeholder="e.g., Preheat oven to 350°F" className="flex-1" /><Button type="button" onClick={() => removeListItem(instructions, setInstructions, index)} size="icon" variant="ghost" className="text-red-500 hover:text-red-700"><Minus className="w-4 h-4" /></Button></div>)}
          </div>

        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg rounded-2xl">{isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Posting...</> : 'Post Recipe'}</Button>
      </div>
    </div>
  );
}