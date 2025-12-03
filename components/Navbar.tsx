'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isLandingPage = pathname === '/';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const navItems = [
    { href: '/reference', label: 'المرجع' },
    { href: '/routes', label: 'المسار' },
    { href: '/experiences', label: 'التجارب' },
  ];

  const getRoleLabel = () => {
    if (user?.role === 'manager') return 'مدير';
    return 'زائر';
  };

  // Different styles for landing page vs other pages
  // Using exact layout background color #b2b6b2
  const navBgClass = isLandingPage 
    ? 'bg-[#b2b6b2]/95 backdrop-blur-sm' 
    : 'bg-[#b2b6b2] shadow-lg';

  return (
    <nav className={`${navBgClass} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/mazar.png"
                alt="مزار"
                width={100}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-[#195B4A] text-white'
                    : 'text-[#3C3F42] hover:bg-[#195B4A]/20 hover:text-[#195B4A]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button className="text-[#3C3F42]/70 hover:text-[#3C3F42] transition-colors p-2 hidden sm:block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Toggle */}
            <button className="hidden sm:flex items-center gap-1 text-[#3C3F42]/70 hover:text-[#3C3F42] transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>EN</span>
            </button>

            {user ? (
              <>
                <div className="bg-[#195B4A] text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {getRoleLabel()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-[#9D7D4E] hover:bg-[#694F2E] text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden pb-3 flex justify-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-[#195B4A] text-white'
                  : 'text-[#3C3F42] hover:bg-[#195B4A]/20 hover:text-[#195B4A]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
