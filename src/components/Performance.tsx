import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2, Twitter, Linkedin } from 'lucide-react';

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
}

interface PerformanceProps {
  trades: Trade[];
}

const Performance = ({ trades }: PerformanceProps) => {
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

  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const openTrades = trades.filter(trade => trade.status === 'open');
  const successfulTrades = closedTrades.filter(trade => {
    const returns = calculateReturns(trade);
    return returns.tickerReturn! > 0;
  });
  
  const allSuccessfulTrades = trades.filter(trade => {
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

  const totalTrades = trades.length;
  const successRateAll = totalTrades > 0 ? (allSuccessfulTrades.length / totalTrades) * 100 : 0;
  const successRateClosed = closedTrades.length > 0 ? (successfulTrades.length / closedTrades.length) * 100 : 0;

  const openTradeReturns = trades.filter(trade => trade.status === 'open').map(trade => {
    const returns = calculateReturns(trade);
    return {
      id: trade.id,
      ticker: trade.ticker,
      side: trade.side,
      return: returns.tickerReturn!
    };
  });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Performance Dashboard</h1>
          <p className="text-gray-300">Track your investment performance and analyze your trading patterns</p>
        </div>

        {/* User Profile Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">TG</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">TradeGuru</h2>
              <p className="text-gray-300">Active Trader • Member since 2024</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Number of Trades */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Number of Trades</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalTrades}</p>
                <p className="text-sm text-gray-300">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{openTrades}</p>
                <p className="text-sm text-gray-300">Open</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{closedTrades}</p>
                <p className="text-sm text-gray-300">Closed</p>
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Success Rate</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400 mb-2">{successRate}%</p>
              <p className="text-sm text-gray-300">Winning trades</p>
            </div>
          </div>

          {/* Average Alpha */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Average Alpha</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400 mb-2">{averageAlpha}%</p>
              <p className="text-sm text-gray-300">Per trade</p>
            </div>
          </div>
        </div>

        {/* Running Returns for Open Trades */}
        {openTradeReturns.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Open Positions</h3>
            <div className="space-y-3">
              {openTradeReturns.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center py-2 border-b border-white/10">
                  <div>
                    <span className="text-white font-medium">{trade.ticker}</span>
                    <span className="text-gray-300 ml-2">{trade.side.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${trade.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.return >= 0 ? '+' : ''}{trade.return.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart visualization coming soon...
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
          {trades.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No trades logged yet</p>
          ) : (
            <div className="space-y-3">
              {trades.slice(-5).reverse().map((trade) => (
                <div key={trade.id} className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
                  <div>
                    <span className="text-white font-medium">{trade.ticker}</span>
                    <span className="text-gray-300 ml-2">{trade.side.toUpperCase()}</span>
                    <span className="text-gray-400 ml-2 text-sm">${trade.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      trade.status === 'open' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {trade.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
