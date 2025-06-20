
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  username: string;
  numberOfTrades: number;
  successRateAll: number;
  averageAlphaAll: number;
  successRateClosed: number;
  averageAlphaClosed: number;
}

const Community = () => {
  const [sortField, setSortField] = useState<keyof LeaderboardUser>('averageAlphaAll');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    numberOfTrades: { min: '', max: '' },
    successRateAll: { min: '', max: '' },
    averageAlphaAll: { min: '', max: '' },
    successRateClosed: { min: '', max: '' },
    averageAlphaClosed: { min: '', max: '' }
  });

  // Mock data for leaderboard
  const mockUsers: LeaderboardUser[] = [
    {
      id: '1',
      username: 'TradeGuru',
      numberOfTrades: 45,
      successRateAll: 78.2,
      averageAlphaAll: 12.5,
      successRateClosed: 82.1,
      averageAlphaClosed: 15.3
    },
    {
      id: '2',
      username: 'AlphaHunter',
      numberOfTrades: 32,
      successRateAll: 71.9,
      averageAlphaAll: 8.7,
      successRateClosed: 75.0,
      averageAlphaClosed: 11.2
    },
    {
      id: '3',
      username: 'MarketMaster',
      numberOfTrades: 28,
      successRateAll: 85.7,
      averageAlphaAll: 14.2,
      successRateClosed: 89.3,
      averageAlphaClosed: 16.8
    },
    {
      id: '4',
      username: 'BullRunner',
      numberOfTrades: 15,
      successRateAll: 66.7,
      averageAlphaAll: 6.4,
      successRateClosed: 70.0,
      averageAlphaClosed: 8.1
    },
    {
      id: '5',
      username: 'ValueSeeker',
      numberOfTrades: 52,
      successRateAll: 73.1,
      averageAlphaAll: 9.8,
      successRateClosed: 76.9,
      averageAlphaClosed: 12.4
    }
  ];

  const handleSort = (field: keyof LeaderboardUser) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleUserClick = (username: string) => {
    console.log(`Navigating to ${username}'s profile`);
    // This would navigate to the user's profile page
  };

  const sortedUsers = [...mockUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (aValue > bValue ? 1 : -1) * multiplier;
  });

  const SortIcon = ({ field }: { field: keyof LeaderboardUser }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
          <div className="text-sm text-gray-600">
            Top performers with 5+ trades ranked by performance
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Number of Trades</label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Min"
                    className="text-xs h-8"
                    value={filters.numberOfTrades.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      numberOfTrades: { ...prev.numberOfTrades, min: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Max"
                    className="text-xs h-8"
                    value={filters.numberOfTrades.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      numberOfTrades: { ...prev.numberOfTrades, max: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Success Rate (All)</label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Min %"
                    className="text-xs h-8"
                    value={filters.successRateAll.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      successRateAll: { ...prev.successRateAll, min: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Max %"
                    className="text-xs h-8"
                    value={filters.successRateAll.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      successRateAll: { ...prev.successRateAll, max: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Avg Alpha (All)</label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Min %"
                    className="text-xs h-8"
                    value={filters.averageAlphaAll.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      averageAlphaAll: { ...prev.averageAlphaAll, min: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Max %"
                    className="text-xs h-8"
                    value={filters.averageAlphaAll.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      averageAlphaAll: { ...prev.averageAlphaAll, max: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Success Rate (Closed)</label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Min %"
                    className="text-xs h-8"
                    value={filters.successRateClosed.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      successRateClosed: { ...prev.successRateClosed, min: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Max %"
                    className="text-xs h-8"
                    value={filters.successRateClosed.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      successRateClosed: { ...prev.successRateClosed, max: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Avg Alpha (Closed)</label>
                <div className="flex gap-1">
                  <Input
                    placeholder="Min %"
                    className="text-xs h-8"
                    value={filters.averageAlphaClosed.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      averageAlphaClosed: { ...prev.averageAlphaClosed, min: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Max %"
                    className="text-xs h-8"
                    value={filters.averageAlphaClosed.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      averageAlphaClosed: { ...prev.averageAlphaClosed, max: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline">Apply Filters</Button>
              <Button size="sm" variant="ghost">Clear All</Button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Username
                  </th>
                  <th 
                    className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-gray-800"
                    onClick={() => handleSort('numberOfTrades')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Number of Trades
                      <SortIcon field="numberOfTrades" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    All Trades
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Closed Only
                  </th>
                </tr>
                <tr className="border-b border-gray-100">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="text-center py-2 px-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div 
                        className="cursor-pointer hover:text-gray-800 flex items-center justify-center gap-1"
                        onClick={() => handleSort('successRateAll')}
                      >
                        Success Rate
                        <SortIcon field="successRateAll" />
                      </div>
                      <div 
                        className="cursor-pointer hover:text-gray-800 flex items-center justify-center gap-1"
                        onClick={() => handleSort('averageAlphaAll')}
                      >
                        Avg Alpha
                        <SortIcon field="averageAlphaAll" />
                      </div>
                    </div>
                  </th>
                  <th className="text-center py-2 px-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div 
                        className="cursor-pointer hover:text-gray-800 flex items-center justify-center gap-1"
                        onClick={() => handleSort('successRateClosed')}
                      >
                        Success Rate
                        <SortIcon field="successRateClosed" />
                      </div>
                      <div 
                        className="cursor-pointer hover:text-gray-800 flex items-center justify-center gap-1"
                        onClick={() => handleSort('averageAlphaClosed')}
                      >
                        Avg Alpha
                        <SortIcon field="averageAlphaClosed" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-25">
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <button
                        onClick={() => handleUserClick(user.username)}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {user.username}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 text-right font-mono">
                      {user.numberOfTrades}
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono">{user.successRateAll.toFixed(1)}%</div>
                        <div className={`font-mono ${user.averageAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {user.averageAlphaAll >= 0 ? '+' : ''}{user.averageAlphaAll.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-mono">{user.successRateClosed.toFixed(1)}%</div>
                        <div className={`font-mono ${user.averageAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {user.averageAlphaClosed >= 0 ? '+' : ''}{user.averageAlphaClosed.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
