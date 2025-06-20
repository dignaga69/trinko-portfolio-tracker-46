
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Trade {
  id: string;
  ticker: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  entryDate: Date;
  reasoning: string;
  status: 'open' | 'closed';
  exitPrice?: number;
  exitDate?: Date;
  closeReasoning?: string;
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

  return (
    <div className="space-y-6">
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
                          {trade.entryDate.toLocaleDateString()}
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
                          {trade.exitDate ? trade.exitDate.toLocaleDateString() : 'N/A'}
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
