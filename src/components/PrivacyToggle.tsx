
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface PrivacyToggleProps {
  isPrivate: boolean;
  onToggle: (isPrivate: boolean) => void;
}

const PrivacyToggle = ({ isPrivate, onToggle }: PrivacyToggleProps) => {
  return (
    <Card className="border-0 shadow-none bg-gray-50 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="privacy-toggle" className="text-base font-medium">
              Private Performance
            </Label>
            <p className="text-sm text-gray-600">
              {isPrivate 
                ? "Your performance is private. Others cannot view your stats, but you also cannot view the leaderboard."
                : "Your performance is public. Others can view your stats, and you can view the leaderboard."
              }
            </p>
          </div>
          <Switch
            id="privacy-toggle"
            checked={isPrivate}
            onCheckedChange={onToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyToggle;
