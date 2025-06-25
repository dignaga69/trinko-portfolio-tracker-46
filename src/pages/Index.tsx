
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import LogTradeWrapper from '@/components/LogTradeWrapper';
import PerformanceWrapper from '@/components/PerformanceWrapper';
import Community from '@/components/Community';
import Footer from '@/components/Footer';
import { FileText, BarChart3, Trophy, Folder } from 'lucide-react';
import PortfolioManager from '@/components/PortfolioManager';
import SharedPortfolioManager from '@/components/SharedPortfolioManager';

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
  isShared?: boolean;
}

interface Portfolio {
  id: string;
  name: string;
  createdAt: Date;
}

interface SharedPortfolio {
  id: string;
  name: string;
  adminId: string;
  adminEmail: string;
  members: { id: string; email: string }[];
  createdAt: Date;
}

const Index = () => {
  const { user, loading } = useAuth();
  const { isPrivate } = usePrivacy();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('portfolio');
  const [portfolioView, setPortfolioView] = useState<'personal' | 'shared'>('personal');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [sharedPortfolios, setSharedPortfolios] = useState<SharedPortfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');

  // Mock current user email - in real app this would come from auth
  const currentUserEmail = 'user@example.com';

  // Check if user is logged in, if not redirect to landing
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Handle URL section parameter
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['portfolio', 'log-trade', 'performance', 'leaderboard'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Portfolio management functions
  const handleCreatePortfolio = (name: string) => {
    const portfolio: Portfolio = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
    };
    setPortfolios(prev => [...prev, portfolio]);
    
    // If this is the first portfolio, select it
    if (portfolios.length === 0) {
      setSelectedPortfolioId(portfolio.id);
    }
  };

  const handleRenamePortfolio = (id: string, newName: string) => {
    setPortfolios(prev => prev.map(portfolio => 
      portfolio.id === id ? { ...portfolio, name: newName } : portfolio
    ));
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
    // Remove trades from deleted portfolio
    setTrades(prev => prev.filter(trade => trade.portfolioId !== id || trade.isShared));
    // If deleted portfolio was selected, clear selection
    if (selectedPortfolioId === id) {
      setSelectedPortfolioId('');
    }
  };

  // Shared portfolio management functions
  const handleCreateSharedPortfolio = (name: string, inviteEmails: string[]) => {
    const sharedPortfolio: SharedPortfolio = {
      id: `shared_${Date.now()}`,
      name,
      adminId: 'current_user_id',
      adminEmail: currentUserEmail,
      members: inviteEmails.map((email, index) => ({ id: `member_${Date.now()}_${index}`, email })),
      createdAt: new Date(),
    };
    setSharedPortfolios(prev => [...prev, sharedPortfolio]);
  };

  const handleRenameSharedPortfolio = (id: string, newName: string) => {
    setSharedPortfolios(prev => prev.map(portfolio => 
      portfolio.id === id ? { ...portfolio, name: newName } : portfolio
    ));
  };

  const handleDeleteSharedPortfolio = (id: string) => {
    setSharedPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
    // Remove trades from deleted shared portfolio
    setTrades(prev => prev.filter(trade => trade.portfolioId !== id));
    // If deleted portfolio was selected, clear selection
    if (selectedPortfolioId === id) {
      setSelectedPortfolioId('');
    }
  };

  const handleInviteToPortfolio = (portfolioId: string, emails: string[]) => {
    setSharedPortfolios(prev => prev.map(portfolio => {
      if (portfolio.id === portfolioId) {
        const currentMemberEmails = portfolio.members.map(m => m.email);
        const newMembers = emails
          .filter(email => !currentMemberEmails.includes(email))
          .slice(0, 4 - portfolio.members.length)
          .map((email, index) => ({ 
            id: `member_${Date.now()}_${index}`, 
            email 
          }));
        
        return {
          ...portfolio,
          members: [...portfolio.members, ...newMembers]
        };
      }
      return portfolio;
    }));
  };

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    // Check if it's a shared portfolio
    const isSharedPortfolio = sharedPortfolios.some(sp => sp.id === newTrade.portfolioId);
    
    const trade: Trade = {
      ...newTrade,
      id: Date.now().toString(),
      isShared: isSharedPortfolio,
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

  // Get all portfolios (personal + shared) for dropdowns
  const getAllPortfolios = () => {
    const personalPortfoliosWithType = portfolios.map(p => ({ ...p, type: 'personal' as const }));
    const sharedPortfoliosWithType = sharedPortfolios.map(sp => ({ 
      id: sp.id, 
      name: sp.name, 
      createdAt: sp.createdAt, 
      type: 'shared' as const 
    }));
    return [...personalPortfoliosWithType, ...sharedPortfoliosWithType];
  };

  const getSectionConfig = () => {
    const configs = {
      portfolio: { icon: Folder, title: 'Portfolio' },
      'log-trade': { icon: FileText, title: 'Log Trade' },
      performance: { icon: BarChart3, title: 'Performance' },
      leaderboard: { icon: Trophy, title: 'Leaderboard' },
    };
    return configs[activeSection as keyof typeof configs] || configs.portfolio;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            {/* Portfolio View Toggle */}
            <div className="flex space-x-1 bg-gray-50 p-1 rounded-lg w-fit">
              <button
                onClick={() => setPortfolioView('personal')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  portfolioView === 'personal' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Your Portfolios
              </button>
              <button
                onClick={() => setPortfolioView('shared')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  portfolioView === 'shared' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shared Portfolios
              </button>
            </div>

            {portfolioView === 'personal' ? (
              <PortfolioManager
                portfolios={portfolios}
                onCreatePortfolio={handleCreatePortfolio}
                onRenamePortfolio={handleRenamePortfolio}
                onDeletePortfolio={handleDeletePortfolio}
              />
            ) : (
              <SharedPortfolioManager
                sharedPortfolios={sharedPortfolios}
                currentUserEmail={currentUserEmail}
                onCreateSharedPortfolio={handleCreateSharedPortfolio}
                onRenameSharedPortfolio={handleRenameSharedPortfolio}
                onDeleteSharedPortfolio={handleDeleteSharedPortfolio}
                onInviteToPortfolio={handleInviteToPortfolio}
              />
            )}
          </div>
        );
      case 'log-trade':
        return (
          <LogTradeWrapper 
            trades={trades}
            portfolios={getAllPortfolios()}
            onAddTrade={handleAddTrade}
            onCloseTrade={handleCloseTrade}
          />
        );
      case 'performance':
        return (
          <PerformanceWrapper 
            trades={trades} 
            portfolios={getAllPortfolios()}
            selectedPortfolioId={selectedPortfolioId}
            onPortfolioChange={setSelectedPortfolioId}
          />
        );
      case 'leaderboard':
        return <Community isUserPrivate={isPrivate} sharedPortfolios={sharedPortfolios} />;
      default:
        return (
          <div className="space-y-6">
            {/* Portfolio View Toggle */}
            <div className="flex space-x-1 bg-gray-50 p-1 rounded-lg w-fit">
              <button
                onClick={() => setPortfolioView('personal')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  portfolioView === 'personal' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Your Portfolios
              </button>
              <button
                onClick={() => setPortfolioView('shared')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  portfolioView === 'shared' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shared Portfolios
              </button>
            </div>

            {portfolioView === 'personal' ? (
              <PortfolioManager
                portfolios={portfolios}
                onCreatePortfolio={handleCreatePortfolio}
                onRenamePortfolio={handleRenamePortfolio}
                onDeletePortfolio={handleDeletePortfolio}
              />
            ) : (
              <SharedPortfolioManager
                sharedPortfolios={sharedPortfolios}
                currentUserEmail={currentUserEmail}
                onCreateSharedPortfolio={handleCreateSharedPortfolio}
                onRenameSharedPortfolio={handleRenameSharedPortfolio}
                onDeleteSharedPortfolio={handleDeleteSharedPortfolio}
                onInviteToPortfolio={handleInviteToPortfolio}
              />
            )}
          </div>
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

  // If not logged in, this will redirect via useEffect above
  if (!user) {
    return null;
  }

  const { icon: IconComponent, title } = getSectionConfig();

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
                <IconComponent size={24} className="mr-2" />
                <h1 className="text-2xl font-bold">{title}</h1>
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
