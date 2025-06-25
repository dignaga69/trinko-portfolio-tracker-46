
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SharedPortfolio {
  id: string;
  name: string;
  adminId: string;
  adminEmail: string;
  members: { id: string; email: string }[];
  createdAt: Date;
}

interface CommunityProps {
  isUserPrivate: boolean;
  sharedPortfolios?: SharedPortfolio[];
}

const Community = ({ isUserPrivate, sharedPortfolios = [] }: CommunityProps) => {
  // Mock data for top portfolios
  const topPortfolios = [
    { rank: 1, user: 'TradeMaster99', portfolio: 'Tech Growth', alpha: 23.5, trades: 45, successRate: 78 },
    { rank: 2, user: 'ValueInvestor', portfolio: 'Blue Chips', alpha: 18.2, trades: 32, successRate: 82 },
    { rank: 3, user: 'SwingTrader', portfolio: 'Momentum Plays', alpha: 15.7, trades: 67, successRate: 65 },
    { rank: 4, user: 'DividendKing', portfolio: 'Income Focus', alpha: 12.3, trades: 28, successRate: 89 },
    { rank: 5, user: 'GrowthHunter', portfolio: 'Small Cap Gems', alpha: 11.9, trades: 52, successRate: 71 },
  ];

  // Mock data for shared portfolios with performance metrics
  const topSharedPortfolios = sharedPortfolios.length > 0 ? 
    sharedPortfolios.map((portfolio, index) => ({
      rank: index + 1,
      admin: portfolio.adminEmail,
      portfolio: portfolio.name,
      alpha: Math.random() * 25 + 5, // Mock alpha between 5-30
      trades: Math.floor(Math.random() * 50) + 10, // Mock trades between 10-60
      successRate: Math.floor(Math.random() * 30) + 60, // Mock success rate between 60-90
      members: portfolio.members.length + 1 // Include admin
    })).sort((a, b) => b.alpha - a.alpha).slice(0, 5) :
    [
      { rank: 1, admin: 'team.leader@company.com', portfolio: 'Collaborative Growth', alpha: 21.3, trades: 38, successRate: 75, members: 4 },
      { rank: 2, admin: 'portfolio.manager@fund.com', portfolio: 'Shared Strategies', alpha: 19.8, trades: 44, successRate: 80, members: 3 },
      { rank: 3, admin: 'group.trader@collective.io', portfolio: 'Team Alpha', alpha: 17.2, trades: 29, successRate: 73, members: 5 },
      { rank: 4, admin: 'lead.investor@syndicate.net', portfolio: 'Joint Ventures', alpha: 14.6, trades: 36, successRate: 68, members: 2 },
      { rank: 5, admin: 'co.founder@startup.com', portfolio: 'Startup Picks', alpha: 13.9, trades: 41, successRate: 76, members: 4 },
    ];

  const getBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Privacy Notice */}
      {isUserPrivate && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <p className="text-yellow-800 text-sm">
              Your profile is set to private. You won't appear in the leaderboards, but you can still view community rankings.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top Portfolios Section */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Portfolios</CardTitle>
          <p className="text-sm italic text-gray-600 mt-2">
            Leading performers in the community based on alpha generation.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPortfolios.map((portfolio) => (
              <div key={portfolio.rank} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-4">
                  <Badge variant={getBadgeVariant(portfolio.rank)} className="w-8 h-8 rounded-full flex items-center justify-center">
                    #{portfolio.rank}
                  </Badge>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm">
                      {portfolio.user.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">{portfolio.portfolio}</h3>
                    <p className="text-sm text-gray-600">{portfolio.user}</p>
                  </div>
                </div>
                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-sm font-medium text-green-600">+{portfolio.alpha.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">Alpha</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{portfolio.trades}</p>
                    <p className="text-xs text-gray-500">Trades</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{portfolio.successRate}%</p>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Shared Portfolios Section */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Shared Portfolios</CardTitle>
          <p className="text-sm italic text-gray-600 mt-2">
            Best performing collaborative portfolios in the community.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSharedPortfolios.map((portfolio) => (
              <div key={portfolio.rank} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-4">
                  <Badge variant={getBadgeVariant(portfolio.rank)} className="w-8 h-8 rounded-full flex items-center justify-center">
                    #{portfolio.rank}
                  </Badge>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm">
                      {portfolio.admin.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">{portfolio.portfolio}</h3>
                    <p className="text-sm text-gray-600">{portfolio.admin}</p>
                    <p className="text-xs text-gray-500">{portfolio.members} members</p>
                  </div>
                </div>
                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-sm font-medium text-green-600">+{portfolio.alpha.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">Alpha</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{portfolio.trades}</p>
                    <p className="text-xs text-gray-500">Trades</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{portfolio.successRate}%</p>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
