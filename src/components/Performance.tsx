import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2, Twitter, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { usePrivacy } from '@/contexts/PrivacyContext';
import PrivacyToggle from './PrivacyToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Trade {
  id: string;
  ticker: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  entryDate: Date;
  reason: string;
  status: 'open' | 'closed';
  exitPrice?: number;
  exitDate?: Date;
  closeReason?: string;
  portfolioId: string;
  isShared?: boolean;
  userId?: string;
  userName?: string;
}

interface Portfolio {
  id: string;
  name: string;
  createdAt: Date;
  type?: 'personal' | 'shared';
  isShared?: boolean;
}

interface PerformanceProps {
  trades: Trade[];
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onPortfolioChange: (portfolioId: string) => void;
}

const Performance = ({ trades, portfolios, selectedPortfolioId, onPortfolioChange }: PerformanceProps) => {
  const { isPrivate, setIsPrivate } = usePrivacy();
  const [portfolioType, setPortfolioType] = useState<'individual' | 'shared'>('individual');

  // Filter portfolios by type
  const filteredPortfolios = portfolios.filter(portfolio => {
    if (portfolioType === 'individual') {
      return !portfolio.isShared && portfolio.type !== 'shared';
    } else {
      return portfolio.isShared || portfolio.type === 'shared';
    }
  });

  // Filter trades by selected portfolio
  const filteredTrades = selectedPortfolioId && selectedPortfolioId !== 'all'
    ? trades.filter(trade => trade.portfolioId === selectedPortfolioId)
    : trades.filter(trade => {
        const portfolio = portfolios.find(p => p.id === trade.portfolioId);
        if (portfolioType === 'individual') {
          return !portfolio?.isShared && portfolio?.type !== 'shared';
        } else {
          return portfolio?.isShared || portfolio?.type === 'shared';
        }
      });

  const calculateReturns = (trade: Trade) => {
    if (trade.status === 'open') {
      // For open trades, calculate returns based on current mock price
      const currentPrice = Math.random() * 200 + 50; // Mock current price
      const tickerReturn = trade.side === 'buy' 
        ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100
        : ((trade.entryPrice - currentPrice) / trade.entryPrice) * 100;
      
      const sp500Return = Math.random() * 10 - 5; // Mock S&P 500 return
      const alpha = tickerReturn - sp500Return;
      
      return { tickerReturn, sp500Return, alpha };
    }
    
    const tickerReturn = trade.side === 'buy' 
      ? ((trade.exitPrice! - trade.entryPrice) / trade.entryPrice) * 100
      : ((trade.entryPrice - trade.exitPrice!) / trade.entryPrice) * 100;
    
    const sp500Return = Math.random() * 10 - 5; // Mock S&P 500 return
    const alpha = tickerReturn - sp500Return;
    
    return { tickerReturn, sp500Return, alpha };
  };

  // Filter closed trades by success
  const closedTrades = filteredTrades.filter(trade => trade.status === 'closed');
  const openTrades = filteredTrades.filter(trade => trade.status === 'open');
  const successfulTrades = closedTrades.filter(trade => {
    const returns = calculateReturns(trade);
    return returns.tickerReturn! > 0;
  });
  
  const allSuccessfulTrades = filteredTrades.filter(trade => {
    if (trade.status === 'open') return false;
    const returns = calculateReturns(trade);
    return returns.tickerReturn! > 0;
  });

  // Calculate average alpha for all trades (only closed trades have alpha values)
  const allAlphaValues = closedTrades.map(trade => {
    const returns = calculateReturns(trade);
    return returns.alpha!;
  });
  const averageAlphaAll = allAlphaValues.length > 0 ? allAlphaValues.reduce((sum, alpha) => sum + alpha, 0) / allAlphaValues.length : 0;
  const averageAlphaClosed = averageAlphaAll;

  const totalTrades = filteredTrades.length;
  const successRateAll = totalTrades > 0 ? (allSuccessfulTrades.length / totalTrades) * 100 : 0;
  const successRateClosed = closedTrades.length > 0 ? (successfulTrades.length / closedTrades.length) * 100 : 0;

  const selectedPortfolio = filteredPortfolios.find(p => p.id === selectedPortfolioId);
  const isSharedPortfolioSelected = selectedPortfolio?.isShared || selectedPortfolio?.type === 'shared';

  // Mock user data for shared portfolio trades
  const getUserName = (trade: Trade) => {
    if (trade.userName) return trade.userName;
    // Mock user names for demonstration
    const mockUsers = ['John D.', 'Sarah M.', 'Mike R.', 'Lisa K.', 'Tom B.'];
    return mockUsers[Math.floor(Math.random() * mockUsers.length)];
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-semibold">TG</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-900">TradeGuru</h2>
                <p className="text-sm text-gray-600">Member since January 2023</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Bio</h4>
              <p className="text-sm text-gray-600">
                Passionate trader focused on value investing and long-term growth strategies. 5+ years of market experience.
              </p>
            </div>
            
            <div>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Toggle */}
      <PrivacyToggle isPrivate={isPrivate} onToggle={setIsPrivate} />

      {/* Portfolio Type Toggle */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => {
                  setPortfolioType('individual');
                  onPortfolioChange('all');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  portfolioType === 'individual' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Individual Portfolio
              </button>
              <button
                onClick={() => {
                  setPortfolioType('shared');
                  onPortfolioChange('all');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  portfolioType === 'shared' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shared Portfolio
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Select Portfolio
              </Label>
              <Select value={selectedPortfolioId || 'all'} onValueChange={onPortfolioChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Portfolios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {portfolioType} Portfolios</SelectItem>
                  {filteredPortfolios.map((portfolio) => (
                    <SelectItem key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Section */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
          <p className="text-sm italic text-gray-600 mt-2">
            Your basic stats at a glance{selectedPortfolio ? ` for ${selectedPortfolio.name}` : ''}.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 text-center border-b border-gray-200 pb-2">Number of Trades</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{filteredTrades.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{openTrades.length}</div>
                  <div className="text-xs text-gray-600">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{closedTrades.length}</div>
                  <div className="text-xs text-gray-600">Closed</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 text-center border-b border-gray-200 pb-2">All Trades</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{successRateAll.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {closedTrades.length > 0 ? (
                      <span className={averageAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {averageAlphaAll >= 0 ? '+' : ''}{averageAlphaAll.toFixed(2)}%
                      </span>
                    ) : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">Average Alpha</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 text-center border-b border-gray-200 pb-2">Closed Only</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{successRateClosed.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {closedTrades.length > 0 ? (
                      <span className={averageAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {averageAlphaClosed >= 0 ? '+' : ''}{averageAlphaClosed.toFixed(2)}%
                      </span>
                    ) : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">Average Alpha</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade History Section */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTrades.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {selectedPortfolio 
                ? `No trades found for ${selectedPortfolio.name}.`
                : `No ${portfolioType} trades logged yet. Start by logging your first trade.`
              }
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Portfolio
                    </th>
                    {(isSharedPortfolioSelected || portfolioType === 'shared') && (
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        User
                      </th>
                    )}
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Ticker
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Entry Date
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Long/Short
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Entry Price
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Close Date
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Exit Price
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Ticker Return
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      S&P500 Return
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Alpha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => {
                    const returns = calculateReturns(trade);
                    const portfolio = portfolios.find(p => p.id === trade.portfolioId);
                    const showUserColumn = (portfolio?.isShared || portfolio?.type === 'shared') && portfolioType === 'shared';
                    
                    return (
                      <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-25">
                        <td className="py-3 px-2 text-sm text-gray-600 font-mono">
                          {portfolio?.name || 'Unknown'}
                        </td>
                        {(isSharedPortfolioSelected || portfolioType === 'shared') && (
                          <td className="py-3 px-2 text-sm text-gray-600 font-mono">
                            {showUserColumn ? getUserName(trade) : 'You'}
                          </td>
                        )}
                        <td className="py-3 px-2 text-sm font-medium text-gray-900 font-mono">
                          {trade.ticker}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 font-mono">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="hover:text-blue-600 hover:underline text-left">
                                {trade.entryDate.toLocaleDateString()}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 max-h-40 overflow-y-auto">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Entry Reason</h4>
                                <p className="text-xs text-gray-600 whitespace-pre-wrap">
                                  {trade.reason}
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                        <td className="py-3 px-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.side === 'buy' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.side === 'buy' ? 'Long' : 'Short'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right font-mono">
                          ${trade.entryPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 font-mono">
                          {trade.exitDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="hover:text-blue-600 hover:underline text-left">
                                  {trade.exitDate.toLocaleDateString()}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 max-h-40 overflow-y-auto">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Close Reason</h4>
                                  <p className="text-xs text-gray-600 whitespace-pre-wrap">
                                    {trade.closeReason || 'No reason provided'}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : 'N/A'}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right font-mono">
                          {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-mono">
                          <span className={returns.tickerReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {returns.tickerReturn.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-mono">
                          <span className={returns.sp500Return >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {returns.sp500Return.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-mono font-semibold">
                          <span className={returns.alpha >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {returns.alpha.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
