
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const menuItems = [
    { id: 'log-trade', label: 'Log Trade' },
    { id: 'performance', label: 'Performance' },
    { id: 'community', label: 'Community' }
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
    <div className="w-64 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col shadow-lg h-fit">
      <div className="mb-8">
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
                ? "bg-purple-100/70 text-purple-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200/50">
        {isLoggedIn ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 text-center">
              Welcome back, TradeGuru!
            </div>
            <Button 
              variant="outline" 
              className="w-full text-sm border-gray-300 hover:bg-white/70"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-8 bg-white rounded-3xl border-0 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                    <p className="text-gray-500 text-sm">
                      Enter your credentials to access your account
                    </p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="h-12 bg-gray-50 border-gray-200 rounded-lg px-4 text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="h-12 bg-gray-50 border-gray-200 rounded-lg px-4 pr-12 text-gray-900 placeholder:text-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-base"
                    >
                      Sign In
                    </Button>
                  </form>
                  
                  <div className="text-center text-sm text-gray-500">
                    Don't have an account? Contact us to get started.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
