'use client';

import { useState, useRef } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Bulk import states
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ نجاح! تم إنشاء ${data.data?.places || 0} أماكن و ${data.data?.users || 0} مستخدمين`);
      } else {
        setError(`❌ خطأ: ${data.error || 'فشل في إنشاء البيانات'}`);
      }
    } catch (err: any) {
      setError(`❌ خطأ: ${err.message || 'فشل الاتصال بالخادم'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    setBulkResult(null);
    setBulkError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/places/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setBulkResult(`✅ نجاح! تم استيراد ${data.imported} من ${data.total} مكان${data.errors ? ` (${data.errors.length} أخطاء)` : ''}`);
        if (data.errors && data.errors.length > 0) {
          console.warn('Import errors:', data.errors);
        }
      } else {
        setBulkError(`❌ خطأ: ${data.error || 'فشل في استيراد البيانات'}${data.details ? ` - ${data.details}` : ''}`);
      }
    } catch (err: any) {
      setBulkError(`❌ خطأ: ${err.message || 'فشل الاتصال بالخادم'}`);
    } finally {
      setBulkLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    window.open('/places-template.csv', '_blank');
  };

  const downloadInstructions = () => {
    window.open('/places-template-arabic-guide.txt', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="card-secondary rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--color-button-normal)' }}>
          لوحة التحكم - إدارة قاعدة البيانات
        </h1>

        <div className="space-y-6">
          {/* Seed Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-button-normal)' }}>
              إنشاء بيانات أولية
            </h2>
            <button
              onClick={handleSeed}
              disabled={loading}
              className={`btn-primary w-full py-3 px-4 rounded-lg font-semibold ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء البيانات (8 أماكن)'}
            </button>

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {result}
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--color-border)' }}></div>

          {/* Bulk Import Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-button-normal)' }}>
              استيراد جماعي للأماكن (Bulk Import)
            </h2>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={downloadTemplate}
                  className="py-2 px-4 rounded-lg border-2 font-medium transition-colors hover:bg-gray-50 text-sm"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  📥 تحميل القالب
                </button>
                <button
                  onClick={downloadInstructions}
                  className="py-2 px-4 rounded-lg border-2 font-medium transition-colors hover:bg-gray-50 text-sm"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  📖 دليل الاستخدام
                </button>
              </div>

              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkImport}
                  disabled={bulkLoading}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className={`block w-full py-3 px-4 rounded-lg font-semibold text-center cursor-pointer transition-all ${
                    bulkLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'btn-primary hover:scale-105'
                  }`}
                >
                  {bulkLoading ? 'جاري الاستيراد...' : '📤 رفع ملف Excel أو CSV واستيراد الأماكن'}
                </label>
              </div>

              <p className="text-sm text-gray-600 text-center">
                يمكنك رفع ملف Excel (.xlsx, .xls) أو CSV يحتوي على عدة أماكن دفعة واحدة. 
                <br />
                قم بتحميل القالب والدليل أولاً لمعرفة التنسيق المطلوب.
              </p>
            </div>

            {bulkResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {bulkResult}
              </div>
            )}

            {bulkError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {bulkError}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm text-gray-600 text-center">
              بعد الاستيراد، انتظر قليلاً ثم اذهب إلى صفحة{' '}
              <a href="/reference" className="font-medium transition-colors hover:underline" style={{ color: 'var(--color-button-normal)' }}>
                المرجع
              </a>{' '}
              لرؤية الأماكن
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

