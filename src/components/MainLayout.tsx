
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
  const isQuizPrompt = location.pathname === '/quiz-prompt';
  const hideNavigation = isOnboarding || isQuizPrompt;
  
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {!isQuizPrompt && <Header />}
      <main className={`flex-1 flex flex-col ${!isQuizPrompt ? 'pt-16' : ''} ${!hideNavigation ? 'pb-16' : ''} ${location.pathname === '/home' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {children || <Outlet />}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
