'use client';

import { useFiltersStore } from '@/lib/storeDb';

interface FilterState {
  [key: string]: string | string[];
}

interface PlaceFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function PlaceFilters({ filters, onFilterChange }: PlaceFiltersProps) {
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

  const handleReset = () => {
    const resetFilters: FilterState = {};
    categories.forEach((category) => {
      if (category.type === 'single') {
        resetFilters[category.name] = 'all';
      } else {
        resetFilters[category.name] = [];
      }
    });
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

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">تصفية الأماكن</h3>
        <button
          onClick={handleReset}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          إعادة تعيين
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const currentValue = filters[category.name];

          return (
            <div key={category.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {category.nameAr}
              </label>

              {category.type === 'single' ? (
                <select
                  value={(currentValue as string) || 'all'}
                  onChange={(e) => handleFilterChange(category.name, e.target.value, 'single')}
                  className="w-full input-field text-sm"
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
  );
}
