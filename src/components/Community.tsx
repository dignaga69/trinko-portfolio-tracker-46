
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronUp, ChevronDown, EyeOff } from 'lucide-react';

interface CommunityProps {
  isUserPrivate?: boolean;
}

const Community = ({ isUserPrivate = false }: CommunityProps) => {
  const [bestTradesTimeframe, setBestTradesTimeframe] = useState('ALL');
  const [bestTradesSortConfig, setBestTradesSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'alpha', direction: 'desc' });
  
  const [leaderboardSortConfig, setLeaderboardSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'avgAlphaAll', direction: 'desc' });

  // Mock data for Best Trades
  const mockBestTrades = [
    {
      ticker: 'AAPL',
      entryDate: '2024-01-15',
      side: 'LONG',
      entryPrice: 185.64,
      closeDate: '2024-02-20',
      exitPrice: 195.12,
      tickerReturn: 5.11,
      sp500Return: 2.34,
      alpha: 2.77,
      user: 'TradeGuru'
    },
    {
      ticker: 'TSLA',
      entryDate: '2024-03-10',
      side: 'SHORT',
      entryPrice: 201.29,
      closeDate: '2024-04-15',
      exitPrice: 180.45,
      tickerReturn: -10.35,
      sp500Return: 1.85,
      alpha: -12.20,
      user: 'StockMaster'
    },
    {
      ticker: 'NVDA',
      entryDate: '2024-05-01',
      side: 'LONG',
      entryPrice: 875.28,
      closeDate: '2024-06-10',
      exitPrice: 920.15,
      tickerReturn: 5.13,
      sp500Return: 0.95,
      alpha: 4.18,
      user: 'InvestPro'
    }
  ];

  // Mock data for Leaderboard
  const mockLeaderboard = [
    {
      user: 'TradeGuru',
      trades: 42,
      successRateAll: 78.5,
      avgAlphaAll: 12.3,
      successRateClosed: 82.1,
      avgAlphaClosed: 15.7,
    },
    {
      user: 'StockMaster',
      trades: 38,
      successRateAll: 72.3,
      avgAlphaAll: 9.8,
      successRateClosed: 75.6,
      avgAlphaClosed: 11.2,
    },
    {
      user: 'InvestPro',
      trades: 55,
      successRateAll: 68.9,
      avgAlphaAll: 8.5,
      successRateClosed: 71.4,
      avgAlphaClosed: 10.1,
    },
  ];

  const handleBestTradesSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (bestTradesSortConfig.key === key && bestTradesSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setBestTradesSortConfig({ key, direction });
  };

  const handleLeaderboardSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (leaderboardSortConfig.key === key && leaderboardSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setLeaderboardSortConfig({ key, direction });
  };

  const sortedBestTrades = [...mockBestTrades].sort((a, b) => {
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

  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
    const { key, direction } = leaderboardSortConfig;
    let aValue, bValue;
    
    switch (key) {
      case 'user':
        aValue = a.user;
        bValue = b.user;
        break;
      case 'trades':
        aValue = a.trades;
        bValue = b.trades;
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

  const SortButton = ({ 
    label, 
    sortKey, 
    currentSortConfig, 
    onSort 
  }: { 
    label: string; 
    sortKey: string; 
    currentSortConfig: { key: string; direction: 'asc' | 'desc' };
    onSort: (key: string) => void;
  }) => (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 hover:text-gray-900 font-medium"
    >
      {label}
      {currentSortConfig.key === sortKey && (
        currentSortConfig.direction === 'desc' ? 
          <ChevronDown size={14} /> : 
          <ChevronUp size={14} />
      )}
    </button>
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

  return (
    <div className="space-y-6">
      {/* Leaderboard Section - Now comes first */}
      <Card className="border-0 shadow-none bg-gray-50 relative">
        {isUserPrivate && <PrivacyOverlay />}
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
          <p className="text-sm italic text-gray-600 mt-2">
            The best shot-callers.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    <SortButton 
                      label="USER" 
                      sortKey="user" 
                      currentSortConfig={leaderboardSortConfig}
                      onSort={handleLeaderboardSort}
                    />
                  </TableHead>
                  <TableHead className="text-center">
                    <SortButton 
                      label="NUMBER OF TRADES" 
                      sortKey="trades" 
                      currentSortConfig={leaderboardSortConfig}
                      onSort={handleLeaderboardSort}
                    />
                  </TableHead>
                  <TableHead className="text-center">
                    <SortButton 
                      label="SUCCESS RATE (ALL)" 
                      sortKey="successRateAll" 
                      currentSortConfig={leaderboardSortConfig}
                      onSort={handleLeaderboardSort}
                    />
                  </TableHead>
                  <TableHead className="text-center">
                    <SortButton 
                      label="AVERAGE ALPHA (ALL)" 
                      sortKey="avgAlphaAll" 
                      currentSortConfig={leaderboardSortConfig}
                      onSort={handleLeaderboardSort}
                    />
                  </TableHead>
                  <TableHead className="text-center">
                    <SortButton 
                      label="SUCCESS RATE (CLOSED)" 
                      sortKey="successRateClosed" 
                      currentSortConfig={leaderboardSortConfig}
                      onSort={handleLeaderboardSort}
                    />
                  </TableHead>
                  <TableHead className="text-center">
                    <SortButton 
                      label="AVERAGE ALPHA (CLOSED)" 
                      sortKey="avgAlphaClosed" 
                      currentSortConfig={leaderboardSortConfig}
                      onSort={handleLeaderboardSort}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeaderboard.map((trader, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center font-semibold">{trader.user}</TableCell>
                    <TableCell className="text-center">{trader.trades}</TableCell>
                    <TableCell className="text-center">{trader.successRateAll.toFixed(1)}%</TableCell>
                    <TableCell className={`text-center font-semibold ${
                      trader.avgAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trader.avgAlphaAll >= 0 ? '+' : ''}{trader.avgAlphaAll.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">{trader.successRateClosed.toFixed(1)}%</TableCell>
                    <TableCell className={`text-center font-semibold ${
                      trader.avgAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trader.avgAlphaClosed >= 0 ? '+' : ''}{trader.avgAlphaClosed.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Best Trades Section - Now comes second */}
      <Card className="border-0 shadow-none bg-gray-50 relative">
        {isUserPrivate && <PrivacyOverlay />}
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Best Trades</CardTitle>
          <p className="text-sm italic text-gray-600 mt-2">
            The best calls for each timeframe.
          </p>
        </CardHeader>
        <CardContent>
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      <SortButton 
                        label="TICKER" 
                        sortKey="ticker" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="ENTRY DATE" 
                        sortKey="entryDate" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="LONG/SHORT" 
                        sortKey="side" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="ENTRY PRICE" 
                        sortKey="entryPrice" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="CLOSE DATE" 
                        sortKey="closeDate" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="EXIT PRICE" 
                        sortKey="exitPrice" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="TICKER RETURN" 
                        sortKey="tickerReturn" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="S&P500 RETURN" 
                        sortKey="sp500Return" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
                      <SortButton 
                        label="ALPHA" 
                        sortKey="alpha" 
                        currentSortConfig={bestTradesSortConfig}
                        onSort={handleBestTradesSort}
                      />
                    </TableHead>
                    <TableHead className="text-center">
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
                  {sortedBestTrades.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center font-semibold">{trade.ticker}</TableCell>
                      <TableCell className="text-center">{trade.entryDate}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.side === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.side}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{trade.closeDate}</TableCell>
                      <TableCell className="text-center">${trade.exitPrice.toFixed(2)}</TableCell>
                      <TableCell className={`text-center font-semibold ${
                        trade.tickerReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.tickerReturn >= 0 ? '+' : ''}{trade.tickerReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`text-center font-semibold ${
                        trade.sp500Return >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.sp500Return >= 0 ? '+' : ''}{trade.sp500Return.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`text-center font-semibold ${
                        trade.alpha >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.alpha >= 0 ? '+' : ''}{trade.alpha.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-center">{trade.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
