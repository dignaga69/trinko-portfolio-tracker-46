
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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

  const handleWatchDemo = () => {
    // TODO: Implement demo functionality
    console.log('Watch demo clicked');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If logged in, this will redirect via useEffect above
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Brand */}
        <div className="mb-16">
          <h1 className="text-2xl font-bold tracking-wider mb-8">TRINKO</h1>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h2 className="text-8xl md:text-9xl font-black tracking-tight leading-none">
            S&P500
          </h2>
          <h3 className="text-4xl md:text-5xl font-light tracking-wide">
            CAN YOU BEAT IT?
          </h3>
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto py-8">
          <p className="text-lg md:text-xl leading-relaxed font-light">
            TRACK YOUR TRADES. GET SUPERIOR ANALYTICS. MAXIMISE ALPHA. GO SOLO OR CREATE PORTFOLIOS WITH YOUR FRIENDS. COMPETE WITH OTHERS. AND SO MUCH MORE. BEGIN YOUR TRADING JOURNEY NOW.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white my-12"></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button
            onClick={handleLaunchPortfolio}
            className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-full min-w-48"
          >
            LAUNCH MY PORTFOLIO
          </Button>
          <Button
            onClick={handleWatchDemo}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-full min-w-48"
          >
            WATCH DEMO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
