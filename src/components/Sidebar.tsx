
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasTrades: boolean;
}

const Sidebar = ({ activeSection, onSectionChange, hasTrades }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, alwaysShow: true },
    { id: 'log-trade', label: 'Log Trade', icon: TrendingUp, requiresTrades: false },
    { id: 'performance', label: 'Performance', icon: BarChart3, requiresTrades: true },
    { id: 'community', label: 'Community', icon: Users, requiresTrades: false }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted:', loginForm);
    setIsLoggedIn(true);
    setLoginForm({ email: '', password: '' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="w-64 h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 p-6 fixed left-0 top-0 flex flex-col">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-white tracking-tight">TRINKO</h1>
        <p className="text-sm text-gray-300 mt-1">Investment Tracker</p>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isDisabled = item.requiresTrades && !hasTrades;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onSectionChange(item.id)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                activeSection === item.id
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : isDisabled 
                    ? "text-gray-500 cursor-not-allowed opacity-50"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon size={18} />
              {item.label}
              {isDisabled && (
                <span className="ml-auto text-xs text-gray-500">
                  Log trade first
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        {isLoggedIn ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-300 text-center">
              Welcome back, TradeGuru!
            </div>
            <Button 
              variant="outline" 
              className="w-full text-sm bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Welcome back to TRINKO</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Sign In
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
