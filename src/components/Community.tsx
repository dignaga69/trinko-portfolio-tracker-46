
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Community = () => {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, { min: number; max: number }>>({});

  const mockLeaderboardData = [
    {
      id: '1',
      name: 'TradeGuru',
      avatar: '',
      trades: 42,
      successRateAll: 78.5,
      avgAlphaAll: 12.3,
      successRateClosed: 82.1,
      avgAlphaClosed: 15.7,
    },
    {
      id: '2',
      name: 'StockMaster',
      avatar: '',
      trades: 38,
      successRateAll: 72.3,
      avgAlphaAll: 9.8,
      successRateClosed: 75.6,
      avgAlphaClosed: 11.2,
    },
    {
      id: '3',
      name: 'InvestPro',
      avatar: '',
      trades: 55,
      successRateAll: 68.9,
      avgAlphaAll: 8.5,
      successRateClosed: 71.4,
      avgAlphaClosed: 10.1,
    },
  ];

  const filterOptions = [
    { key: 'trades', label: 'Number of Trades', getValue: (user: any) => user.trades },
    { key: 'successRateAll', label: 'Success Rate (All)', getValue: (user: any) => user.successRateAll },
    { key: 'avgAlphaAll', label: 'Average Alpha (All)', getValue: (user: any) => user.avgAlphaAll },
    { key: 'successRateClosed', label: 'Success Rate (Closed)', getValue: (user: any) => user.successRateClosed },
    { key: 'avgAlphaClosed', label: 'Average Alpha (Closed)', getValue: (user: any) => user.avgAlphaClosed },
  ];

  const FilterDialog = ({ filterKey, label }: { filterKey: string; label: string }) => {
    const [minValue, setMinValue] = useState(appliedFilters[filterKey]?.min?.toString() || '');
    const [maxValue, setMaxValue] = useState(appliedFilters[filterKey]?.max?.toString() || '');
    const [open, setOpen] = useState(false);

    const handleApplyFilter = () => {
      const min = parseFloat(minValue) || 0;
      const max = parseFloat(maxValue) || Infinity;
      
      if (min > 0 || max < Infinity) {
        setAppliedFilters(prev => ({
          ...prev,
          [filterKey]: { min, max }
        }));
      } else {
        setAppliedFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters[filterKey];
          return newFilters;
        });
      }
      setOpen(false);
    };

    const handleClearFilter = () => {
      setMinValue('');
      setMaxValue('');
      setAppliedFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[filterKey];
        return newFilters;
      });
      setOpen(false);
    };

    const isActive = appliedFilters[filterKey];

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isActive ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
          >
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter by {label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum</Label>
                <Input
                  id="min"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum</Label>
                <Input
                  id="max"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="No limit"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleApplyFilter} className="flex-1">
                Apply Filter
              </Button>
              <Button variant="outline" onClick={handleClearFilter}>
                Clear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const filteredLeaderboard = mockLeaderboardData.filter(user => {
    return Object.entries(appliedFilters).every(([key, range]) => {
      const filterOption = filterOptions.find(f => f.key === key);
      if (!filterOption) return true;
      
      const value = filterOption.getValue(user);
      return value >= range.min && value <= range.max;
    });
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <FilterDialog
                  key={filter.key}
                  filterKey={filter.key}
                  label={filter.label}
                />
              ))}
            </div>

            <div className="space-y-3">
              {filteredLeaderboard.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No traders match your current filters.
                </p>
              ) : (
                filteredLeaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
                        #{index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-sm font-semibold">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.trades} trades</div>
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{user.successRateAll.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Success (All)</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${user.avgAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {user.avgAlphaAll >= 0 ? '+' : ''}{user.avgAlphaAll.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Alpha (All)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{user.successRateClosed.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Success (Closed)</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${user.avgAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {user.avgAlphaClosed >= 0 ? '+' : ''}{user.avgAlphaClosed.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Alpha (Closed)</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
