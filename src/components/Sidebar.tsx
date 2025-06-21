
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'log-trade', label: 'Log Trade' },
    { id: 'performance', label: 'Performance' },
    { id: 'community', label: 'Community' }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="w-64 h-screen bg-white border-r border-gray-100 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 p-8 flex flex-col">
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

        {/* Auth button placed right below Community */}
        <div className="pt-4">
          {user ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 text-center">
                Welcome back, {user.user_metadata?.full_name || 'Trader'}!
              </div>
              <Button 
                variant="outline" 
                className="w-full text-sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full text-sm bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
