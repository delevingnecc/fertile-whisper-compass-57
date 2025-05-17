
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 pb-16">
        {children || <Outlet />}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
