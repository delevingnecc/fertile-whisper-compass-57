
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showProfileIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, showProfileIcon = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {showBackButton ? (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        ) : (
          <div className="w-10" />
        )}

        {title && (
          <h1 className="text-lg font-medium text-center flex-1">{title}</h1>
        )}

        <div className="w-10 flex justify-end">
          {user && showProfileIcon && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
