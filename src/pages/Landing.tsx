
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import TopNavigation from '@/components/TopNavigation';
import Footer from '@/components/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect logged-in users to the main app
  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  const handleLaunchPortfolio = () => {
    if (user) {
      // If logged in, redirect to Portfolio tab in main app
      navigate('/app?section=portfolio');
    } else {
      // If logged out, redirect to login/register page
      navigate('/auth');
    }
  };

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If logged in, this will redirect via useEffect above
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNavigation />
      
      {/* Hero Section */}
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-6 max-w-2xl px-8">
          <h1 className="text-[8rem] font-black text-gray-900 tracking-tight leading-none">
            S&P500
          </h1>
          
          <h2 className="text-3xl font-bold text-gray-800">
            Can You Beat It?
          </h2>
          
          <p className="text-base text-gray-600 leading-relaxed">
            Begin your journey at Trinko—where every trade counts and the best rise to the top.
          </p>
          
          <div className="pt-4">
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              onClick={handleLaunchPortfolio}
            >
              Launch My Portfolio
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Survival Mode Trading */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Survival Mode Trading: No Cheating, Just Results
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Can you outperform the market? Track your alpha against the S&P 500 and other benchmarks in real-time with permanent, undeletable trade records. No importing past data, no backdating, no gaming the system—only your actual performance from day one forward.
            </p>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
              onClick={handleAuthRedirect}
            >
              Begin Tracking
            </Button>
          </div>

          {/* Discover Hidden Trading Legends */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Discover Hidden Trading Legends
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Talented individual traders are crushing institutional returns but flying under the radar. Join the community where retail gets the recognition it deserves through transparent, verified performance.
            </p>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
              onClick={handleAuthRedirect}
            >
              See Leaderboard
            </Button>
          </div>

          {/* Learn from Proven Alpha Generators */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Learn from Proven Alpha Generators
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Find consistently profitable investors and their portfolios in our community and track their strategies real-time. When someone's beating the market month after month, you'll want to pay attention.
            </p>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
              onClick={handleAuthRedirect}
            >
              Explore Portfolios
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Landing;
