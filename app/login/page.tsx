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
    <div className="min-h-screen flex items-center justify-center bg-[#b2b6b2] px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          <p className="text-white/70">منصة استكشاف المدينة المنورة</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#195B4A]/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition-all"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-[#B69D6D] focus:border-transparent outline-none transition-all"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9D7D4E] hover:bg-[#B69D6D] text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 text-center mb-3">
              حسابات تجريبية:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[#DBC8A8] font-medium mb-1">مدير</p>
                <p className="text-white/70">manager / 123</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[#307C5F] font-medium mb-1">مستخدم</p>
                <p className="text-white/70">user1 / 123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
