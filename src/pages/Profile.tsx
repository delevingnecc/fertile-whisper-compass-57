
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Bell, Shield, UserCog, HelpCircle, LogOut, Share2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  
  const settingSections = [
    {
      title: "Account",
      items: [
        {
          icon: <UserCog className="h-5 w-5 text-gray-500" />,
          title: "Personal Information",
          description: "Update your profile details",
          action: <ChevronRight className="h-5 w-5 text-gray-400" />,
          path: "/profile/personal"
        },
        {
          icon: <Bell className="h-5 w-5 text-gray-500" />,
          title: "Notifications",
          description: "Manage your notification preferences",
          action: <ChevronRight className="h-5 w-5 text-gray-400" />,
          path: "/profile/notifications"
        },
        {
          icon: <Shield className="h-5 w-5 text-gray-500" />,
          title: "Privacy Settings",
          description: "Control your data and visibility",
          action: <ChevronRight className="h-5 w-5 text-gray-400" />,
          path: "/profile/privacy"
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: <Share2 className="h-5 w-5 text-gray-500" />,
          title: "Partner Sharing",
          description: "Share your journey with a partner",
          action: <Switch id="partner-sharing" />,
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle className="h-5 w-5 text-gray-500" />,
          title: "Help Center",
          description: "Find answers to common questions",
          action: <ChevronRight className="h-5 w-5 text-gray-400" />,
          path: "/help"
        }
      ]
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Profile & Settings" showProfileIcon={false} />
      
      <div className="flex-1 pt-16 pb-6">
        <div className="px-4 py-6">
          <div className="flex items-center mb-6">
            <Avatar className="h-16 w-16 mr-4 border-2 border-white shadow-sm">
              <AvatarImage src="/user-avatar.png" />
              <AvatarFallback className="bg-primary text-white">SA</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Sarah Anderson</h2>
              <p className="text-sm text-gray-600">sarah.anderson@example.com</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mb-6 bg-white"
            onClick={() => navigate('/subscription')}
          >
            Upgrade to Premium
          </Button>
          
          {settingSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">{section.title}</h3>
              <Card>
                {section.items.map((item, i) => (
                  <React.Fragment key={i}>
                    <CardContent 
                      className={`flex items-center justify-between p-4 ${
                        item.path ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={() => item.path && navigate(item.path)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">{item.icon}</div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <div>{item.action}</div>
                    </CardContent>
                    {i < section.items.length - 1 && (
                      <div className="border-t border-gray-100 mx-4"></div>
                    )}
                  </React.Fragment>
                ))}
              </Card>
            </div>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 mt-6"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">FertilityPal v1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">©2025 FertilityPal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
