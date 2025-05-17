
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, TrendingUp, Package, Home } from 'lucide-react';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

const BottomNavigation = () => {
  const navItems: NavItem[] = [
    {
      icon: <Home />,
      label: 'Home',
      to: '/',
    },
    {
      icon: <Users />,
      label: 'Community',
      to: '/community',
    },
    {
      icon: <Stethoscope />,
      label: 'Clinician',
      to: '/clinician',
    },
    {
      icon: <TrendingUp />,
      label: 'Progress',
      to: '/progress',
    },
    {
      icon: <Package />,
      label: 'Products',
      to: '/products',
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
          className={`nav-icon ${currentPath === item.to ? 'active' : 'text-gray-500'}`}
        >
          {React.cloneElement(item.icon as React.ReactElement, {
            className: "h-6 w-6",
            strokeWidth: 1.5,
          })}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
