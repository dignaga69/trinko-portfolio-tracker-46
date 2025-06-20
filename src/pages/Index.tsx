
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LogTrade from '@/components/LogTrade';
import Performance from '@/components/Performance';
import Community from '@/components/Community';
import Profile from '@/components/Profile';

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

const Index = () => {
  const [activeSection, setActiveSection] = useState('log-trade');
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    const trade: Trade = {
      ...newTrade,
      id: Date.now().toString(),
    };
    setTrades(prev => [...prev, trade]);
  };

  const handleCloseTrade = (tradeId: string, closeReason: string) => {
    setTrades(prev => prev.map(trade => {
      if (trade.id === tradeId) {
        // Simulate fetching current price for exit
        const exitPrice = Math.random() * 200 + 50;
        return {
          ...trade,
          status: 'closed' as const,
          exitPrice,
          exitDate: new Date(),
          closeReason
        };
      }
      return trade;
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'log-trade':
        return (
          <LogTrade 
            trades={trades}
            onAddTrade={handleAddTrade}
            onCloseTrade={handleCloseTrade}
          />
        );
      case 'performance':
        return <Performance trades={trades} />;
      case 'community':
        return <Community />;
      case 'profile':
        return <Profile isOwnProfile={true} />;
      default:
        return <LogTrade trades={trades} onAddTrade={handleAddTrade} onCloseTrade={handleCloseTrade} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
