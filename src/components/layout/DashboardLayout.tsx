'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSidebarOpen } from '@/store/selectors/uiSelectors';
import { fetchCurrentUser } from '@/store/actions/authActions';
import { selectIsAuthLoading } from '@/store/selectors/authSelectors';
import { initSidebarFromStorage } from '@/store/slices/uiSlice';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCurrentUser());
    dispatch(initSidebarFromStorage());
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : (isOpen ? 256 : 72),
          paddingTop: isMobile ? 64 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
