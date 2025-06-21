
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const { user } = useAuth();

  // Mock data for now
  const trendingPros = [
    { name: "TraderPro1", profit: "$12,453", accuracy: "87%" },
    { name: "WallStreetKing", profit: "$11,234", accuracy: "82%" },
    { name: "StockMaster", profit: "$9,876", accuracy: "79%" },
  ];

  const legendaryCalls = [
    { ticker: "AAPL", profit: "+234%", user: "TraderPro1", date: "2024-01-15" },
    { ticker: "TSLA", profit: "+187%", user: "WallStreetKing", date: "2024-02-03" },
    { ticker: "NVDA", profit: "+156%", user: "StockMaster", date: "2024-01-28" },
  ];

  const topDiscussions = [
    { title: "Market Analysis: Q4 2024", views: 1234, author: "MarketExpert" },
    { title: "Tesla's Future Predictions", views: 987, author: "TechAnalyst" },
    { title: "Crypto vs Stocks Discussion", views: 756, author: "InvestorGuru" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        
              <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">$0</p>
                <p className="text-sm text-gray-600">Total P&L</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Total Trades</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-gray-600">Win Rate</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Sign in to view your performance</p>
          )}
        </CardContent>
      </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Trending Pros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingPros.map((pro, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{pro.name}</p>
                    <p className="text-sm text-gray-600">Accuracy: {pro.accuracy}</p>
                  </div>
                  <p className="font-semibold text-green-600">{pro.profit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Legendary Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {legendaryCalls.map((call, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{call.ticker}</p>
                    <p className="text-sm text-gray-600">by {call.user}</p>
                  </div>
                  <p className="font-semibold text-green-600">{call.profit}</p>
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
        <CardContent>
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
