'use client';

import { useState } from 'react';
import { useFiltersStore } from '@/lib/storeDb';
import { FilterCategory } from '@/types';

export default function FilterManagement() {
  const { categories, addCategory, addOptionToCategory, removeOptionFromCategory, deleteCategory } =
    useFiltersStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddOption, setShowAddOption] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    nameAr: '',
    type: 'single' as 'single' | 'multi',
  });

  const [newOption, setNewOption] = useState({
    value: '',
    label: '',
    color: '',
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.nameAr) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    const category: FilterCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      nameAr: newCategory.nameAr,
      type: newCategory.type,
      options: [],
    };

    addCategory(category);
    setNewCategory({ name: '', nameAr: '', type: 'single' });
    setShowAddCategory(false);
  };

  const handleAddOption = (categoryId: string) => {
    if (!newOption.value || !newOption.label) {
      alert('الرجاء ملء القيمة والتسمية');
      return;
    }

    addOptionToCategory(categoryId, newOption);
    setNewOption({ value: '', label: '', color: '' });
    setShowAddOption(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Prevent deleting core categories
    const coreCategories = ['type', 'audience', 'environment', 'booking'];
    const category = categories.find((c) => c.id === categoryId);
    
    if (category && coreCategories.includes(category.name)) {
      alert('لا يمكن حذف التصنيفات الأساسية');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      deleteCategory(categoryId);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-2 space-x-reverse"
      >
        <span>⚙️</span>
        <span>إدارة التصنيفات</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              إدارة التصنيفات والفلاتر
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Add Category Button */}
            <div>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="btn-primary"
              >
                ➕ إضافة تصنيف جديد
              </button>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-800">تصنيف جديد</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم التصنيف (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="input-field"
                    placeholder="مثال: season"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم التصنيف (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={newCategory.nameAr}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, nameAr: e.target.value })
                    }
                    className="input-field"
                    placeholder="مثال: الموسم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع التصنيف
                  </label>
                  <select
                    value={newCategory.type}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        type: e.target.value as 'single' | 'multi',
                      })
                    }
                    className="input-field"
                  >
                    <option value="single">اختيار واحد</option>
                    <option value="multi">اختيار متعدد</option>
                  </select>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={handleAddCategory}
                    className="btn-primary"
                  >
                    حفظ التصنيف
                  </button>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="btn-secondary"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">
                التصنيفات الموجودة
              </h3>

              {categories.map((category) => {
                const isCoreCategory = ['type', 'audience', 'environment', 'booking'].includes(
                  category.name
                );

                return (
                  <div
                    key={category.id}
                    className="border rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {category.nameAr}
                          {isCoreCategory && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
                              أساسي
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {category.name} • {category.type === 'single' ? 'اختيار واحد' : 'اختيار متعدد'}
                        </p>
                      </div>
                      {!isCoreCategory && (
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          حذف التصنيف
                        </button>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {category.options.map((option) => (
                          <div
                            key={option.id}
                            className="bg-gray-100 px-3 py-1 rounded-lg text-sm flex items-center space-x-2 space-x-reverse"
                          >
                            <span>{option.label}</span>
                            <button
                              onClick={() =>
                                removeOptionFromCategory(category.id, option.id)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Option Form */}
                      {showAddOption === category.id ? (
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={newOption.value}
                              onChange={(e) =>
                                setNewOption({ ...newOption, value: e.target.value })
                              }
                              className="input-field text-sm"
                              placeholder="القيمة (بالإنجليزية)"
                            />
                            <input
                              type="text"
                              value={newOption.label}
                              onChange={(e) =>
                                setNewOption({ ...newOption, label: e.target.value })
                              }
                              className="input-field text-sm"
                              placeholder="التسمية (بالعربية)"
                            />
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleAddOption(category.id)}
                              className="btn-primary text-sm py-1.5"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setShowAddOption(null)}
                              className="btn-secondary text-sm py-1.5"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddOption(category.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          + إضافة خيار جديد
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

