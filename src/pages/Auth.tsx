
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !fullName)) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);
    try {
      if (isLogin) {
        const result = await signIn(email, password, false);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been successfully signed in.",
          });
        }
      } else {
        const result = await signUp(email, password, fullName);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to Trinko. You've been automatically signed in.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-full max-w-md space-y-4">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-6">TRINKO</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 justify-center">
            <Label htmlFor="auth-mode" className={isLogin ? "font-medium" : "text-gray-500"}>
              Sign In
            </Label>
            <Switch
              id="auth-mode"
              checked={!isLogin}
              onCheckedChange={(checked) => setIsLogin(!checked)}
            />
            <Label htmlFor="auth-mode" className={!isLogin ? "font-medium" : "text-gray-500"}>
              Register
            </Label>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleAuth} 
              className="w-full text-sm bg-orange-500 hover:bg-orange-600 text-white" 
              disabled={authLoading}
            >
              {authLoading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
