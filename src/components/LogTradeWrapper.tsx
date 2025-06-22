
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        <div>
          <className="text-sm italic text-gray-600 mt-2">
            Sign in to log your trades.
          </p>
        </div>
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

  return <LogTrade trades={trades} onAddTrade={onAddTrade} onCloseTrade={onCloseTrade} />;
};

export default LogTradeWrapper;
