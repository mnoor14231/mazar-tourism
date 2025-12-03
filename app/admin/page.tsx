'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          لوحة التحكم - إدارة قاعدة البيانات
        </h1>

        <div className="space-y-4">
          <button
            onClick={handleSeed}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#195B4A] hover:bg-[#307C5F] hover:scale-105'
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              بعد النقر على الزر، انتظر قليلاً ثم اذهب إلى صفحة{' '}
              <a href="/reference" className="text-[#195B4A] hover:underline">
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

