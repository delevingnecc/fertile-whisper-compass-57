
import { ReactNode } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isOnboardingPage = location.pathname === '/onboarding';

  // Custom title based on the current path
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Chat';
      case '/community':
        return 'Community';
      case '/clinician':
        return 'Clinician';
      case '/progress':
        return 'Journey';
      case '/products':
        return 'Products';
      case '/profile':
        return 'Profile';
      case '/onboarding':
        return 'Welcome';
      default:
        return 'App';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={getTitle()} 
        showBackButton={isOnboardingPage}
      />
      <main className="flex-1 pt-16 pb-16">
        {children}
      </main>
      {!isOnboardingPage && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
