import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookingClass } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Loader2, Sparkles, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import { showToast } from '../components/common/ErrorBoundary';
import { createPageUrl } from '@/utils';
import { UploadFile } from '@/api/integrations';

export default function PostClassForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'italian',
    date: '',
    address: '',
    price: 50,
    capacity: 10,
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await User.me();
      setUser(userData);
      if(userData.address) {
        setFormData(prev => ({ ...prev, address: userData.address }));
      }
    };
    loadUser().catch(() => navigate(createPageUrl('Profile')));
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setPhoto(file_url);
      showToast('Photo uploaded!', 'success');
    } catch (error) {
      showToast('Photo upload failed.', 'error');
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !photo || !formData.date) {
      showToast('Please fill all fields and upload a photo.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await CookingClass.create({
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        spots_left: Number(formData.capacity),
        image_url: photo,
        chef_name: user.full_name,
        rating: 0,
        reviews_count: 0,
      });
      showToast('🎉 Cooking class posted successfully!', 'success');
      navigate(createPageUrl('CookingClasses'));
    } catch (error) {
      console.error('Failed to post class:', error);
      showToast('Failed to post class.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["italian", "asian", "desserts", "french", "thai", "mexican", "baking"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><X className="w-6 h-6" /></Button>
          <h1 className="text-lg font-semibold">Host a Cooking Class</h1>
          <div className="w-10" />
        </div>
      </div>
      <div className="px-4 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold">Class Details</h3>
            <Input value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Class Title, e.g., 'Mastering Sourdough Bread'" className="h-12 text-base bg-amber-50 border-0" required />
            <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Describe what students will learn, the menu, and what makes your class special." className="min-h-32 text-base bg-amber-50 border-0 resize-none" required />
             <Label>Category</Label>
             <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent></Select>
          </div>

          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Class Photo</h3>
            {photo ? (
              <div className="relative"><img src={photo} alt="Class" className="w-full h-48 object-cover rounded-lg" /><button type="button" onClick={() => setPhoto(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"><X className="w-3 h-3" /></button></div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="photo-upload"><Button type="button" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isUploading}>{isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload Photo'}</Button><input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" disabled={isUploading} /></label>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold">Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><Label>Date</Label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="date" value={formData.date} onChange={e => handleInputChange('date', e.target.value)} className="pl-10" min={new Date().toISOString().split("T")[0]} required /></div></div>
               <div><Label>Price per Person</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="number" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} className="pl-10" required /></div></div>
               <div><Label>Location / Address</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="pl-10" required /></div></div>
               <div><Label>Capacity (Max Students)</Label><div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="number" value={formData.capacity} onChange={e => handleInputChange('capacity', e.target.value)} className="pl-10" required /></div></div>
            </div>
          </div>
          
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg rounded-2xl">{isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Posting Class...</> : 'Post Class'}</Button>
      </div>
    </div>
  );
}