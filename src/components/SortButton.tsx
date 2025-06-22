
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortButtonProps {
  label: string;
  sortKey: string;
  currentSortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort: (key: string) => void;
}

const SortButton = ({ label, sortKey, currentSortConfig, onSort }: SortButtonProps) => {
  const isActive = currentSortConfig.key === sortKey;
  const direction = currentSortConfig.direction;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs font-medium text-gray-700 uppercase tracking-wide h-auto p-1 hover:bg-gray-100"
      onClick={() => onSort(sortKey)}
    >
      {label}
      {isActive && (
        direction === 'desc' ? 
        <ChevronDown size={12} className="ml-1" /> : 
        <ChevronUp size={12} className="ml-1" />
      )}
    </Button>
  );
};

export default SortButton;
