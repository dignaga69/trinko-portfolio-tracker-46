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
      return { tickerReturn: null, sp500Return: null, alpha: null };
    }
    
    const tickerReturn = trade.side === 'buy' 
      ? ((trade.exitPrice! - trade.entryPrice) / trade.entryPrice) * 100
      : ((trade.entryPrice - trade.exitPrice!) / trade.entryPrice) * 100;
    
    // Mock S&P 500 return calculation
    const sp500Return = Math.random() * 10 - 5; // Random between -5% to 5%
    const alpha = tickerReturn - sp500Return;
    
    return { tickerReturn, sp500Return, alpha };
  };

  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const successfulTrades = closedTrades.filter(trade => {
    const returns = calculateReturns(trade);
    return returns.tickerReturn! > 0;
  });
  
  const allSuccessfulTrades = trades.filter(trade => {
    if (trade.status === 'open') return false; // Consider open trades as not successful for overall rate
    const returns = calculateReturns(trade);
    return returns.tickerReturn! > 0;
  });

  const totalTrades = trades.length;
  const successRateAll = totalTrades > 0 ? (allSuccessfulTrades.length / totalTrades) * 100 : 0;
  const successRateClosed = closedTrades.length > 0 ? (successfulTrades.length / closedTrades.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalTrades}</div>
              <div className="text-sm text-gray-600">Number of Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{successRateAll.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Success Rate (All)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{successRateClosed.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Success Rate (Closed Only)</div>
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
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          {trade.ticker}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
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
                        <td className="py-3 px-2 text-sm text-gray-600">
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
                          {returns.tickerReturn !== null ? (
                            <span className={returns.tickerReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {returns.tickerReturn.toFixed(2)}%
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-mono">
                          {returns.sp500Return !== null ? (
                            <span className={returns.sp500Return >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {returns.sp500Return.toFixed(2)}%
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-mono font-semibold">
                          {returns.alpha !== null ? (
                            <span className={returns.alpha >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {returns.alpha.toFixed(2)}%
                            </span>
                          ) : 'N/A'}
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
