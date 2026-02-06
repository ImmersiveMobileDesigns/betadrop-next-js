'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Upload, Box, Settings } from 'lucide-react';
import { fetchFromLaravel } from '@/lib/api-client';
import type { User } from '@/types';
import Logo from '@/components/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await fetchFromLaravel('/api/auth/logout', { method: 'POST' });
      
      // Clear session from cache immediately
      queryClient.setQueryData(['session'], null);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      
      // Notify other tabs
      localStorage.setItem('logout-event', Date.now().toString());
      
      router.push('/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/builds', label: 'Builds', icon: Box },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="glass sticky top-0 z-50 backdrop-blur-xl bg-[#0f172a]/70 supports-[backdrop-filter]:bg-[#0f172a]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo href="/dashboard" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user.email}</div>
              <div className="text-xs text-white/40 capitalize">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 glass overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Nav Links */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      pathname === item.href
                        ? 'bg-primary-500/20 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="h-px bg-white/10" />

              {/* Mobile User Info & Logout */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-white">{user.email}</div>
                    <div className="text-xs text-white/40 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
