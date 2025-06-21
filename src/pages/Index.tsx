
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import LogTrade from '@/components/LogTrade';
import Performance from '@/components/Performance';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('log-trade');
  const [trades, setTrades] = useState<Trade[]>([]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
      default:
        return <LogTrade trades={trades} onAddTrade={handleAddTrade} onCloseTrade={handleCloseTrade} />;
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'Monaco, monospace' }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Don't render the main app if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Monaco, monospace' }}>
      {/* Center the entire app with max width and horizontal margins */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-8">
        <div className="flex">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <main className="flex-1 ml-8">
            <div className="max-w-4xl">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
