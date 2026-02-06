'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Shield,
  Send,
  DollarSign,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser, selectIsManagerOrAbove, selectIsAdmin } from '@/store/selectors/authSelectors';
import { logoutUser } from '@/store/actions/authActions';
import { selectSidebarOpen } from '@/store/selectors/uiSelectors';
import { toggleSidebar, setSidebarOpen } from '@/store/slices/uiSlice';
import { selectCompanyName } from '@/store/selectors/adminConfigSelectors';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Deals', href: '/dashboard/deals', icon: TrendingUp },
  { name: 'Offers', href: '/dashboard/offers', icon: DollarSign },
  { name: 'Submissions', href: '/dashboard/submissions', icon: Send },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
  { name: 'Users', href: '/dashboard/team', icon: Users, requiresManager: true },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Super Admin', href: '/dashboard/admin', icon: Shield, requiresAdmin: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isManagerOrAbove = useAppSelector(selectIsManagerOrAbove);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isOpen = useAppSelector(selectSidebarOpen);
  const companyName = useAppSelector(selectCompanyName);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    window.location.href = '/';
  };

  const filteredMenuItems = menuItems.filter(
    (item) => {
      if (item.requiresAdmin && !isAdmin) return false;
      if (item.requiresManager && !isManagerOrAbove) return false;
      return true;
    }
  );

  const sidebarVariants = {
    open: { width: 256, transition: { duration: 0.3, ease: 'easeInOut' as const } },
    closed: { width: 72, transition: { duration: 0.3, ease: 'easeInOut' as const } },
  };

  const mobileMenuVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
    closed: { x: '-100%', transition: { duration: 0.3, ease: 'easeIn' as const } },
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <AnimatePresence mode="wait">
          {(isOpen || mobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">{companyName}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!mobile && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="h-8 w-8"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        )}
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {(isOpen || mobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <AnimatePresence mode="wait">
          {(isOpen || mobile) && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-2 mb-2"
            >
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                {user.role}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors cursor-pointer',
            !isOpen && !mobile && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {(isOpen || mobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap overflow-hidden"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">{companyName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-40"
              />
              <motion.aside
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-xl"
              >
                <SidebarContent mobile />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className="fixed top-0 left-0 bottom-0 bg-white border-r z-30 overflow-hidden"
    >
      <SidebarContent />
    </motion.aside>
  );
}
