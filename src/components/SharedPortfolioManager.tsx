
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Plus, Users, Crown, Mail } from 'lucide-react';
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
  adminEmail: string;
  members: { id: string; email: string }[];
  createdAt: Date;
}

interface SharedPortfolioManagerProps {
  sharedPortfolios: SharedPortfolio[];
  currentUserEmail: string;
  onCreateSharedPortfolio: (name: string, inviteEmails: string[]) => void;
  onRenameSharedPortfolio: (id: string, newName: string) => void;
  onDeleteSharedPortfolio: (id: string) => void;
  onInviteToPortfolio: (portfolioId: string, emails: string[]) => void;
}

const SharedPortfolioManager = ({ 
  sharedPortfolios, 
  currentUserEmail,
  onCreateSharedPortfolio, 
  onRenameSharedPortfolio, 
  onDeleteSharedPortfolio,
  onInviteToPortfolio
}: SharedPortfolioManagerProps) => {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [additionalInvites, setAdditionalInvites] = useState('');

  const handleCreateSharedPortfolio = () => {
    if (newPortfolioName.trim()) {
      const emails = inviteEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email && email !== currentUserEmail)
        .slice(0, 4); // Max 4 additional users
      
      onCreateSharedPortfolio(newPortfolioName.trim(), emails);
      setNewPortfolioName('');
      setInviteEmails('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleRenamePortfolio = (id: string) => {
    if (editingName.trim() && editingName.length <= 25) {
      onRenameSharedPortfolio(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleInviteUsers = (portfolioId: string) => {
    const emails = additionalInvites
      .split(',')
      .map(email => email.trim())
      .filter(email => email && email !== currentUserEmail);
    
    if (emails.length > 0) {
      onInviteToPortfolio(portfolioId, emails);
      setAdditionalInvites('');
      setSelectedPortfolioId(null);
    }
  };

  const startEditing = (portfolio: SharedPortfolio) => {
    setEditingId(portfolio.id);
    setEditingName(portfolio.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const isAdmin = (portfolio: SharedPortfolio) => {
    return portfolio.adminEmail === currentUserEmail;
  };

  const canInviteMore = (portfolio: SharedPortfolio) => {
    return portfolio.members.length < 4; // Admin + 4 members max
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm italic text-gray-600 mt-2">
            Create shared portfolios and invite up to 4 other users to collaborate on trades.
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Create Shared Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shared Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shared-portfolio-name">Portfolio Name</Label>
                <Input
                  id="shared-portfolio-name"
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
                <Label htmlFor="invite-emails">Invite Users (Optional)</Label>
                <Input
                  id="invite-emails"
                  placeholder="email1@example.com, email2@example.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Separate multiple emails with commas. Max 4 users.
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
          <CardTitle className="text-lg font-semibold">Your Shared Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          {sharedPortfolios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No shared portfolios yet. Create your first shared portfolio to start collaborating.
            </p>
          ) : (
            <div className="space-y-4">
              {sharedPortfolios.map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="p-4 bg-white rounded-lg border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {editingId === portfolio.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value.slice(0, 25))}
                            maxLength={25}
                            className="flex-1"
                          />
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              onClick={() => handleRenamePortfolio(portfolio.id)}
                              disabled={!editingName.trim()}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={cancelEditing}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{portfolio.name}</h3>
                            {isAdmin(portfolio) && (
                              <Crown className="w-4 h-4 text-yellow-500" title="Admin" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Created {portfolio.createdAt.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Admin: {portfolio.adminEmail}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {editingId !== portfolio.id && isAdmin(portfolio) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(portfolio)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteSharedPortfolio(portfolio.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Members ({portfolio.members.length + 1}/5)
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-yellow-500" />
                          {portfolio.adminEmail} (Admin)
                        </div>
                        {portfolio.members.map((member, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            • {member.email}
                          </div>
                        ))}
                      </div>
                    </div>

                    {isAdmin(portfolio) && canInviteMore(portfolio) && (
                      <div className="pt-2 border-t">
                        {selectedPortfolioId === portfolio.id ? (
                          <div className="space-y-2">
                            <Input
                              placeholder="email1@example.com, email2@example.com"
                              value={additionalInvites}
                              onChange={(e) => setAdditionalInvites(e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleInviteUsers(portfolio.id)}
                                disabled={!additionalInvites.trim()}
                              >
                                Send Invites
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedPortfolioId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPortfolioId(portfolio.id)}
                            className="gap-2"
                          >
                            <Mail size={14} />
                            Invite More Users
                          </Button>
                        )}
                      </div>
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
