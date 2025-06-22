import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import LogTradeWrapper from '@/components/LogTradeWrapper';
import PerformanceWrapper from '@/components/PerformanceWrapper';
import Community from '@/components/Community';
import Footer from '@/components/Footer';
import { FileText, BarChart3, Trophy } from 'lucide-react';

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
  const { loading } = useAuth();
  const { isPrivate } = usePrivacy();
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

  const getSectionIcon = () => {
    switch (activeSection) {
      case 'log-trade':
        return <FileText size={24} className="mr-2" />;
      case 'performance':
        return <BarChart3 size={24} className="mr-2" />;
      case 'leaderboard':
        return <Trophy size={24} className="mr-2" />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'log-trade':
        return 'Log Trade';
      case 'performance':
        return 'Performance';
      case 'leaderboard':
        return 'Leaderboard';
      default:
        return '';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'log-trade':
        return (
          <LogTradeWrapper 
            trades={trades}
            onAddTrade={handleAddTrade}
            onCloseTrade={handleCloseTrade}
          />
        );
      case 'performance':
        return <PerformanceWrapper trades={trades} />;
      case 'leaderboard':
        return <Community isUserPrivate={isPrivate} />;
      default:
        return (
          <LogTradeWrapper 
            trades={trades}
            onAddTrade={handleAddTrade}
            onCloseTrade={handleCloseTrade}
          />
        );
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNavigation />
      
      {/* Center the entire app with max width and horizontal margins */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8">
        <div className="flex h-full">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <main className="flex-1 ml-8">
            <div className="max-w-4xl mt-16">
              {/* Section Header */}
              <div className="flex items-center mb-6">
                {getSectionIcon()}
                <h1 className="text-2xl font-bold">{getSectionTitle()}</h1>
              </div>
              
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
