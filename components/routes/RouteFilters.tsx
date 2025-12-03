'use client';

import { useState } from 'react';
import { useFiltersStore } from '@/lib/storeDb';

interface FilterState {
  [key: string]: string | string[];
}

interface RouteFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function RouteFilters({ filters, onFilterChange }: RouteFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Open by default
  const categories = useFiltersStore((state) => state.categories);

  const handleFilterChange = (categoryName: string, value: string, type: 'single' | 'multi') => {
    if (type === 'single') {
      onFilterChange({ ...filters, [categoryName]: value });
    } else {
      const currentValues = (filters[categoryName] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      onFilterChange({ ...filters, [categoryName]: newValues });
    }
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {};
    categories.forEach((category) => {
      if (category.type === 'single') {
        resetFilters[category.name] = 'all';
      } else {
        resetFilters[category.name] = [];
      }
    });
    resetFilters.search = '';
    onFilterChange(resetFilters);
  };

  const getMultiSelectLabel = (categoryName: string) => {
    const values = (filters[categoryName] as string[]) || [];
    if (values.length === 0) return 'الكل';
    
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return 'الكل';
    
    const labels = values
      .map((v) => category.options.find((o) => o.value === v)?.label)
      .filter(Boolean);
    
    return labels.join(', ') || 'الكل';
  };

  // Get search value
  const searchValue = (filters.search as string) || '';

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="ابحث عن مكان بالاسم..."
            className="input-field pr-10 w-full"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden btn-secondary flex items-center justify-center gap-2"
        >
          <span>الفلاتر</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters Grid */}
      <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold text-gray-700">تصفية النتائج</h4>
          <button
            onClick={handleReset}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            إعادة تعيين
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const currentValue = filters[category.name];

            return (
              <div key={category.id}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {category.nameAr}
                </label>

                {category.type === 'single' ? (
                  <select
                    value={(currentValue as string) || 'all'}
                    onChange={(e) => handleFilterChange(category.name, e.target.value, 'single')}
                    className="input-field text-sm py-2"
                  >
                    <option value="all">الكل</option>
                    {category.options.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <details className="relative">
                    <summary className="w-full input-field text-sm cursor-pointer list-none flex justify-between items-center">
                      <span className="truncate">{getMultiSelectLabel(category.name)}</span>
                      <svg
                        className="w-4 h-4 text-gray-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-3 space-y-2">
                        {category.options.map((option) => {
                          const isChecked =
                            Array.isArray(currentValue) && currentValue.includes(option.value);
                          return (
                            <label
                              key={option.id}
                              className="flex items-center space-x-2 space-x-reverse cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleFilterChange(category.name, option.value, 'multi')}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
