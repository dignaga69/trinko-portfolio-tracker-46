
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, User } from 'lucide-react';

interface LeaderboardEntry {
  id: number;
  user: string;
  profit: number;
  trades: number;
  winRate: number;
}

const Community = () => {
  const { user } = useAuth();

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { id: 1, user: "TraderPro1", profit: 12453, trades: 120, winRate: 87 },
    { id: 2, user: "WallStreetKing", profit: 11234, trades: 110, winRate: 82 },
    { id: 3, user: "StockMaster", profit: 9876, trades: 100, winRate: 79 },
    { id: 4, user: "InvestmentGuru", profit: 8765, trades: 90, winRate: 76 },
    { id: 5, user: "MarketMover", profit: 7654, trades: 80, winRate: 73 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy size={24} />
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>
      <p className="text-sm italic text-gray-600">
        The best shot-callers.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Top Traders</CardTitle>
          <CardDescription>See who's leading the pack this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entry.user}</div>
                          {/* <div className="text-sm text-gray-500">email@example.com</div> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${entry.profit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.trades}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.winRate}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {!user && (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Sign in to see where you rank</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Community;
