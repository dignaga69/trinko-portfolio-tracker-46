
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onApply: (condition: string, value: string, value2?: string) => void;
  currentCondition?: string;
  currentValue?: string;
  currentValue2?: string;
}

const FilterDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  onApply, 
  currentCondition = 'above-equal',
  currentValue = '',
  currentValue2 = ''
}: FilterDialogProps) => {
  const [condition, setCondition] = useState(currentCondition);
  const [value, setValue] = useState(currentValue);
  const [value2, setValue2] = useState(currentValue2);

  const handleApply = () => {
    onApply(condition, value, value2);
    onClose();
  };

  const handleCancel = () => {
    setCondition(currentCondition);
    setValue(currentValue);
    setValue2(currentValue2);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
          <div className="flex items-center">
            <ChevronLeft className="h-5 w-5 mr-2" />
            <DialogTitle className="text-lg font-semibold">Manual setup</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 uppercase tracking-wide mb-2 block">
              {title}
            </label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="above-equal">Above or equal</SelectItem>
                <SelectItem value="below">Below</SelectItem>
                <SelectItem value="below-equal">Below or equal</SelectItem>
                <SelectItem value="equal">Equal</SelectItem>
                <SelectItem value="between">Between</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-400 uppercase tracking-wide mb-2 block">
              {condition === 'between' ? 'FROM' : 'VALUE'}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="0"
            />
          </div>

          {condition === 'between' && (
            <div>
              <label className="text-sm text-gray-400 uppercase tracking-wide mb-2 block">
                TO
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="bg-white text-black hover:bg-gray-200"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
