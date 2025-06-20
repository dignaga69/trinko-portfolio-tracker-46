
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'log-trade', label: 'Log Trade' },
    { id: 'performance', label: 'Performance' },
    { id: 'community', label: 'Community' }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 p-8 fixed left-0 top-0">
      <div className="mb-12">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">TRINKO</h1>
      </div>
      
      <nav className="space-y-2">
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
    </div>
  );
};

export default Sidebar;
