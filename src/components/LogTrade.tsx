
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
}

interface LogTradeProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onCloseTrade: (tradeId: string, reason: string) => void;
  isFirstTrade?: boolean;
}

const LogTrade = ({ trades, onAddTrade, onCloseTrade, isFirstTrade = false }: LogTradeProps) => {
  const [tradeType, setTradeType] = useState<'open' | 'close'>('open');
  const [ticker, setTicker] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [reason, setReason] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openTrades = trades.filter(trade => trade.status === 'open');

  const fetchPrice = async (symbol: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockPrice = Math.random() * 200 + 50;
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
    if (!ticker || !reason.trim() || !currentPrice) return;
    
    onAddTrade({
      ticker: ticker.toUpperCase(),
      side,
      entryPrice: currentPrice,
      entryDate: new Date(),
      reason: reason.trim(),
      status: 'open'
    });

    setTicker('');
    setReason('');
    setCurrentPrice(null);
  };

  const handleCloseTrade = () => {
    if (!selectedTradeId || !reason.trim()) return;
    
    onCloseTrade(selectedTradeId, reason.trim());
    
    setSelectedTradeId('');
    setReason('');
  };

  if (isFirstTrade) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Log Your First Trade</h3>
          <p className="text-gray-300">Start your investment tracking journey</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ticker" className="text-white font-medium">
              Stock Ticker
            </Label>
            <Input
              id="ticker"
              placeholder="e.g., AAPL"
              value={ticker}
              onChange={(e) => handleTickerChange(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm"
            />
            {isLoading && (
              <p className="text-xs text-gray-400">Fetching price...</p>
            )}
            {currentPrice && (
              <p className="text-xs text-green-400 font-medium">
                Current Price: ${currentPrice.toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-white font-medium">
              Position Type
            </Label>
            <Select value={side} onValueChange={(value: 'buy' | 'sell') => setSide(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="buy" className="text-white">Buy (Long)</SelectItem>
                <SelectItem value="sell" className="text-white">Sell (Short)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-white font-medium">
            Investment Rationale
          </Label>
          <Textarea
            id="reason"
            placeholder="Why are you making this trade? What's your thesis?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={300}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-400">
            {reason.length}/300 characters
          </p>
        </div>
        
        <Button 
          onClick={handleOpenTrade}
          disabled={!ticker || !reason.trim() || !currentPrice}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
        >
          Log My First Trade
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit backdrop-blur-sm">
        <button
          onClick={() => setTradeType('open')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tradeType === 'open' 
              ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          Open Trade
        </button>
        <button
          onClick={() => setTradeType('close')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tradeType === 'close' 
              ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          Close Trade
        </button>
      </div>

      <Card className="border-0 shadow-none bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-white">
            {tradeType === 'open' ? 'Open New Position' : 'Close Existing Position'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tradeType === 'open' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker" className="text-sm font-medium text-gray-200">
                    Ticker
                  </Label>
                  <Input
                    id="ticker"
                    placeholder="AAPL"
                    value={ticker}
                    onChange={(e) => handleTickerChange(e.target.value)}
                    className="text-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  {isLoading && (
                    <p className="text-xs text-gray-400">Fetching price...</p>
                  )}
                  {currentPrice && (
                    <p className="text-xs text-green-400 font-medium">
                      Current Price: ${currentPrice.toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-200">
                    Position
                  </Label>
                  <Select value={side} onValueChange={(value: 'buy' | 'sell') => setSide(value)}>
                    <SelectTrigger className="text-sm bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="buy" className="text-white">Buy (Long)</SelectItem>
                      <SelectItem value="sell" className="text-white">Sell (Short)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-200">
                Select Position to Close
              </Label>
              <Select value={selectedTradeId} onValueChange={setSelectedTradeId}>
                <SelectTrigger className="text-sm bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select an open position" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {openTrades.map((trade) => (
                    <SelectItem key={trade.id} value={trade.id} className="text-white">
                      {trade.ticker} - {trade.side.toUpperCase()} @ ${trade.entryPrice.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-gray-200">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain your rationale for this trade..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              className="text-sm resize-none bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={4}
            />
            <p className="text-xs text-gray-400">
              {reason.length}/300 characters
            </p>
          </div>
          
          <Button 
            onClick={tradeType === 'open' ? handleOpenTrade : handleCloseTrade}
            disabled={
              tradeType === 'open' 
                ? !ticker || !reason.trim() || !currentPrice 
                : !selectedTradeId || !reason.trim()
            }
            className="w-full text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {tradeType === 'open' ? 'Log Trade' : 'Close Position'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogTrade;
