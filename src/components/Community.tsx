import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronUp, ChevronDown, EyeOff, Search, ChevronDown as ChevronDownIcon } from 'lucide-react';
import FilterDialog from './FilterDialog';
import SortButton from './SortButton';

interface CommunityProps {
  isUserPrivate?: boolean;
}

interface FilterState {
  condition: string;
  value: string;
  value2?: string;
}

const Community = ({ isUserPrivate = false }: CommunityProps) => {
  const [activeView, setActiveView] = useState<'users' | 'portfolios' | 'trades'>('users');
  const [bestTradesTimeframe, setBestTradesTimeframe] = useState('ALL');
  const [bestTradesSortConfig, setBestTradesSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'alpha', direction: 'desc' });
  
  const [leaderboardSortConfig, setLeaderboardSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'avgAlphaAll', direction: 'desc' });

  const [portfolioLeaderboardSortConfig, setPortfolioLeaderboardSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'avgAlphaAll', direction: 'desc' });

  // Pagination states
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [portfolioLeaderboardPage, setPortfolioLeaderboardPage] = useState(1);
  const [bestTradesPage, setBestTradesPage] = useState(1);
  const rowsPerPage = 20;

  // Search states
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [portfolioLeaderboardSearch, setPortfolioLeaderboardSearch] = useState('');
  const [bestTradesSearch, setBestTradesSearch] = useState('');

  // Advanced filter states for Leaderboard
  const [leaderboardFilters, setLeaderboardFilters] = useState({
    tradesTotal: { condition: '', value: '', value2: '' },
    tradesClosed: { condition: '', value: '', value2: '' },
    successRateAll: { condition: '', value: '', value2: '' },
    avgAlphaAll: { condition: '', value: '', value2: '' },
    successRateClosed: { condition: '', value: '', value2: '' },
    avgAlphaClosed: { condition: '', value: '', value2: '' }
  });

  // Advanced filter states for Portfolio Leaderboard
  const [portfolioLeaderboardFilters, setPortfolioLeaderboardFilters] = useState({
    tradesPortfolio: { condition: '', value: '', value2: '' },
    tradesClosed: { condition: '', value: '', value2: '' },
    successRateAll: { condition: '', value: '', value2: '' },
    avgAlphaAll: { condition: '', value: '', value2: '' },
    successRateClosed: { condition: '', value: '', value2: '' },
    avgAlphaClosed: { condition: '', value: '', value2: '' }
  });

  // Advanced filter states for Best Trades
  const [bestTradesFilters, setBestTradesFilters] = useState({
    entryDate: { condition: '', value: '', value2: '' },
    side: '',
    closeDate: { condition: '', value: '', value2: '' },
    alpha: { condition: '', value: '', value2: '' }
  });

  // Dialog states
  const [activeFilterDialog, setActiveFilterDialog] = useState<string | null>(null);

  // Mock data for Best Trades (expanded for pagination demo)
  const mockBestTrades = Array.from({ length: 50 }, (_, i) => ({
    ticker: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL'][i % 5],
    entryDate: new Date(2024, Math.floor(i / 10), (i % 10) + 1).toISOString().split('T')[0],
    side: i % 2 === 0 ? 'LONG' : 'SHORT',
    entryPrice: 150 + (i * 10),
    closeDate: new Date(2024, Math.floor(i / 10) + 1, (i % 10) + 1).toISOString().split('T')[0],
    exitPrice: 160 + (i * 10),
    tickerReturn: -10 + (i % 20),
    sp500Return: -5 + (i % 10),
    alpha: -15 + (i % 30),
    user: ['TradeGuru', 'StockMaster', 'InvestPro', 'MarketWiz', 'TradeLord'][i % 5]
  }));

  // Mock data for Leaderboard (expanded for pagination demo)
  const mockLeaderboard = Array.from({ length: 45 }, (_, i) => ({
    user: `Trader${i + 1}`,
    tradesTotal: 20 + (i % 50),
    tradesClosed: 15 + (i % 40),
    successRateAll: 50 + (i % 40),
    avgAlphaAll: -5 + (i % 25),
    successRateClosed: 55 + (i % 35),
    avgAlphaClosed: -3 + (i % 20),
  }));

  // Mock data for Portfolio Leaderboard
  const mockPortfolioLeaderboard = Array.from({ length: 40 }, (_, i) => ({
    portfolio: ['Tech Growth', 'Value Plays', 'Momentum', 'Blue Chips', 'Small Caps'][i % 5],
    user: `Trader${Math.floor(i / 5) + 1}`,
    tradesPortfolio: 5 + (i % 20),
    tradesClosed: 3 + (i % 15),
    successRateAll: 45 + (i % 50),
    avgAlphaAll: -8 + (i % 30),
    successRateClosed: 50 + (i % 40),
    avgAlphaClosed: -5 + (i % 25),
  }));

  // Filter helper function
  const checkFilterCondition = (value: number, filter: FilterState): boolean => {
    if (!filter.condition || !filter.value) return true;
    
    const filterValue = Number(filter.value);
    const filterValue2 = filter.value2 ? Number(filter.value2) : 0;
    
    switch (filter.condition) {
      case 'above':
        return value > filterValue;
      case 'above-equal':
        return value >= filterValue;
      case 'below':
        return value < filterValue;
      case 'below-equal':
        return value <= filterValue;
      case 'equal':
        return value === filterValue;
      case 'between':
        return value >= filterValue && value <= filterValue2;
      default:
        return true;
    }
  };

  const checkDateFilterCondition = (dateStr: string, filter: FilterState): boolean => {
    if (!filter.condition || !filter.value) return true;
    
    const date = new Date(dateStr);
    const filterDate = new Date(filter.value);
    const filterDate2 = filter.value2 ? new Date(filter.value2) : new Date();
    
    switch (filter.condition) {
      case 'above':
        return date > filterDate;
      case 'above-equal':
        return date >= filterDate;
      case 'below':
        return date < filterDate;
      case 'below-equal':
        return date <= filterDate;
      case 'equal':
        return date.toDateString() === filterDate.toDateString();
      case 'between':
        return date >= filterDate && date <= filterDate2;
      default:
        return true;
    }
  };

  const handleBestTradesSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (bestTradesSortConfig.key === key && bestTradesSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setBestTradesSortConfig({ key, direction });
    setBestTradesPage(1);
  };

  const handleLeaderboardSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (leaderboardSortConfig.key === key && leaderboardSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setLeaderboardSortConfig({ key, direction });
    setLeaderboardPage(1);
  };

  const handlePortfolioLeaderboardSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (portfolioLeaderboardSortConfig.key === key && portfolioLeaderboardSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setPortfolioLeaderboardSortConfig({ key, direction });
    setPortfolioLeaderboardPage(1);
  };

  // Updated filter functions
  const filterLeaderboard = (data: typeof mockLeaderboard) => {
    return data.filter(item => {
      if (leaderboardSearch && !item.user.toLowerCase().includes(leaderboardSearch.toLowerCase())) return false;
      if (!checkFilterCondition(item.tradesTotal, leaderboardFilters.tradesTotal)) return false;
      if (!checkFilterCondition(item.tradesClosed, leaderboardFilters.tradesClosed)) return false;
      if (!checkFilterCondition(item.successRateAll, leaderboardFilters.successRateAll)) return false;
      if (!checkFilterCondition(item.avgAlphaAll, leaderboardFilters.avgAlphaAll)) return false;
      if (!checkFilterCondition(item.successRateClosed, leaderboardFilters.successRateClosed)) return false;
      if (!checkFilterCondition(item.avgAlphaClosed, leaderboardFilters.avgAlphaClosed)) return false;
      return true;
    });
  };

  const filterPortfolioLeaderboard = (data: typeof mockPortfolioLeaderboard) => {
    return data.filter(item => {
      if (portfolioLeaderboardSearch && 
          !item.portfolio.toLowerCase().includes(portfolioLeaderboardSearch.toLowerCase()) &&
          !item.user.toLowerCase().includes(portfolioLeaderboardSearch.toLowerCase())) return false;
      if (!checkFilterCondition(item.tradesPortfolio, portfolioLeaderboardFilters.tradesPortfolio)) return false;
      if (!checkFilterCondition(item.tradesClosed, portfolioLeaderboardFilters.tradesClosed)) return false;
      if (!checkFilterCondition(item.successRateAll, portfolioLeaderboardFilters.successRateAll)) return false;
      if (!checkFilterCondition(item.avgAlphaAll, portfolioLeaderboardFilters.avgAlphaAll)) return false;
      if (!checkFilterCondition(item.successRateClosed, portfolioLeaderboardFilters.successRateClosed)) return false;
      if (!checkFilterCondition(item.avgAlphaClosed, portfolioLeaderboardFilters.avgAlphaClosed)) return false;
      return true;
    });
  };

  const filterBestTrades = (data: typeof mockBestTrades) => {
    return data.filter(item => {
      if (bestTradesSearch && 
          !item.user.toLowerCase().includes(bestTradesSearch.toLowerCase()) && 
          !item.ticker.toLowerCase().includes(bestTradesSearch.toLowerCase())) return false;
      if (!checkDateFilterCondition(item.entryDate, bestTradesFilters.entryDate)) return false;
      if (bestTradesFilters.side && bestTradesFilters.side !== 'all' && item.side !== bestTradesFilters.side) return false;
      if (!checkDateFilterCondition(item.closeDate, bestTradesFilters.closeDate)) return false;
      if (!checkFilterCondition(item.alpha, bestTradesFilters.alpha)) return false;
      return true;
    });
  };

  // Apply filters and sorting
  const filteredLeaderboard = filterLeaderboard(mockLeaderboard);
  const filteredPortfolioLeaderboard = filterPortfolioLeaderboard(mockPortfolioLeaderboard);
  const filteredBestTrades = filterBestTrades(mockBestTrades);

  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
    const { key, direction } = leaderboardSortConfig;
    let aValue, bValue;
    
    switch (key) {
      case 'user':
        aValue = a.user;
        bValue = b.user;
        break;
      case 'tradesTotal':
        aValue = a.tradesTotal;
        bValue = b.tradesTotal;
        break;
      case 'tradesClosed':
        aValue = a.tradesClosed;
        bValue = b.tradesClosed;
        break;
      case 'successRateAll':
        aValue = a.successRateAll;
        bValue = b.successRateAll;
        break;
      case 'avgAlphaAll':
        aValue = a.avgAlphaAll;
        bValue = b.avgAlphaAll;
        break;
      case 'successRateClosed':
        aValue = a.successRateClosed;
        bValue = b.successRateClosed;
        break;
      case 'avgAlphaClosed':
        aValue = a.avgAlphaClosed;
        bValue = b.avgAlphaClosed;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedPortfolioLeaderboard = [...filteredPortfolioLeaderboard].sort((a, b) => {
    const { key, direction } = portfolioLeaderboardSortConfig;
    let aValue, bValue;
    
    switch (key) {
      case 'portfolio':
        aValue = a.portfolio;
        bValue = b.portfolio;
        break;
      case 'user':
        aValue = a.user;
        bValue = b.user;
        break;
      case 'tradesPortfolio':
        aValue = a.tradesPortfolio;
        bValue = b.tradesPortfolio;
        break;
      case 'tradesClosed':
        aValue = a.tradesClosed;
        bValue = b.tradesClosed;
        break;
      case 'successRateAll':
        aValue = a.successRateAll;
        bValue = b.successRateAll;
        break;
      case 'avgAlphaAll':
        aValue = a.avgAlphaAll;
        bValue = b.avgAlphaAll;
        break;
      case 'successRateClosed':
        aValue = a.successRateClosed;
        bValue = b.successRateClosed;
        break;
      case 'avgAlphaClosed':
        aValue = a.avgAlphaClosed;
        bValue = b.avgAlphaClosed;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedBestTrades = [...filteredBestTrades].sort((a, b) => {
    const { key, direction } = bestTradesSortConfig;
    let aValue, bValue;
    
    switch (key) {
      case 'ticker':
        aValue = a.ticker;
        bValue = b.ticker;
        break;
      case 'entryDate':
        aValue = new Date(a.entryDate);
        bValue = new Date(b.entryDate);
        break;
      case 'side':
        aValue = a.side;
        bValue = b.side;
        break;
      case 'entryPrice':
        aValue = a.entryPrice;
        bValue = b.entryPrice;
        break;
      case 'closeDate':
        aValue = new Date(a.closeDate);
        bValue = new Date(b.closeDate);
        break;
      case 'exitPrice':
        aValue = a.exitPrice;
        bValue = b.exitPrice;
        break;
      case 'tickerReturn':
        aValue = a.tickerReturn;
        bValue = b.tickerReturn;
        break;
      case 'sp500Return':
        aValue = a.sp500Return;
        bValue = b.sp500Return;
        break;
      case 'alpha':
        aValue = a.alpha;
        bValue = b.alpha;
        break;
      case 'user':
        aValue = a.user;
        bValue = b.user;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const paginatedLeaderboard = sortedLeaderboard.slice(
    (leaderboardPage - 1) * rowsPerPage,
    leaderboardPage * rowsPerPage
  );

  const paginatedPortfolioLeaderboard = sortedPortfolioLeaderboard.slice(
    (portfolioLeaderboardPage - 1) * rowsPerPage,
    portfolioLeaderboardPage * rowsPerPage
  );

  const paginatedBestTrades = sortedBestTrades.slice(
    (bestTradesPage - 1) * rowsPerPage,
    bestTradesPage * rowsPerPage
  );

  const leaderboardTotalPages = Math.ceil(sortedLeaderboard.length / rowsPerPage);
  const portfolioLeaderboardTotalPages = Math.ceil(sortedPortfolioLeaderboard.length / rowsPerPage);
  const bestTradesTotalPages = Math.ceil(sortedBestTrades.length / rowsPerPage);

  // Filter handlers
  const handleLeaderboardFilter = (filterKey: string, condition: string, value: string, value2?: string) => {
    setLeaderboardFilters(prev => ({
      ...prev,
      [filterKey]: { condition, value, value2: value2 || '' }
    }));
    setLeaderboardPage(1);
    setActiveFilterDialog(null);
  };

  const handlePortfolioLeaderboardFilter = (filterKey: string, condition: string, value: string, value2?: string) => {
    setPortfolioLeaderboardFilters(prev => ({
      ...prev,
      [filterKey]: { condition, value, value2: value2 || '' }
    }));
    setPortfolioLeaderboardPage(1);
    setActiveFilterDialog(null);
  };

  const handleBestTradesFilter = (filterKey: string, condition: string, value: string, value2?: string) => {
    setBestTradesFilters(prev => ({
      ...prev,
      [filterKey]: { condition, value, value2: value2 || '' }
    }));
    setBestTradesPage(1);
    setActiveFilterDialog(null);
  };

  const FilterButton = ({ 
    label, 
    filterKey, 
    hasActiveFilter,
    isDateFilter = false
  }: { 
    label: string; 
    filterKey: string; 
    hasActiveFilter: boolean;
    isDateFilter?: boolean;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 px-3 font-medium"
        >
          {label}
          {hasActiveFilter && <span className="ml-1 text-orange-500">•</span>}
          <ChevronDownIcon size={12} className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-0 shadow-none bg-transparent" align="start">
        <FilterDialog
          isOpen={true}
          onClose={() => {}}
          title={label}
          onApply={(condition, value, value2) => {
            if (filterKey.startsWith('leaderboard-')) {
              handleLeaderboardFilter(filterKey.replace('leaderboard-', ''), condition, value, value2);
            } else if (filterKey.startsWith('portfolioLeaderboard-')) {
              handlePortfolioLeaderboardFilter(filterKey.replace('portfolioLeaderboard-', ''), condition, value, value2);
            } else {
              handleBestTradesFilter(filterKey.replace('bestTrades-', ''), condition, value, value2);
            }
          }}
          currentCondition={
            filterKey.startsWith('leaderboard-') ? 
              leaderboardFilters[filterKey.replace('leaderboard-', '') as keyof typeof leaderboardFilters]?.condition :
            filterKey.startsWith('portfolioLeaderboard-') ?
              portfolioLeaderboardFilters[filterKey.replace('portfolioLeaderboard-', '') as keyof typeof portfolioLeaderboardFilters]?.condition :
              (filterKey.replace('bestTrades-', '') === 'side' ? '' : 
               (bestTradesFilters[filterKey.replace('bestTrades-', '') as keyof typeof bestTradesFilters] as any)?.condition)
          }
          currentValue={
            filterKey.startsWith('leaderboard-') ? 
              leaderboardFilters[filterKey.replace('leaderboard-', '') as keyof typeof leaderboardFilters]?.value :
            filterKey.startsWith('portfolioLeaderboard-') ?
              portfolioLeaderboardFilters[filterKey.replace('portfolioLeaderboard-', '') as keyof typeof portfolioLeaderboardFilters]?.value :
              (filterKey.replace('bestTrades-', '') === 'side' ? '' : 
               (bestTradesFilters[filterKey.replace('bestTrades-', '') as keyof typeof bestTradesFilters] as any)?.value)
          }
          currentValue2={
            filterKey.startsWith('leaderboard-') ? 
              leaderboardFilters[filterKey.replace('leaderboard-', '') as keyof typeof leaderboardFilters]?.value2 :
            filterKey.startsWith('portfolioLeaderboard-') ?
              portfolioLeaderboardFilters[filterKey.replace('portfolioLeaderboard-', '') as keyof typeof portfolioLeaderboardFilters]?.value2 :
              (filterKey.replace('bestTrades-', '') === 'side' ? '' : 
               (bestTradesFilters[filterKey.replace('bestTrades-', '') as keyof typeof bestTradesFilters] as any)?.value2)
          }
          isDateFilter={isDateFilter}
        />
      </PopoverContent>
    </Popover>
  );

  const PrivacyOverlay = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center space-y-3">
        <EyeOff size={48} className="mx-auto text-gray-400" />
        <div>
          <h3 className="font-semibold text-gray-900">Content Hidden</h3>
          <p className="text-sm text-gray-600 max-w-xs">
            You've set your performance to private, so you cannot view other users' performances.
          </p>
        </div>
      </div>
    </div>
  );

  const getActiveTitle = () => {
    switch (activeView) {
      case 'users':
        return 'Top Users';
      case 'portfolios':
        return 'Top Portfolios';
      case 'trades':
        return 'Top Trades';
      default:
        return 'Top Users';
    }
  };

  const getActiveDescription = () => {
    switch (activeView) {
      case 'users':
        return 'The best shot-callers. Statistics derived from personal portfolios only.';
      case 'portfolios':
        return 'The best performing portfolios. Statistics derived from personal portfolios only.';
      case 'trades':
        return 'The best trades. Statistics derived from all portfolios.';
      default:
        return 'The best shot-callers. Statistics derived from personal portfolios only.';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-gray-50 relative">
        {isUserPrivate && <PrivacyOverlay />}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{getActiveTitle()}</h1>
              <p className="text-sm italic text-gray-600 mt-2">
                {getActiveDescription()}
              </p>
            </div>
            <div className="flex space-x-1 bg-white p-1 rounded-lg border">
              <button
                onClick={() => setActiveView('users')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'users' 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Top Users
              </button>
              <button
                onClick={() => setActiveView('portfolios')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'portfolios' 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Top Portfolios
              </button>
              <button
                onClick={() => setActiveView('trades')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'trades' 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Top Trades
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {activeView === 'users' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search by user..."
                  value={leaderboardSearch}
                  onChange={(e) => {
                    setLeaderboardSearch(e.target.value);
                    setLeaderboardPage(1);
                  }}
                  className="pl-10 text-sm"
                />
              </div>
              
              {/* Advanced Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="Trades (Total)"
                  filterKey="leaderboard-tradesTotal"
                  hasActiveFilter={!!leaderboardFilters.tradesTotal.condition}
                />
                <FilterButton
                  label="Trades (Closed)"
                  filterKey="leaderboard-tradesClosed"
                  hasActiveFilter={!!leaderboardFilters.tradesClosed.condition}
                />
                <FilterButton
                  label="Success Rate (All)"
                  filterKey="leaderboard-successRateAll"
                  hasActiveFilter={!!leaderboardFilters.successRateAll.condition}
                />
                <FilterButton
                  label="Avg Alpha (All)"
                  filterKey="leaderboard-avgAlphaAll"
                  hasActiveFilter={!!leaderboardFilters.avgAlphaAll.condition}
                />
                <FilterButton
                  label="Success Rate (Closed)"
                  filterKey="leaderboard-successRateClosed"
                  hasActiveFilter={!!leaderboardFilters.successRateClosed.condition}
                />
                <FilterButton
                  label="Avg Alpha (Closed)"
                  filterKey="leaderboard-avgAlphaClosed"
                  hasActiveFilter={!!leaderboardFilters.avgAlphaClosed.condition}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center px-1 w-12">
                        <SortButton 
                          label="USER" 
                          sortKey="user" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="TRADES (TOTAL)"
                          sortKey="tradesTotal" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="TRADES (CLOSED)"
                          sortKey="tradesClosed" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="SUCCESS RATE (ALL)"
                          sortKey="successRateAll" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="AVG ALPHA (ALL)"
                          sortKey="avgAlphaAll" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="SUCCESS RATE (CLOSED)"
                          sortKey="successRateClosed" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="AVG ALPHA (CLOSED)"
                          sortKey="avgAlphaClosed" 
                          currentSortConfig={leaderboardSortConfig}
                          onSort={handleLeaderboardSort}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLeaderboard.map((trader, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center font-semibold px-1 py-1 text-xs">{trader.user}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trader.tradesTotal}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trader.tradesClosed}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trader.successRateAll.toFixed(1)}%</TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          trader.avgAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trader.avgAlphaAll >= 0 ? '+' : ''}{trader.avgAlphaAll.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trader.successRateClosed.toFixed(1)}%</TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          trader.avgAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trader.avgAlphaClosed >= 0 ? '+' : ''}{trader.avgAlphaClosed.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setLeaderboardPage(Math.max(1, leaderboardPage - 1))}
                      className={leaderboardPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, leaderboardTotalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(leaderboardTotalPages - 4, leaderboardPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setLeaderboardPage(pageNum)}
                          isActive={pageNum === leaderboardPage}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setLeaderboardPage(Math.min(leaderboardTotalPages, leaderboardPage + 1))}
                      className={leaderboardPage === leaderboardTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {activeView === 'portfolios' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search by portfolio or user..."
                  value={portfolioLeaderboardSearch}
                  onChange={(e) => {
                    setPortfolioLeaderboardSearch(e.target.value);
                    setPortfolioLeaderboardPage(1);
                  }}
                  className="pl-10 text-sm"
                />
              </div>
              
              {/* Advanced Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="Trades (Portfolio)"
                  filterKey="portfolioLeaderboard-tradesPortfolio"
                  hasActiveFilter={!!portfolioLeaderboardFilters.tradesPortfolio.condition}
                />
                <FilterButton
                  label="Trades (Closed)"
                  filterKey="portfolioLeaderboard-tradesClosed"
                  hasActiveFilter={!!portfolioLeaderboardFilters.tradesClosed.condition}
                />
                <FilterButton
                  label="Success Rate (All)"
                  filterKey="portfolioLeaderboard-successRateAll"
                  hasActiveFilter={!!portfolioLeaderboardFilters.successRateAll.condition}
                />
                <FilterButton
                  label="Avg Alpha (All)"
                  filterKey="portfolioLeaderboard-avgAlphaAll"
                  hasActiveFilter={!!portfolioLeaderboardFilters.avgAlphaAll.condition}
                />
                <FilterButton
                  label="Success Rate (Closed)"
                  filterKey="portfolioLeaderboard-successRateClosed"
                  hasActiveFilter={!!portfolioLeaderboardFilters.successRateClosed.condition}
                />
                <FilterButton
                  label="Avg Alpha (Closed)"
                  filterKey="portfolioLeaderboard-avgAlphaClosed"
                  hasActiveFilter={!!portfolioLeaderboardFilters.avgAlphaClosed.condition}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center px-1 w-12">
                        <SortButton 
                          label="PORTFOLIO" 
                          sortKey="portfolio" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="USER" 
                          sortKey="user" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="TRADES (PORTFOLIO)"
                          sortKey="tradesPortfolio" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="TRADES (CLOSED)"
                          sortKey="tradesClosed" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="SUCCESS RATE (ALL)"
                          sortKey="successRateAll" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="AVG ALPHA (ALL)"
                          sortKey="avgAlphaAll" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="SUCCESS RATE (CLOSED)"
                          sortKey="successRateClosed" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="AVG ALPHA (CLOSED)"
                          sortKey="avgAlphaClosed" 
                          currentSortConfig={portfolioLeaderboardSortConfig}
                          onSort={handlePortfolioLeaderboardSort}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPortfolioLeaderboard.map((portfolio, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center font-semibold px-1 py-1 text-xs">{portfolio.portfolio}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{portfolio.user}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{portfolio.tradesPortfolio}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{portfolio.tradesClosed}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{portfolio.successRateAll.toFixed(1)}%</TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          portfolio.avgAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {portfolio.avgAlphaAll >= 0 ? '+' : ''}{portfolio.avgAlphaAll.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{portfolio.successRateClosed.toFixed(1)}%</TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          portfolio.avgAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {portfolio.avgAlphaClosed >= 0 ? '+' : ''}{portfolio.avgAlphaClosed.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPortfolioLeaderboardPage(Math.max(1, portfolioLeaderboardPage - 1))}
                      className={portfolioLeaderboardPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, portfolioLeaderboardTotalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(portfolioLeaderboardTotalPages - 4, portfolioLeaderboardPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPortfolioLeaderboardPage(pageNum)}
                          isActive={pageNum === portfolioLeaderboardPage}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPortfolioLeaderboardPage(Math.min(portfolioLeaderboardTotalPages, portfolioLeaderboardPage + 1))}
                      className={portfolioLeaderboardPage === portfolioLeaderboardTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {activeView === 'trades' && (
            <div className="space-y-4">
              <Tabs value={bestTradesTimeframe} onValueChange={setBestTradesTimeframe}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="1M">1M</TabsTrigger>
                  <TabsTrigger value="6M">6M</TabsTrigger>
                  <TabsTrigger value="1Y">1Y</TabsTrigger>
                  <TabsTrigger value="3Y">3Y</TabsTrigger>
                  <TabsTrigger value="5Y">5Y</TabsTrigger>
                  <TabsTrigger value="ALL">ALL</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search by ticker or user..."
                  value={bestTradesSearch}
                  onChange={(e) => {
                    setBestTradesSearch(e.target.value);
                    setBestTradesPage(1);
                  }}
                  className="pl-10 text-sm"
                />
              </div>
              
              {/* Advanced Filter Buttons - Updated order */}
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="Entry Date"
                  filterKey="bestTrades-entryDate"
                  hasActiveFilter={!!bestTradesFilters.entryDate.condition}
                  isDateFilter={true}
                />
                <FilterButton
                  label="Close Date"
                  filterKey="bestTrades-closeDate"
                  hasActiveFilter={!!bestTradesFilters.closeDate.condition}
                  isDateFilter={true}
                />
                <Select value={bestTradesFilters.side} onValueChange={(value) => setBestTradesFilters(prev => ({ ...prev, side: value }))}>
                  <SelectTrigger className="w-20 h-8 text-xs font-medium">
                    <SelectValue placeholder="Side" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 z-50">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    <SelectItem value="LONG" className="text-xs">LONG</SelectItem>
                    <SelectItem value="SHORT" className="text-xs">SHORT</SelectItem>
                  </SelectContent>
                </Select>
                <FilterButton
                  label="Alpha"
                  filterKey="bestTrades-alpha"
                  hasActiveFilter={!!bestTradesFilters.alpha.condition}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="TICKER" 
                          sortKey="ticker" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="ENTRY DATE"
                          sortKey="entryDate"
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="SIDE" 
                          sortKey="side" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="ENTRY PRICE"
                          sortKey="entryPrice" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="CLOSE DATE"
                          sortKey="closeDate" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="EXIT PRICE"
                          sortKey="exitPrice" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="TICKER RETURN"
                          sortKey="tickerReturn" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="S&P500 RETURN"
                          sortKey="sp500Return" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-8">
                        <SortButton 
                          label="ALPHA" 
                          sortKey="alpha" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                      <TableHead className="text-center px-1 w-10">
                        <SortButton 
                          label="USER" 
                          sortKey="user" 
                          currentSortConfig={bestTradesSortConfig}
                          onSort={handleBestTradesSort}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBestTrades.map((trade, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center font-semibold px-1 py-1 text-xs">{trade.ticker}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trade.entryDate}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">
                          <span className={`px-1 py-0.5 rounded text-xs font-semibold ${
                            trade.side === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.side}
                          </span>
                        </TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">${trade.entryPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trade.closeDate}</TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">${trade.exitPrice.toFixed(2)}</TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          trade.tickerReturn >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.tickerReturn >= 0 ? '+' : ''}{trade.tickerReturn.toFixed(2)}%
                        </TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          trade.sp500Return >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.sp500Return >= 0 ? '+' : ''}{trade.sp500Return.toFixed(2)}%
                        </TableCell>
                        <TableCell className={`text-center font-semibold px-1 py-1 text-xs ${
                          trade.alpha >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.alpha >= 0 ? '+' : ''}{trade.alpha.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-center px-1 py-1 text-xs">{trade.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setBestTradesPage(Math.max(1, bestTradesPage - 1))}
                      className={bestTradesPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, bestTradesTotalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(bestTradesTotalPages - 4, bestTradesPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setBestTradesPage(pageNum)}
                          isActive={pageNum === bestTradesPage}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setBestTradesPage(Math.min(bestTradesTotalPages, bestTradesPage + 1))}
                      className={bestTradesPage === bestTradesTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard refresh note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Leaderboard refreshes daily at 00:00 UTC
        </p>
      </div>

      {/* Filter Dialogs */}
      <FilterDialog
        isOpen={activeFilterDialog === 'leaderboard-tradesTotal'}
        onClose={() => setActiveFilterDialog(null)}
        title="TRADES (TOTAL)"
        onApply={(condition, value, value2) => handleLeaderboardFilter('tradesTotal', condition, value, value2)}
        currentCondition={leaderboardFilters.tradesTotal.condition}
        currentValue={leaderboardFilters.tradesTotal.value}
        currentValue2={leaderboardFilters.tradesTotal.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'leaderboard-tradesClosed'}
        onClose={() => setActiveFilterDialog(null)}
        title="TRADES (CLOSED)"
        onApply={(condition, value, value2) => handleLeaderboardFilter('tradesClosed', condition, value, value2)}
        currentCondition={leaderboardFilters.tradesClosed.condition}
        currentValue={leaderboardFilters.tradesClosed.value}
        currentValue2={leaderboardFilters.tradesClosed.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'leaderboard-successRateAll'}
        onClose={() => setActiveFilterDialog(null)}
        title="SUCCESS RATE (ALL)"
        onApply={(condition, value, value2) => handleLeaderboardFilter('successRateAll', condition, value, value2)}
        currentCondition={leaderboardFilters.successRateAll.condition}
        currentValue={leaderboardFilters.successRateAll.value}
        currentValue2={leaderboardFilters.successRateAll.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'leaderboard-avgAlphaAll'}
        onClose={() => setActiveFilterDialog(null)}
        title="AVG ALPHA (ALL)"
        onApply={(condition, value, value2) => handleLeaderboardFilter('avgAlphaAll', condition, value, value2)}
        currentCondition={leaderboardFilters.avgAlphaAll.condition}
        currentValue={leaderboardFilters.avgAlphaAll.value}
        currentValue2={leaderboardFilters.avgAlphaAll.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'leaderboard-successRateClosed'}
        onClose={() => setActiveFilterDialog(null)}
        title="SUCCESS RATE (CLOSED)"
        onApply={(condition, value, value2) => handleLeaderboardFilter('successRateClosed', condition, value, value2)}
        currentCondition={leaderboardFilters.successRateClosed.condition}
        currentValue={leaderboardFilters.successRateClosed.value}
        currentValue2={leaderboardFilters.successRateClosed.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'leaderboard-avgAlphaClosed'}
        onClose={() => setActiveFilterDialog(null)}
        title="AVG ALPHA (CLOSED)"
        onApply={(condition, value, value2) => handleLeaderboardFilter('avgAlphaClosed', condition, value, value2)}
        currentCondition={leaderboardFilters.avgAlphaClosed.condition}
        currentValue={leaderboardFilters.avgAlphaClosed.value}
        currentValue2={leaderboardFilters.avgAlphaClosed.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'portfolioLeaderboard-tradesPortfolio'}
        onClose={() => setActiveFilterDialog(null)}
        title="TRADES (PORTFOLIO)"
        onApply={(condition, value, value2) => handlePortfolioLeaderboardFilter('tradesPortfolio', condition, value, value2)}
        currentCondition={portfolioLeaderboardFilters.tradesPortfolio.condition}
        currentValue={portfolioLeaderboardFilters.tradesPortfolio.value}
        currentValue2={portfolioLeaderboardFilters.tradesPortfolio.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'portfolioLeaderboard-tradesClosed'}
        onClose={() => setActiveFilterDialog(null)}
        title="TRADES (CLOSED)"
        onApply={(condition, value, value2) => handlePortfolioLeaderboardFilter('tradesClosed', condition, value, value2)}
        currentCondition={portfolioLeaderboardFilters.tradesClosed.condition}
        currentValue={portfolioLeaderboardFilters.tradesClosed.value}
        currentValue2={portfolioLeaderboardFilters.tradesClosed.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'portfolioLeaderboard-successRateAll'}
        onClose={() => setActiveFilterDialog(null)}
        title="SUCCESS RATE (ALL)"
        onApply={(condition, value, value2) => handlePortfolioLeaderboardFilter('successRateAll', condition, value, value2)}
        currentCondition={portfolioLeaderboardFilters.successRateAll.condition}
        currentValue={portfolioLeaderboardFilters.successRateAll.value}
        currentValue2={portfolioLeaderboardFilters.successRateAll.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'portfolioLeaderboard-avgAlphaAll'}
        onClose={() => setActiveFilterDialog(null)}
        title="AVG ALPHA (ALL)"
        onApply={(condition, value, value2) => handlePortfolioLeaderboardFilter('avgAlphaAll', condition, value, value2)}
        currentCondition={portfolioLeaderboardFilters.avgAlphaAll.condition}
        currentValue={portfolioLeaderboardFilters.avgAlphaAll.value}
        currentValue2={portfolioLeaderboardFilters.avgAlphaAll.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'portfolioLeaderboard-successRateClosed'}
        onClose={() => setActiveFilterDialog(null)}
        title="SUCCESS RATE (CLOSED)"
        onApply={(condition, value, value2) => handlePortfolioLeaderboardFilter('successRateClosed', condition, value, value2)}
        currentCondition={portfolioLeaderboardFilters.successRateClosed.condition}
        currentValue={portfolioLeaderboardFilters.successRateClosed.value}
        currentValue2={portfolioLeaderboardFilters.successRateClosed.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'portfolioLeaderboard-avgAlphaClosed'}
        onClose={() => setActiveFilterDialog(null)}
        title="AVG ALPHA (CLOSED)"
        onApply={(condition, value, value2) => handlePortfolioLeaderboardFilter('avgAlphaClosed', condition, value, value2)}
        currentCondition={portfolioLeaderboardFilters.avgAlphaClosed.condition}
        currentValue={portfolioLeaderboardFilters.avgAlphaClosed.value}
        currentValue2={portfolioLeaderboardFilters.avgAlphaClosed.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'bestTrades-entryDate'}
        onClose={() => setActiveFilterDialog(null)}
        title="ENTRY DATE"
        onApply={(condition, value, value2) => handleBestTradesFilter('entryDate', condition, value, value2)}
        currentCondition={bestTradesFilters.entryDate.condition}
        currentValue={bestTradesFilters.entryDate.value}
        currentValue2={bestTradesFilters.entryDate.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'bestTrades-closeDate'}
        onClose={() => setActiveFilterDialog(null)}
        title="CLOSE DATE"
        onApply={(condition, value, value2) => handleBestTradesFilter('closeDate', condition, value, value2)}
        currentCondition={bestTradesFilters.closeDate.condition}
        currentValue={bestTradesFilters.closeDate.value}
        currentValue2={bestTradesFilters.closeDate.value2}
      />
      <FilterDialog
        isOpen={activeFilterDialog === 'bestTrades-alpha'}
        onClose={() => setActiveFilterDialog(null)}
        title="ALPHA"
        onApply={(condition, value, value2) => handleBestTradesFilter('alpha', condition, value, value2)}
        currentCondition={bestTradesFilters.alpha.condition}
        currentValue={bestTradesFilters.alpha.value}
        currentValue2={bestTradesFilters.alpha.value2}
      />
    </div>
  );
};

export default Community;
