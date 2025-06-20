import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  trades: number;
  successRate: number;
  avgAlpha: number;
}

interface Filter {
  min: string;
  max: string;
}

const initialUsers: User[] = [
  { id: '1', name: 'TradeGuru', trades: 45, successRate: 78, avgAlpha: 8.5 },
  { id: '2', name: 'MarketMaster', trades: 62, successRate: 85, avgAlpha: 10.2 },
  { id: '3', name: 'StockSage', trades: 30, successRate: 68, avgAlpha: 6.1 },
  { id: '4', name: 'AlphaAce', trades: 55, successRate: 92, avgAlpha: 12.8 },
  { id: '5', name: 'ValuationVirtuoso', trades: 22, successRate: 75, avgAlpha: 7.9 },
  { id: '6', name: 'TrendTracker', trades: 38, successRate: 80, avgAlpha: 9.5 },
];

const filterOptions = [
  { id: 'trades', label: 'Trades' },
  { id: 'successRate', label: 'Success Rate' },
  { id: 'avgAlpha', label: 'Avg Alpha' },
];

const Community = () => {
  const [users, setUsers] = useState(initialUsers);
  const [filters, setFilters] = useState<{ [key: string]: Filter }>({});
  const [viewMode, setViewMode] = useState<'all' | 'closed'>('all');

  const handleFilterChange = (filterId: string, type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: {
        ...prev[filterId],
        [type]: value,
      },
    }));
  };

  const applyFilter = (filterId: string) => {
    setUsers(initialUsers.filter(user => {
      const filter = filters[filterId];
      if (!filter) return true;

      const value = user[filterId as keyof User];
      const min = filter.min ? parseFloat(filter.min) : -Infinity;
      const max = filter.max ? parseFloat(filter.max) : Infinity;

      if (typeof value === 'number') {
        return value >= min && value <= max;
      }
      return true;
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setUsers(initialUsers);
  };

  const filteredUsers = viewMode === 'closed'
    ? users.filter(user => user.successRate > 70)
    : users;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Trading Community</h1>
          <p className="text-gray-300">Connect with fellow traders and compare performance</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Filter Leaderboard</h3>
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((filter) => (
              <Dialog key={filter.id}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    {filter.label}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">{filter.label} Filter</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-value" className="text-gray-300">Minimum</Label>
                        <Input
                          id="min-value"
                          type="number"
                          value={filters[filter.id]?.min || ''}
                          onChange={(e) => handleFilterChange(filter.id, 'min', e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-value" className="text-gray-300">Maximum</Label>
                        <Input
                          id="max-value"
                          type="number"
                          value={filters[filter.id]?.max || ''}
                          onChange={(e) => handleFilterChange(filter.id, 'max', e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="100"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => applyFilter(filter.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Apply Filter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
              <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'all' 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  All Trades
                </button>
                <button
                  onClick={() => setViewMode('closed')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'closed' 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Closed Only
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <button className="text-white font-medium hover:text-purple-300 transition-colors">
                        {user.name}
                      </button>
                      <p className="text-sm text-gray-400">{user.trades} trades</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-green-400 font-medium">{user.successRate}%</p>
                      <p className="text-gray-400">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-medium">{user.avgAlpha}%</p>
                      <p className="text-gray-400">Avg Alpha</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
