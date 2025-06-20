
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LogTrade from '@/components/LogTrade';
import Performance from '@/components/Performance';
import Community from '@/components/Community';

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
  const [activeSection, setActiveSection] = useState('home');
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    const trade: Trade = {
      ...newTrade,
      id: Date.now().toString(),
    };
    setTrades(prev => [...prev, trade]);
    // After first trade, redirect to performance
    if (trades.length === 0) {
      setActiveSection('performance');
    }
  };

  const handleCloseTrade = (tradeId: string, closeReason: string) => {
    setTrades(prev => prev.map(trade => {
      if (trade.id === tradeId) {
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
      case 'home':
        return (
          <div className="min-h-screen flex items-center justify-center px-8">
            <div className="max-w-4xl w-full text-center">
              <div className="mb-12">
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  How skilled are you at{' '}
                  <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    investing?
                  </span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Log your first trade to find out and start tracking your investment performance
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <LogTrade 
                  trades={trades}
                  onAddTrade={handleAddTrade}
                  onCloseTrade={handleCloseTrade}
                  isFirstTrade={trades.length === 0}
                />
              </div>
            </div>
          </div>
        );
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
      default:
        return (
          <div className="min-h-screen flex items-center justify-center px-8">
            <div className="max-w-4xl w-full text-center">
              <div className="mb-12">
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  How skilled are you at{' '}
                  <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    investing?
                  </span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Log your first trade to find out and start tracking your investment performance
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <LogTrade 
                  trades={trades}
                  onAddTrade={handleAddTrade}
                  onCloseTrade={handleCloseTrade}
                  isFirstTrade={trades.length === 0}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        hasTrades={trades.length > 0}
      />
      
      <main className="ml-64">
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
