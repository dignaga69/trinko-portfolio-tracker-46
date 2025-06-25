
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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

  const handleWatchDemo = () => {
    // TODO: Implement demo functionality
    console.log('Watch demo clicked');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If logged in, this will redirect via useEffect above
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-xl font-bold tracking-wider">
          TRINKO
        </div>
        <div className="flex gap-6">
          <button 
            className="text-white hover:text-gray-300 transition-colors"
            onClick={() => navigate('/auth')}
          >
            Login
          </button>
          <button 
            className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/auth')}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-start px-8">
        <div className="max-w-4xl text-left space-y-12">
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
              S&P500
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">
              CAN YOU BEAT IT?
            </h2>
          </div>
          {/* Description */}
          <div className="max-w-4xl">
            <p className="text-lg md:text-xl leading-relaxed font-light text-gray-300">
              TRACK YOUR TRADES. GET SUPERIOR ANALYTICS. MAXIMISE ALPHA. GO SOLO OR CREATE PORTFOLIOS WITH YOUR FRIENDS. COMPETE WITH OTHER TRADING LEGENDS. AND MUCH MORE. BEGIN YOUR TRADING JOURNEY NOW.
            </p>
          </div>
          {/* Divider Line */}
          <div className="w-full h-px bg-white/30 my-12"></div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-start items-start">
            <Button
              onClick={handleLaunchPortfolio}
              className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-full min-w-[200px] h-auto"
            >
              LAUNCH MY PORTFOLIO
            </Button>
            <Button
              onClick={handleWatchDemo}
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-full min-w-[200px] h-auto"
            >
              WATCH DEMO
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
