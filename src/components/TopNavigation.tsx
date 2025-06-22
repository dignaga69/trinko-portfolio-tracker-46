
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TopNavigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Left side - TRINKO logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">TRINKO</h1>
        </div>
        
        {/* Right side - User controls */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="text-sm text-gray-500 text-center py-4">
                    No notifications yet
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
