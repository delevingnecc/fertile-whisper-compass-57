
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Stethoscope, Route } from 'lucide-react';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isMain?: boolean;
};

const BottomNavigation = () => {
  const navItems: NavItem[] = [
    {
      icon: <Package />,
      label: 'Products',
      to: '/products',
    },
    {
      icon: <Users />,
      label: 'Community',
      to: '/community',
    },
    {
      icon: <img src="/lovable-uploads/eb70d7b3-a429-42b6-aa8d-6f378554327b.png" alt="Chat" className="h-7 w-7" />,
      label: 'Chat',
      to: '/',
      isMain: true,
    },
    {
      icon: <Stethoscope />,
      label: 'Clinician',
      to: '/clinician',
    },
    {
      icon: <Route />,
      label: 'Journey',
      to: '/progress',
    },
  ];

  // Get the current path
  const currentPath = window.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-10">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`nav-icon flex flex-col items-center ${
            item.isMain ? 'transform -translate-y-3' : ''
          } ${currentPath === item.to ? 'active text-primary' : 'text-gray-500'}`}
        >
          <div className={`${item.isMain ? 'bg-primary rounded-full p-2 shadow-lg' : ''}`}>
            {React.isValidElement(item.icon) 
              ? React.cloneElement(item.icon as React.ReactElement, {
                  className: `${item.isMain ? 'h-6 w-6 text-white' : 'h-6 w-6'}`,
                  strokeWidth: 1.5,
                })
              : item.icon}
          </div>
          <span className={`text-xs mt-1 ${item.isMain ? 'font-medium' : ''}`}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
