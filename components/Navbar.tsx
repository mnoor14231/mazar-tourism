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
    { href: '/', label: 'الرئيسية', sectionId: 'home' },
    { href: '/reference', label: 'المرجع', sectionId: 'reference' },
    { href: '/routes', label: 'المسار', sectionId: 'planner' },
    { href: '/experiences', label: 'التجارب', sectionId: 'experiences' },
    { href: '/about', label: 'عن المدينة', sectionId: 'about' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId?: string) => {
    // If on landing page and sectionId exists, scroll to section instead of navigating
    if (isLandingPage && sectionId && sectionId !== 'home') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else if (isLandingPage && sectionId === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Otherwise, let the Link component handle navigation normally
  };

  const getRoleLabel = () => {
    if (user?.role === 'manager') return 'مدير';
    return 'زائر';
  };

  const getRoleBadgeColor = () => {
    if (user?.role === 'manager') return 'bg-[#9D7D4E]'; // Brown for manager
    return 'bg-[#195B4A]'; // Green for tourist/user
  };

  // Different styles for landing page vs other pages
  // Using Visual Identity background color
  const navBgClass = isLandingPage 
    ? 'backdrop-blur-sm' 
    : 'shadow-lg';

  return (
    <nav className={`${navBgClass} sticky top-0 z-50`} style={{ backgroundColor: '#FAF8F3' }}>
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
            {navItems.map((item) => {
              const isActive = pathname === item.href || (isLandingPage && item.sectionId === 'home');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                  className="px-4 py-2 rounded-lg font-medium transition-all relative group"
                  style={{ color: '#1A1A1A' }}
                >
                  {item.label}
                  {/* Hover underline - shows on hover for all links */}
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 origin-center scale-x-0 group-hover:scale-x-100" 
                    style={{ backgroundColor: '#C38822' }}
                  ></span>
                  {/* Active underline - shows when page is active */}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-0 right-0 h-0.5" 
                      style={{ backgroundColor: '#C38822' }}
                    ></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button 
                className="hidden sm:flex items-center gap-1.5 hover:opacity-90 transition-colors text-sm font-medium px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#2D4A3E', color: 'white' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>EN</span>
              </button>

            {user ? (
              <>
                {/* User Info Display */}
                <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-[#195B4A]/20">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#195B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-[#3C3F42]">{user.username}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleBadgeColor()} text-white`}>
                        {getRoleLabel()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Mobile User Info */}
                <div className="sm:hidden flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#195B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-semibold text-[#3C3F42]">{user.username}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleBadgeColor()} text-white`}>
                      {getRoleLabel()}
                    </span>
                  </div>
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
                className="bg-white hover:bg-gray-50 text-gray-800 px-5 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-gray-200"
              >
                <span>تسجيل الدخول</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

              {/* Mobile Navigation */}
              <div className="sm:hidden pb-3 flex justify-center gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (isLandingPage && item.sectionId === 'home');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative group"
                      style={{ color: '#1A1A1A' }}
                    >
                      {item.label}
                      {/* Hover underline - shows on hover for all links */}
                      <span 
                        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 origin-center scale-x-0 group-hover:scale-x-100" 
                        style={{ backgroundColor: '#C38822' }}
                      ></span>
                      {/* Active underline - shows when page is active */}
                      {isActive && (
                        <span 
                          className="absolute bottom-0 left-0 right-0 h-0.5" 
                          style={{ backgroundColor: '#C38822' }}
                        ></span>
                      )}
                    </Link>
                  );
                })}
              </div>
      </div>
    </nav>
  );
}
