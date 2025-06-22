
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Portfolio {
  id: string;
  name: string;
  createdAt: Date;
}

interface PortfolioManagerProps {
  portfolios: Portfolio[];
  onCreatePortfolio: (name: string) => void;
  onRenamePortfolio: (id: string, newName: string) => void;
  onDeletePortfolio: (id: string) => void;
}

const PortfolioManager = ({ 
  portfolios, 
  onCreatePortfolio, 
  onRenamePortfolio, 
  onDeletePortfolio 
}: PortfolioManagerProps) => {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim() && newPortfolioName.length <= 25) {
      onCreatePortfolio(newPortfolioName.trim());
      setNewPortfolioName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleRenamePortfolio = (id: string) => {
    if (editingName.trim() && editingName.length <= 25) {
      onRenamePortfolio(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const startEditing = (portfolio: Portfolio) => {
    setEditingId(portfolio.id);
    setEditingName(portfolio.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm italic text-gray-600 mt-2">
            Create and manage your trading portfolios. Portfolio names cannot exceed 25 characters.
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
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
          <CardTitle className="text-lg font-semibold">Your Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No portfolios created yet. Create your first portfolio to start organizing your trades.
            </p>
          ) : (
            <div className="space-y-3">
              {portfolios.map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="flex items-center justify-between p-4 bg-white rounded-lg border"
                >
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
                        <h3 className="font-medium">{portfolio.name}</h3>
                        <p className="text-xs text-gray-500">
                          Created {portfolio.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {editingId !== portfolio.id && (
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
                        onClick={() => onDeletePortfolio(portfolio.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioManager;
