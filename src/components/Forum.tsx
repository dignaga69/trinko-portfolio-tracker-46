
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus, MessageCircle, Eye, User } from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  author: string;
  content: string;
  replies: number;
  views: number;
  createdAt: string;
}

interface Comment {
  id: string;
  threadId: string;
  author: string;
  content: string;
  createdAt: string;
}

const Forum = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '1',
      title: 'Market Analysis: Q4 2024 Predictions',
      author: 'MarketExpert',
      content: 'What are your thoughts on the market direction for Q4 2024? I believe we might see some volatility due to...',
      replies: 12,
      views: 1234,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Tesla Stock Discussion - Future Outlook',
      author: 'TechAnalyst',
      content: 'TSLA has been making some interesting moves lately. Let\'s discuss the potential catalysts and risks...',
      replies: 8,
      views: 987,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Options Trading Strategies for Beginners',
      author: 'OptionsKing',
      content: 'New to options trading? Here are some basic strategies to get you started safely...',
      replies: 15,
      views: 756,
      createdAt: '2024-01-13'
    }
  ]);

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleCreateThread = () => {
    if (!user || !newThreadTitle.trim() || !newThreadContent.trim()) return;

    const thread: Thread = {
      id: Date.now().toString(),
      title: newThreadTitle,
      author: user.email?.split('@')[0] || 'Anonymous',
      content: newThreadContent,
      replies: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setThreads([thread, ...threads]);
    setNewThreadTitle('');
    setNewThreadContent('');
    setShowNewThreadForm(false);
  };

  const handleAddComment = () => {
    if (!user || !newComment.trim() || !selectedThread) return;
    // In a real app, this would add to a comments array and update the thread's reply count
    setNewComment('');
  };

  if (selectedThread) {
    return (
      <div className="space-y-6">
        {/* Page Heading */}
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={24} className="text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Forum</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedThread(null)}
          >
            ← Back to Forum
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{selectedThread.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User size={16} />
                {selectedThread.author}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {selectedThread.views} views
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={16} />
                {selectedThread.replies} replies
              </span>
              <span>{selectedThread.createdAt}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{selectedThread.content}</p>
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <Button onClick={handleAddComment}>Post Comment</Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={24} className="text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Forum</h1>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Discussions</h2>
        {user && (
          <Button 
            onClick={() => setShowNewThreadForm(!showNewThreadForm)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Thread
          </Button>
        )}
      </div>

      {showNewThreadForm && user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Thread title..."
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateThread}>Create Thread</Button>
              <Button variant="outline" onClick={() => setShowNewThreadForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {threads.map((thread) => (
          <Card 
            key={thread.id} 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setSelectedThread(thread)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{thread.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{thread.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {thread.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {thread.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {thread.views}
                    </span>
                    <span>{thread.createdAt}</span>
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
            <p className="text-gray-600 mb-4">Sign in to create new threads and participate in discussions</p>
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
