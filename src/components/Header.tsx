import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showProfileIcon?: boolean;
}

const Header = ({ title, showBackButton = false, showProfileIcon = true }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        {showProfileIcon && <ProfileMenu />}
      </div>
    </header>
  );
};

export default Header;
