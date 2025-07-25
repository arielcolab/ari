import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GroupDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">Group Details (ID: {groupId})</h1>
      </div>
      <div className="text-center py-16 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Community Group Page</h2>
        <p className="text-gray-600">This page is under construction.</p>
      </div>
    </div>
  );
}