
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const Community = () => {
  // Mock data for leaderboard
  const topTraders = [
    { rank: 1, name: "TraderPro1", winRate: "87%", totalTrades: 143, totalPnL: "$12,453" },
    { rank: 2, name: "WallStreetKing", winRate: "82%", totalTrades: 98, totalPnL: "$11,234" },
    { rank: 3, name: "StockMaster", winRate: "79%", totalTrades: 167, totalPnL: "$9,876" },
    { rank: 4, name: "CryptoGuru", winRate: "75%", totalTrades: 89, totalPnL: "$8,543" },
    { rank: 5, name: "OptionsPro", winRate: "73%", totalTrades: 156, totalPnL: "$7,321" },
  ];

  const bestTrades = [
    { ticker: "AAPL", profit: "+234%", user: "TraderPro1", date: "2024-01-15" },
    { ticker: "TSLA", profit: "+187%", user: "WallStreetKing", date: "2024-02-03" },
    { ticker: "NVDA", profit: "+156%", user: "StockMaster", date: "2024-01-28" },
    { ticker: "MSFT", profit: "+143%", user: "CryptoGuru", date: "2024-02-12" },
    { ticker: "GOOGL", profit: "+128%", user: "OptionsPro", date: "2024-01-20" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy size={24} className="text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
            <p className="text-sm italic text-gray-600">The best shot-callers.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTraders.map((trader) => (
                <div key={trader.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-600">#{trader.rank}</span>
                    <div>
                      <p className="font-medium">{trader.name}</p>
                      <p className="text-sm text-gray-600">{trader.totalTrades} trades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{trader.totalPnL}</p>
                    <p className="text-sm text-gray-600">{trader.winRate} win rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Best Trades</CardTitle>
            <p className="text-sm italic text-gray-600">The best market calls for each timeframe.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestTrades.map((trade, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{trade.ticker}</p>
                    <p className="text-sm text-gray-600">by {trade.user}</p>
                    <p className="text-xs text-gray-500">{trade.date}</p>
                  </div>
                  <p className="font-semibold text-green-600 text-lg">{trade.profit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
