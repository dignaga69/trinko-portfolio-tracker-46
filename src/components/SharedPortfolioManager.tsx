
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Plus, Users, Copy, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

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

interface SharedPortfolioManagerProps {
  sharedPortfolios: SharedPortfolio[];
  onCreateSharedPortfolio: (name: string) => void;
  onRenameSharedPortfolio: (id: string, newName: string) => void;
  onDeleteSharedPortfolio: (id: string) => void;
  onInviteUser: (portfolioId: string, email: string) => void;
  onLeavePortfolio: (portfolioId: string) => void;
  currentUserId: string;
}

const SharedPortfolioManager = ({ 
  sharedPortfolios, 
  onCreateSharedPortfolio, 
  onRenameSharedPortfolio, 
  onDeleteSharedPortfolio,
  onInviteUser,
  onLeavePortfolio,
  currentUserId
}: SharedPortfolioManagerProps) => {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitingPortfolioId, setInvitingPortfolioId] = useState<string | null>(null);

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim() && newPortfolioName.length <= 25) {
      onCreateSharedPortfolio(newPortfolioName.trim());
      setNewPortfolioName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleRename = (id: string) => {
    if (editingName.trim() && editingName.length <= 25) {
      onRenameSharedPortfolio(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleInvite = () => {
    if (inviteEmail.trim() && invitingPortfolioId) {
      onInviteUser(invitingPortfolioId, inviteEmail.trim());
      setInviteEmail('');
      setInvitingPortfolioId(null);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const isAdmin = (portfolio: SharedPortfolio) => portfolio.adminId === currentUserId;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Shared Portfolios</h2>
          <p className="text-sm italic text-gray-600 mt-2">
            Collaborate with up to 4 other users on shared trading portfolios.
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
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreatePortfolio}
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
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Your Shared Portfolios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sharedPortfolios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No shared portfolios yet. Create one to start collaborating with other traders.
            </p>
          ) : (
            <div className="space-y-4">
              {sharedPortfolios.map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="p-4 bg-white rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
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
                              onClick={() => handleRename(portfolio.id)}
                              disabled={!editingName.trim()}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {portfolio.name}
                              {isAdmin(portfolio) && (
                                <Badge variant="secondary" className="text-xs">Admin</Badge>
                              )}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Created {portfolio.createdAt.toLocaleDateString()} by {portfolio.adminName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {editingId !== portfolio.id && (
                      <div className="flex gap-2">
                        {isAdmin(portfolio) && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(portfolio.id);
                                setEditingName(portfolio.name);
                              }}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <UserPlus size={14} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Invite User to {portfolio.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                      placeholder="user@example.com"
                                      value={inviteEmail}
                                      onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Invite Code</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        value={portfolio.inviteCode}
                                        readOnly
                                        className="bg-gray-100"
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyInviteCode(portfolio.inviteCode)}
                                      >
                                        <Copy size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      setInvitingPortfolioId(portfolio.id);
                                      handleInvite();
                                    }}
                                    disabled={!inviteEmail.trim() || portfolio.members.length >= 5}
                                    className="w-full"
                                  >
                                    Send Invite
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDeleteSharedPortfolio(portfolio.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                        {!isAdmin(portfolio) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onLeavePortfolio(portfolio.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Leave
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Members ({portfolio.members.length}/5)</Label>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.members.map((member) => (
                        <Badge key={member.id} variant="outline" className="flex items-center gap-1">
                          {member.name}
                          {member.id === portfolio.adminId && (
                            <span className="text-xs text-blue-600">(Admin)</span>
                          )}
                        </Badge>
                      ))}
                    </div>
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
