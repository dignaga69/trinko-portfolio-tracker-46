
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import LogTrade from './LogTrade';

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

interface LogTradeWrapperProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onCloseTrade: (tradeId: string, reason: string) => void;
}

const LogTradeWrapper = ({ trades, onAddTrade, onCloseTrade }: LogTradeWrapperProps) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Log Trade</h1>
        </div>
        <p className="text-sm italic text-gray-600">
          Sign in to log your trades.
        </p>
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Please sign in to start logging your trades</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText size={24} />
        <h1 className="text-2xl font-bold">Log Trade</h1>
      </div>
      <LogTrade trades={trades} onAddTrade={onAddTrade} onCloseTrade={onCloseTrade} />
    </div>
  );
};

export default LogTradeWrapper;
