import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '../components/utils/translations';
import FilterModal from '../components/common/FilterModal';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const handleApplyFilters = (filters) => {
    const count = Object.values(filters).filter(v => v !== null && (!Array.isArray(v) || v.length > 0)).length;
    setActiveFilterCount(count);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* GlobalHeader is now in Layout.js - removed duplicate */}
      
      {/* Search Input Section */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder', 'Search for food, recipes, or classes')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 border-none pl-10 pr-12 h-11 rounded-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Results Content */}
      <div className="p-4">
        <div className="text-center py-20">
          <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('searchSuggestions', 'Search Suggestions')}
          </h3>
          <p className="text-gray-500">
            {t('searchDishes', 'Search dishes, cuisines, or cooks')}
          </p>
        </div>
      </div>

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={{}}
        filterOptions={[]}
      />
    </div>
  );
}