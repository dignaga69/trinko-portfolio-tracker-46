
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    username: '' 
  });

  const menuItems = [
    { id: 'log-trade', label: 'Log Trade' },
    { id: 'performance', label: 'Performance' },
    { id: 'community', label: 'Community' },
    ...(isLoggedIn ? [{ id: 'profile', label: 'Profile' }] : [])
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would authenticate with backend
    console.log('Login attempted:', loginForm);
    setIsLoggedIn(true);
    setLoginForm({ email: '', password: '' });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - in real app, this would create account
    console.log('Signup attempted:', signupForm);
    setIsLoggedIn(true);
    setSignupForm({ email: '', password: '', confirmPassword: '', username: '' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (activeSection === 'profile') {
      onSectionChange('log-trade');
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 p-8 fixed left-0 top-0 flex flex-col">
      <div className="mb-12">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">TRINKO</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors",
              activeSection === item.id
                ? "bg-gray-50 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-25"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        {isLoggedIn ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 text-center">
              Welcome back, TradeGuru!
            </div>
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-sm">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-sm">
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
