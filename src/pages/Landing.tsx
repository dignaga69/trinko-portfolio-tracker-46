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
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl px-8">
          <h1 className="text-[8rem] font-black text-gray-900 tracking-tight leading-none">
            S&P500
          </h1>
          
          <h2 className="text-3xl font-bold text-gray-800">
            Can You Beat It?
          </h2>
          
          <p className="text-base text-gray-600 leading-relaxed">
            Track Your Trades, Get Superior Insights, View What Top Traders Are Doing, And Much More At Trinko.Ai
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
      
      <Footer />
    </div>
  );
};

export default Landing;
