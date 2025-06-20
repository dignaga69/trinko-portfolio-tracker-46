
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
  reasoning: string;
  status: 'open' | 'closed';
}

interface LogTradeProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onCloseTrade: (tradeId: string, reasoning: string) => void;
}

const LogTrade = ({ trades, onAddTrade, onCloseTrade }: LogTradeProps) => {
  const [tradeType, setTradeType] = useState<'open' | 'close'>('open');
  const [ticker, setTicker] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [reasoning, setReasoning] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState('');
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
    if (!ticker || !reasoning.trim() || !currentPrice) return;
    
    onAddTrade({
      ticker: ticker.toUpperCase(),
      side,
      entryPrice: currentPrice,
      entryDate: new Date(),
      reasoning: reasoning.trim(),
      status: 'open'
    });

    // Reset form
    setTicker('');
    setReasoning('');
    setCurrentPrice(null);
  };

  const handleCloseTrade = () => {
    if (!selectedTradeId || !reasoning.trim()) return;
    
    onCloseTrade(selectedTradeId, reasoning.trim());
    
    // Reset form
    setSelectedTradeId('');
    setReasoning('');
  };

  return (
    <div className="space-y-8">
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
        </CardHeader>
        <CardContent className="space-y-6">
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
                  {openTrades.map((trade) => (
                    <SelectItem key={trade.id} value={trade.id}>
                      {trade.ticker} - {trade.side.toUpperCase()} @ ${trade.entryPrice.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reasoning" className="text-sm font-medium text-gray-700">
              Reasoning
            </Label>
            <Textarea
              id="reasoning"
              placeholder="Explain your rationale for this trade..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              maxLength={100}
              className="text-sm resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500">
              {reasoning.length}/100 characters
            </p>
          </div>
          
          <Button 
            onClick={tradeType === 'open' ? handleOpenTrade : handleCloseTrade}
            disabled={
              tradeType === 'open' 
                ? !ticker || !reasoning.trim() || !currentPrice 
                : !selectedTradeId || !reasoning.trim()
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
