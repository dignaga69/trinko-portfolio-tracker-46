
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalTrades}</div>
              <div className="text-sm text-gray-600 mb-3">Number of Trades</div>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{totalTrades}</span>
                  <span className="text-gray-500 ml-1">Total</span>
                </div>
                <div>
                  <span className="font-medium text-green-600">{openTrades.length}</span>
                  <span className="text-gray-500 ml-1">Open</span>
                </div>
                <div>
                  <span className="font-medium text-blue-600">{closedTrades.length}</span>
                  <span className="text-gray-500 ml-1">Closed</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
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

      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No trades logged yet. Start by logging your first trade.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
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
                  {trades.map((trade) => {
                    const returns = calculateReturns(trade);
                    return (
                      <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-25">
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
