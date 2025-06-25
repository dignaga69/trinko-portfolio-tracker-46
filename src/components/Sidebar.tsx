
import { FileText, BarChart3, Trophy, Folder, Users } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const sidebarItems = [
    { id: 'portfolio', label: 'Portfolio', icon: Folder },
    { id: 'shared-portfolio', label: 'Shared Portfolios', icon: Users },
    { id: 'log-trade', label: 'Log Trade', icon: FileText },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="w-64 bg-gray-50 h-full pt-16 border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <IconComponent size={20} className="mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
