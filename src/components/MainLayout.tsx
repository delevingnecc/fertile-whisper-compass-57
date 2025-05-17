
import { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';
  
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <Header />
      <main className={`flex-1 flex flex-col pt-16 ${!isOnboarding ? 'pb-16' : ''} ${location.pathname === '/home' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {children || <Outlet />}
      </main>
      {!isOnboarding && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
