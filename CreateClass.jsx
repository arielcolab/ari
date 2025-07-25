import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CreateClass() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">Host a New Class</h1>
      </div>
      <div className="p-6 bg-white rounded-lg space-y-4">
        <p className="text-center text-gray-600">Feature coming soon! This form demonstrates the future class creation flow.</p>
        <div>
          <Label htmlFor="class-title">Class Title</Label>
          <Input id="class-title" placeholder="e.g., Authentic Italian Pasta Making" />
        </div>
        <div>
          <Label htmlFor="class-desc">Description</Label>
          <Textarea id="class-desc" placeholder="Describe your class..." />
        </div>
        <Button className="w-full" disabled>Submit for Review</Button>
      </div>
    </div>
  );
}