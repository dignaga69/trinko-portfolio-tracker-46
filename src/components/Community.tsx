
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users } from 'lucide-react';

interface SharedPortfolio {
  id: string;
  name: string;
  createdAt: Date;
  adminId: string;
  adminName: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  inviteCode: string;
}

interface CommunityProps {
  isUserPrivate: boolean;
  sharedPortfolios?: SharedPortfolio[];
}

const Community = ({ isUserPrivate, sharedPortfolios = [] }: CommunityProps) => {
  // Mock data for top portfolios
  const topPortfolios = [
    { rank: 1, user: "AlphaTrader", portfolio: "Tech Growth", return: "+47.2%", alpha: "+23.8%", trades: 34 },
    { rank: 2, user: "ValueSeeker", portfolio: "Dividend Kings", return: "+32.1%", alpha: "+18.4%", trades: 28 },
    { rank: 3, user: "MomentumMaster", portfolio: "Breakout Plays", return: "+28.9%", alpha: "+15.7%", trades: 52 },
    { rank: 4, user: "DeepValue", portfolio: "Contrarian Bets", return: "+25.3%", alpha: "+12.9%", trades: 19 },
    { rank: 5, user: "TechBull", portfolio: "AI Revolution", return: "+22.7%", alpha: "+9.8%", trades: 41 },
  ];

  // Mock data for top shared portfolios
  const topSharedPortfolios = [
    { rank: 1, admin: "CollabTrader", portfolio: "Team Alpha", return: "+41.8%", alpha: "+19.2%", trades: 67 },
    { rank: 2, admin: "GroupGuru", portfolio: "Momentum Squad", return: "+38.4%", alpha: "+16.7%", trades: 89 },
    { rank: 3, admin: "TeamLeader", portfolio: "Value Hunters", return: "+34.2%", alpha: "+14.1%", trades: 53 },
    { rank: 4, admin: "PortfolioAdmin", portfolio: "Growth Gang", return: "+31.6%", alpha: "+12.3%", trades: 71 },
    { rank: 5, admin: "SharedSuccess", portfolio: "Dividend Team", return: "+29.8%", alpha: "+10.5%", trades: 44 },
  ];

  if (isUserPrivate) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm italic text-gray-600 mt-2">
            Your profile is private. You cannot view the leaderboard while in private mode.
          </p>
        </div>
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Switch to public mode to view the community leaderboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm italic text-gray-600 mt-2">
          Discover the top-performing traders and portfolios in our community.
        </p>
      </div>

      {/* Top Portfolios */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            Top Portfolios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Portfolio
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Return
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Alpha
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Trades
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPortfolios.map((portfolio) => (
                  <tr key={portfolio.rank} className="border-b border-gray-100 hover:bg-gray-25">
                    <td className="py-3 px-2 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{portfolio.rank}</span>
                        {portfolio.rank <= 3 && (
                          <Trophy 
                            size={16} 
                            className={
                              portfolio.rank === 1 ? 'text-yellow-500' :
                              portfolio.rank === 2 ? 'text-gray-400' :
                              'text-yellow-600'
                            } 
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">
                      {portfolio.user}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {portfolio.portfolio}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className="text-green-600 font-medium">
                        {portfolio.return}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className="text-green-600 font-semibold">
                        {portfolio.alpha}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-gray-600">
                      {portfolio.trades}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Shared Portfolios */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            Top Shared Portfolios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Admin
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Portfolio
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Return
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Alpha
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Trades
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSharedPortfolios.map((portfolio) => (
                  <tr key={portfolio.rank} className="border-b border-gray-100 hover:bg-gray-25">
                    <td className="py-3 px-2 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{portfolio.rank}</span>
                        {portfolio.rank <= 3 && (
                          <Trophy 
                            size={16} 
                            className={
                              portfolio.rank === 1 ? 'text-yellow-500' :
                              portfolio.rank === 2 ? 'text-gray-400' :
                              'text-yellow-600'
                            } 
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900 flex items-center gap-2">
                      {portfolio.admin}
                      <Badge variant="outline" className="text-xs">
                        <Users size={12} className="mr-1" />
                        Shared
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {portfolio.portfolio}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className="text-green-600 font-medium">
                        {portfolio.return}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className="text-green-600 font-semibold">
                        {portfolio.alpha}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-gray-600">
                      {portfolio.trades}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-none bg-gray-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-green-500 mr-2" size={24} />
              <span className="text-2xl font-bold text-gray-900">1,247</span>
            </div>
            <p className="text-sm text-gray-600">Active Traders</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-none bg-gray-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="text-yellow-500 mr-2" size={24} />
              <span className="text-2xl font-bold text-gray-900">34,891</span>
            </div>
            <p className="text-sm text-gray-600">Total Trades</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-none bg-gray-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="text-blue-500 mr-2" size={24} />
              <span className="text-2xl font-bold text-gray-900">183</span>
            </div>
            <p className="text-sm text-gray-600">Shared Portfolios</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
