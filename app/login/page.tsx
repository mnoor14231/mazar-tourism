'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        // Check if there's a pending route redirect
        const pendingRouteRedirect = localStorage.getItem('pendingRouteRedirect');
        if (pendingRouteRedirect) {
          localStorage.removeItem('pendingRouteRedirect');
          router.push(pendingRouteRedirect);
          return;
        }

        // Check if there's a pending reservation
        const pendingReservation = localStorage.getItem('pendingReservation');
        if (pendingReservation) {
          localStorage.removeItem('pendingReservation');
          router.push('/reference?reserve=' + pendingReservation);
        } else {
          router.push('/reference');
        }
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23153D33' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/mazar.png"
              alt="مزار"
              width={120}
              height={60}
              className="h-16 w-auto mx-auto mb-4"
            />
          </Link>
          <p className="text-gray-600">منصة استكشاف المدينة المنورة</p>
        </div>

        {/* Login Card */}
        <div className="card-secondary p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--color-button-normal)' }}>
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }} className="border px-4 py-3 rounded-xl text-sm text-center text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري التحميل...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-center text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/signup" className="font-medium transition-colors" style={{ color: 'var(--color-accent)' }}>
                إنشاء حساب جديد
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs text-gray-500 text-center mb-3">
              حسابات تجريبية:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: 'var(--color-border)' }}>
                <p className="font-medium mb-1" style={{ color: 'var(--color-accent)' }}>مدير</p>
                <p className="text-gray-600">manager / 123</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: 'var(--color-border)' }}>
                <p className="font-medium mb-1" style={{ color: 'var(--color-green-light)' }}>مستخدم</p>
                <p className="text-gray-600">user1 / 123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
