
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart3, Users } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'log-trade', label: 'Log Trade', icon: FileText },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'community', label: 'Community', icon: Users }
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
        <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Monaco, monospace' }}>TRINKO</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeSection === item.id
                  ? "bg-gray-50 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-25"
              )}
            >
              <IconComponent size={18} />
              {item.label}
            </button>
          );
        })}

        {/* Auth section with separator */}
        <div className="pt-4">
          <Separator className="mb-4" />
          {user ? (
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
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
