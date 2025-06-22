
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onApply: (condition: string, value: string, value2?: string) => void;
  currentCondition?: string;
  currentValue?: string;
  currentValue2?: string;
  isDateFilter?: boolean;
}

const FilterDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  onApply, 
  currentCondition = 'above-equal',
  currentValue = '',
  currentValue2 = '',
  isDateFilter = false
}: FilterDialogProps) => {
  const [condition, setCondition] = useState(currentCondition);
  const [value, setValue] = useState(currentValue);
  const [value2, setValue2] = useState(currentValue2);
  
  // For date filters
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [day2, setDay2] = useState('');
  const [month2, setMonth2] = useState('');
  const [year2, setYear2] = useState('');

  const handleApply = () => {
    if (isDateFilter) {
      const dateValue = year && month && day ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';
      const dateValue2 = year2 && month2 && day2 ? `${year2}-${month2.padStart(2, '0')}-${day2.padStart(2, '0')}` : '';
      onApply(condition, dateValue, dateValue2);
    } else {
      onApply(condition, value, value2);
    }
    onClose();
  };

  const handleCancel = () => {
    setCondition(currentCondition);
    setValue(currentValue);
    setValue2(currentValue2);
    if (isDateFilter) {
      setDay('');
      setMonth('');
      setYear('');
      setDay2('');
      setMonth2('');
      setYear2('');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 p-4 bg-white border border-gray-200 shadow-lg rounded-md">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
            {title}
          </label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 z-50">
              <SelectItem value="above" className="text-xs">Above</SelectItem>
              <SelectItem value="above-equal" className="text-xs">Above or equal</SelectItem>
              <SelectItem value="below" className="text-xs">Below</SelectItem>
              <SelectItem value="below-equal" className="text-xs">Below or equal</SelectItem>
              <SelectItem value="equal" className="text-xs">Equal</SelectItem>
              <SelectItem value="between" className="text-xs">Between</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isDateFilter ? (
          <>
            <div>
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
                {condition === 'between' ? 'FROM DATE' : 'DATE'}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="text-xs"
                  min="1"
                  max="31"
                />
                <Input
                  type="number"
                  placeholder="Month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="text-xs"
                  min="1"
                  max="12"
                />
                <Input
                  type="number"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="text-xs"
                  min="2020"
                  max="2030"
                />
              </div>
            </div>

            {condition === 'between' && (
              <div>
                <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
                  TO DATE
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Day"
                    value={day2}
                    onChange={(e) => setDay2(e.target.value)}
                    className="text-xs"
                    min="1"
                    max="31"
                  />
                  <Input
                    type="number"
                    placeholder="Month"
                    value={month2}
                    onChange={(e) => setMonth2(e.target.value)}
                    className="text-xs"
                    min="1"
                    max="12"
                  />
                  <Input
                    type="number"
                    placeholder="Year"
                    value={year2}
                    onChange={(e) => setYear2(e.target.value)}
                    className="text-xs"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
                {condition === 'between' ? 'FROM' : 'VALUE'}
              </label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-xs"
                placeholder="0"
              />
            </div>

            {condition === 'between' && (
              <div>
                <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
                  TO
                </label>
                <Input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="text-xs"
                  placeholder="0"
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="text-xs px-3 py-1 h-8"
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          className="text-xs px-3 py-1 h-8"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default FilterDialog;
