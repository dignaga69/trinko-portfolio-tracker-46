import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Trade {
  id: string;
  ticker: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  entryDate: Date;
  reason: string;
  status: 'open' | 'closed';
  portfolioId: string;
}

interface Portfolio {
  id: string;
  name: string;
  createdAt: Date;
}

interface LogTradeProps {
  trades: Trade[];
  portfolios: Portfolio[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onCloseTrade: (tradeId: string, reason: string) => void;
}

const LogTrade = ({ trades, portfolios, onAddTrade, onCloseTrade }: LogTradeProps) => {
  const [tradeType, setTradeType] = useState<'open' | 'close'>('open');
  const [ticker, setTicker] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [reason, setReason] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openTrades = trades.filter(trade => trade.status === 'open');

  const fetchPrice = async (symbol: string) => {
    setIsLoading(true);
    // Simulate API call - in real implementation, you'd connect to a financial data API
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockPrice = Math.random() * 200 + 50; // Random price between 50-250
    setCurrentPrice(mockPrice);
    setIsLoading(false);
  };

  const handleTickerChange = (value: string) => {
    setTicker(value);
    if (value.length > 0) {
      fetchPrice(value);
    } else {
      setCurrentPrice(null);
    }
  };

  const handleOpenTrade = () => {
    if (!ticker || !reason.trim() || !currentPrice || !selectedPortfolioId) return;
    
    onAddTrade({
      ticker: ticker.toUpperCase(),
      side,
      entryPrice: currentPrice,
      entryDate: new Date(),
      reason: reason.trim(),
      status: 'open',
      portfolioId: selectedPortfolioId
    });

    // Reset form
    setTicker('');
    setReason('');
    setCurrentPrice(null);
  };

  const handleCloseTrade = () => {
    if (!selectedTradeId || !reason.trim()) return;
    
    onCloseTrade(selectedTradeId, reason.trim());
    
    // Reset form
    setSelectedTradeId('');
    setReason('');
  };

  return (
    <div className="space-y-8">
      {portfolios.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <p className="text-yellow-800 text-sm">
              You need to create at least one portfolio before logging trades. 
              Go to the Portfolio tab to create your first portfolio.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-1 bg-gray-50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTradeType('open')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tradeType === 'open' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Open Trade
        </button>
        <button
          onClick={() => setTradeType('close')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tradeType === 'close' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Close Trade
        </button>
      </div>

      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {tradeType === 'open' ? 'Open New Position' : 'Close Existing Position'}
          </CardTitle>
          <p className="text-sm italic text-gray-600 mt-2">
            {tradeType === 'open' ? (
              <>
                Log a new position. <span className="text-red-600">This action is permanent, and cannot be undone or deleted.</span>
              </>
            ) : (
              <>
                Close a position. <span className="text-red-600">This action is permanent, and cannot be undone or deleted.</span>
              </>
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Portfolio Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Portfolio
            </Label>
            <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select a portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tradeType === 'open' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker" className="text-sm font-medium text-gray-700">
                    Ticker
                  </Label>
                  <Input
                    id="ticker"
                    placeholder="AAPL"
                    value={ticker}
                    onChange={(e) => handleTickerChange(e.target.value)}
                    className="text-sm"
                  />
                  {isLoading && (
                    <p className="text-xs text-gray-500">Fetching price...</p>
                  )}
                  {currentPrice && (
                    <p className="text-xs text-green-600 font-medium">
                      Current Price: ${currentPrice.toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Position
                  </Label>
                  <Select value={side} onValueChange={(value: 'buy' | 'sell') => setSide(value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy (Long)</SelectItem>
                      <SelectItem value="sell">Sell (Short)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Select Position to Close
              </Label>
              <Select value={selectedTradeId} onValueChange={setSelectedTradeId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select an open position" />
                </SelectTrigger>
                <SelectContent>
                  {openTrades.map((trade) => {
                    const portfolio = portfolios.find(p => p.id === trade.portfolioId);
                    return (
                      <SelectItem key={trade.id} value={trade.id}>
                        {trade.ticker} - {trade.side.toUpperCase()} @ ${trade.entryPrice.toFixed(2)} ({portfolio?.name})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain your rationale for this trade..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              className="text-sm resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              {reason.length}/300 characters
            </p>
          </div>
          
          <Button 
            onClick={tradeType === 'open' ? handleOpenTrade : handleCloseTrade}
            disabled={
              portfolios.length === 0 || 
              (tradeType === 'open' 
                ? !ticker || !reason.trim() || !currentPrice || !selectedPortfolioId
                : !selectedTradeId || !reason.trim())
            }
            className="w-full text-sm"
          >
            {tradeType === 'open' ? 'Log Trade' : 'Close Position'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogTrade;
