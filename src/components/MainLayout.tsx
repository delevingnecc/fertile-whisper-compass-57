
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
    <div className="flex flex-col min-h-screen h-screen bg-white">
      {!isQuizPrompt && <Header />}
      <main className={`flex-1 ${!isQuizPrompt ? 'pt-16' : ''} ${!hideNavigation ? 'pb-16' : ''} overflow-hidden`}>
        <div className="h-full overflow-y-auto">
          {children || <Outlet />}
        </div>
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
