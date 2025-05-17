
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';

type HeaderProps = {
  title?: string;
  showProfileIcon?: boolean;
};

const Header: React.FC<HeaderProps> = ({ 
  title = "Fertility Companion", 
  showProfileIcon = true 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-4 flex justify-between items-center z-10">
      <h1 className="text-lg font-semibold text-primary-700">{title}</h1>
      {showProfileIcon && (
        <Link to="/profile" className="text-gray-700">
          <UserRound className="h-6 w-6" strokeWidth={1.5} />
        </Link>
      )}
    </header>
  );
};

export default Header;
