
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { FileText, BarChart3, Trophy, Briefcase } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { user, loading } = useAuth();

  const menuItems = [
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'log-trade', label: 'Log Trade', icon: FileText },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  if (loading) {
    return (
      <div className="w-64 h-full bg-white border-r border-gray-100 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-white border-r border-gray-100 p-8 flex flex-col">
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
      </nav>
    </div>
  );
};

export default Sidebar;
