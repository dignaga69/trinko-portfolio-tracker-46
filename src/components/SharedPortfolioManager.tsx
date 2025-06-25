
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, UserPlus, Crown, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SharedPortfolio {
  id: string;
  name: string;
  adminId: string;
  adminName: string;
  members: { id: string; name: string; email: string }[];
  createdAt: Date;
}

interface SharedPortfolioManagerProps {
  sharedPortfolios: SharedPortfolio[];
  currentUserId: string;
  onCreateSharedPortfolio: (name: string, inviteEmails: string[]) => void;
  onDeleteSharedPortfolio: (id: string) => void;
  onLeaveSharedPortfolio: (id: string) => void;
}

const SharedPortfolioManager = ({ 
  sharedPortfolios, 
  currentUserId,
  onCreateSharedPortfolio, 
  onDeleteSharedPortfolio,
  onLeaveSharedPortfolio
}: SharedPortfolioManagerProps) => {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [inviteEmails, setInviteEmails] = useState(['']);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateSharedPortfolio = () => {
    if (newPortfolioName.trim() && newPortfolioName.length <= 25) {
      const validEmails = inviteEmails.filter(email => email.trim() && email.includes('@'));
      if (validEmails.length <= 4) {
        onCreateSharedPortfolio(newPortfolioName.trim(), validEmails);
        setNewPortfolioName('');
        setInviteEmails(['']);
        setIsCreateDialogOpen(false);
      }
    }
  };

  const addEmailField = () => {
    if (inviteEmails.length < 4) {
      setInviteEmails([...inviteEmails, '']);
    }
  };

  const removeEmailField = (index: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  const isAdmin = (portfolio: SharedPortfolio) => portfolio.adminId === currentUserId;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm italic text-gray-600 mt-2">
            Create and manage shared portfolios with up to 4 other users. Portfolio names cannot exceed 25 characters.
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Create Shared Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Shared Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio-name">Portfolio Name</Label>
                <Input
                  id="portfolio-name"
                  placeholder="Enter portfolio name"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value.slice(0, 25))}
                  maxLength={25}
                />
                <p className="text-xs text-gray-500">
                  {newPortfolioName.length}/25 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Invite Members (Optional)</Label>
                {inviteEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      type="email"
                    />
                    {inviteEmails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmailField(index)}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                {inviteEmails.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmailField}
                    className="gap-2"
                  >
                    <UserPlus size={14} />
                    Add Member
                  </Button>
                )}
                <p className="text-xs text-gray-500">
                  You can invite up to 4 members
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateSharedPortfolio}
                  disabled={!newPortfolioName.trim()}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-none bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Shared Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          {sharedPortfolios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No shared portfolios yet. Create your first shared portfolio to collaborate with others.
            </p>
          ) : (
            <div className="space-y-3">
              {sharedPortfolios.map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="flex items-center justify-between p-4 bg-white rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{portfolio.name}</h3>
                      {isAdmin(portfolio) && (
                        <Badge variant="secondary" className="gap-1">
                          <Crown size={12} />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Created {portfolio.createdAt.toLocaleDateString()} by {portfolio.adminName}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs text-gray-600">Members:</span>
                      {portfolio.members.map((member) => (
                        <Badge key={member.id} variant="outline" className="text-xs">
                          {member.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isAdmin(portfolio) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteSharedPortfolio(portfolio.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onLeaveSharedPortfolio(portfolio.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        Leave
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedPortfolioManager;
