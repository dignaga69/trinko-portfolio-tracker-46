import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Eye, User } from 'lucide-react';

const Forum = () => {
  const { user } = useAuth();

  // Mock forum data
  const forumPosts = [
    {
      id: 1,
      title: "Market Analysis: Q4 2024 Predictions",
      author: "MarketExpert",
      replies: 23,
      views: 1234,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Tesla's Future: Bull or Bear Case?",
      author: "TechAnalyst",
      replies: 18,
      views: 987,
      lastActivity: "4 hours ago"
    },
    {
      id: 3,
      title: "Crypto vs Traditional Stocks Discussion",
      author: "InvestorGuru",
      replies: 31,
      views: 756,
      lastActivity: "6 hours ago"
    },
    {
      id: 4,
      title: "Best Trading Strategies for Beginners",
      author: "TradeTeacher",
      replies: 45,
      views: 2103,
      lastActivity: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare size={24} />
        <h1 className="text-2xl font-bold">Forum</h1>
      </div>
      <p className="text-sm italic text-gray-600">
        Join the community discussions.
      </p>

      {user && (
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          Create New Post
        </Button>
      )}

      <div className="space-y-4">
        {forumPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={14} />
                      <span>{post.replies} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{post.views} views</span>
                    </div>
                    <span>Last activity: {post.lastActivity}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!user && (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Sign in to create posts and join discussions</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Forum;
