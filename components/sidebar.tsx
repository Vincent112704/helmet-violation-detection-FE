'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  AlertTriangle,
  Upload,
  FileText,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  console.log("user: ", user)

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/violations', label: 'Violations', icon: AlertTriangle },
    { href: '/dashboard/upload', label: 'Upload Video', icon: Upload },
    { href: '/dashboard/privacy', label: 'Data Privacy', icon: FileText },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border-gray-200"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-orange-600" />
            <div>
              <div className="font-bold text-gray-900 text-lg">TrafficShield</div>
              <div className="text-xs text-gray-500">Helmet Detection</div>
            </div>
          </Link>

          {/* User Info */}
          {user && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase">Logged in as</p>
              <p className="font-medium text-gray-900">{user.user_metadata.display_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
