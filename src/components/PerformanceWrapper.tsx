
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Performance from './Performance';

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
}

interface Portfolio {
  id: string;
  name: string;
  createdAt: Date;
}

interface PerformanceWrapperProps {
  trades: Trade[];
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onPortfolioChange: (portfolioId: string) => void;
}

const PerformanceWrapper = ({ trades, portfolios, selectedPortfolioId, onPortfolioChange }: PerformanceWrapperProps) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm italic text-gray-600 mt-2">
            Sign in to view your performance.
          </p>
        </div>
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Please sign in to view your trading performance</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Performance 
      trades={trades} 
      portfolios={portfolios}
      selectedPortfolioId={selectedPortfolioId}
      onPortfolioChange={onPortfolioChange}
    />
  );
};

export default PerformanceWrapper;
