
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X } from 'lucide-react';

interface ProfileProps {
  isOwnProfile?: boolean;
  userId?: string;
}

const Profile = ({ isOwnProfile = true, userId }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'TradeGuru',
    displayPicture: '/placeholder.svg',
    bio: 'Passionate trader focused on value investing and long-term growth strategies. 5+ years of market experience.',
    dateJoined: new Date('2023-01-15'),
    socials: {
      twitter: 'https://twitter.com/tradeguru',
      linkedin: 'https://linkedin.com/in/tradeguru'
    }
  });

  const [editForm, setEditForm] = useState(profile);

  const mockPerformance = {
    totalTrades: 45,
    openTrades: 8,
    closedTrades: 37,
    successRateAll: 78.2,
    averageAlphaAll: 12.5,
    successRateClosed: 82.1,
    averageAlphaClosed: 15.3
  };

  const mockTrades = [
    {
      id: '1',
      ticker: 'AAPL',
      side: 'buy' as const,
      entryPrice: 150.25,
      entryDate: new Date('2024-01-15'),
      status: 'closed' as const,
      exitPrice: 165.80,
      exitDate: new Date('2024-02-10'),
      return: 10.35
    },
    {
      id: '2',
      ticker: 'TSLA',
      side: 'buy' as const,
      entryPrice: 220.50,
      entryDate: new Date('2024-02-20'),
      status: 'open' as const,
      return: -5.2
    },
    {
      id: '3',
      ticker: 'MSFT',
      side: 'buy' as const,
      entryPrice: 380.00,
      entryDate: new Date('2024-01-08'),
      status: 'closed' as const,
      exitPrice: 420.15,
      exitDate: new Date('2024-03-01'),
      return: 10.57
    }
  ];

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={isEditing ? editForm.displayPicture : profile.displayPicture} />
                <AvatarFallback className="text-lg">{profile.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="text-xl font-bold mb-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                )}
                <p className="text-sm text-gray-600">
                  Member since {profile.dateJoined.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Bio */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Bio</h3>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-600">{profile.bio}</p>
              )}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Social Links</h3>
              <div className="flex gap-3">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Twitter URL"
                      value={editForm.socials.twitter}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        socials: { ...prev.socials, twitter: e.target.value }
                      }))}
                      className="text-sm"
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      value={editForm.socials.linkedin}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        socials: { ...prev.socials, linkedin: e.target.value }
                      }))}
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleSocialClick(profile.socials.twitter)}
                      className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-xs font-bold">X</span>
                    </button>
                    <button
                      onClick={() => handleSocialClick(profile.socials.linkedin)}
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-xs font-bold">in</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{mockPerformance.totalTrades}</div>
              <div className="text-sm text-gray-600 mb-3">Number of Trades</div>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{mockPerformance.totalTrades}</span>
                  <span className="text-gray-500 ml-1">Total</span>
                </div>
                <div>
                  <span className="font-medium text-green-600">{mockPerformance.openTrades}</span>
                  <span className="text-gray-500 ml-1">Open</span>
                </div>
                <div>
                  <span className="font-medium text-blue-600">{mockPerformance.closedTrades}</span>
                  <span className="text-gray-500 ml-1">Closed</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 text-center border-b border-gray-200 pb-2">All Trades</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{mockPerformance.successRateAll.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    <span className={mockPerformance.averageAlphaAll >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {mockPerformance.averageAlphaAll >= 0 ? '+' : ''}{mockPerformance.averageAlphaAll.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Average Alpha</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 text-center border-b border-gray-200 pb-2">Closed Only</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{mockPerformance.successRateClosed.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    <span className={mockPerformance.averageAlphaClosed >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {mockPerformance.averageAlphaClosed >= 0 ? '+' : ''}{mockPerformance.averageAlphaClosed.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Average Alpha</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance History */}
      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Ticker
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Entry Date
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Side
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Entry Price
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Return
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-25">
                    <td className="py-3 px-2 text-sm font-medium text-gray-900 font-mono">
                      {trade.ticker}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600 font-mono">
                      {trade.entryDate.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <Badge variant={trade.side === 'buy' ? 'default' : 'destructive'}>
                        {trade.side === 'buy' ? 'Long' : 'Short'}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900 text-right font-mono">
                      ${trade.entryPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <Badge variant={trade.status === 'open' ? 'secondary' : 'outline'}>
                        {trade.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-mono">
                      <span className={trade.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {trade.return >= 0 ? '+' : ''}{trade.return.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
