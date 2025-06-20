
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
    // Mock login - in real app, this would authenticate with backend
    console.log('Login attempted:', loginForm);
    setIsLoggedIn(true);
    setLoginForm({ email: '', password: '' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
                <Button className="w-full text-sm bg-red-500 hover:bg-red-600 text-white">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-8 bg-white rounded-3xl border-0 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Sign in to TRINKO</h2>
                    <p className="text-gray-500 text-sm">
                      Don't have an account? <span className="text-red-500 font-medium cursor-pointer">Sign up</span>
                    </p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Sofia Dunkan"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="h-14 bg-gray-50 border-0 rounded-2xl px-4 text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="email"
                        placeholder="he"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="h-14 bg-gray-50 border-0 rounded-2xl px-4 text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="h-14 bg-gray-50 border-0 rounded-2xl px-4 pr-12 text-gray-900 placeholder:text-gray-400"
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
                      className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-medium rounded-2xl text-base"
                    >
                      Continue
                    </Button>
                  </form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-14 bg-pink-50 border-pink-200 rounded-2xl hover:bg-pink-100"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-14 h-14 bg-blue-50 border-blue-200 rounded-2xl hover:bg-blue-100 p-0"
                    >
                      <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-14 h-14 bg-gray-50 border-gray-200 rounded-2xl hover:bg-gray-100 p-0"
                    >
                      <svg className="w-6 h-6" fill="#000" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </Button>
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
