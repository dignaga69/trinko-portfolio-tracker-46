
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  // Mock data for now
  const trendingPros = [
    { name: "TraderPro1", winRate: "87%", averageAlpha: "+234%" },
    { name: "WallStreetKing", winRate: "82%", averageAlpha: "+187%" },
    { name: "StockMaster", winRate: "79%", averageAlpha: "+156%" },
  ];

  const legendaryCalls = [
    { ticker: "AAPL", entryDate: "2024-01-15", exitDate: "2024-03-20", alpha: "+234%" },
    { ticker: "TSLA", entryDate: "2024-02-03", exitDate: "2024-04-10", alpha: "+187%" },
    { ticker: "NVDA", entryDate: "2024-01-28", exitDate: "2024-03-15", alpha: "+156%" },
  ];

  const topDiscussions = [
    { title: "Market Analysis: Q4 2024", views: 1234, author: "MarketExpert" },
    { title: "Tesla's Future Predictions", views: 987, author: "TechAnalyst" },
    { title: "Crypto vs Stocks Discussion", views: 756, author: "InvestorGuru" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HomeIcon size={24} />
        <h1 className="text-2xl font-bold">Home</h1>
      </div>

      {/* Your Performance - moved to top */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Performance</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {user ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Total Trades</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-gray-600">Win Rate (All)</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-gray-600">Average Alpha (All)</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Sign in to view your performance</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Trending Pros</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>User</div>
                <div>Win Rate (All)</div>
                <div>Average Alpha (All)</div>
              </div>
              {trendingPros.map((pro, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <p className="text-sm font-medium">{pro.name}</p>
                  <p className="text-sm">{pro.winRate}</p>
                  <p className="text-sm font-semibold text-green-600">{pro.averageAlpha}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Legendary Calls</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Ticker</div>
                <div>Entry Date</div>
                <div>Exit Date</div>
                <div>Alpha</div>
              </div>
              {legendaryCalls.map((call, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 items-center">
                  <p className="text-sm font-medium">{call.ticker}</p>
                  <p className="text-sm">{call.entryDate}</p>
                  <p className="text-sm">{call.exitDate}</p>
                  <p className="text-sm font-semibold text-green-600">{call.alpha}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Join The Discussions</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-3">
            {topDiscussions.map((discussion, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{discussion.title}</p>
                  <p className="text-sm text-gray-600">by {discussion.author}</p>
                </div>
                <p className="text-sm text-gray-500">{discussion.views} views</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
