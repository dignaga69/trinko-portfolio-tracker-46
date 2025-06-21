import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Validation functions
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 6;

  const isSignInValid = () => {
    return isValidEmail(signInEmail) && isValidPassword(signInPassword);
  };

  const isRegisterValid = () => {
    return (
      fullName.trim().length >= 2 &&
      isValidEmail(registerEmail) &&
      isValidPassword(registerPassword) &&
      registerPassword === confirmPassword &&
      acceptTerms
    );
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInValid()) return;

    setSignInLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      toast({
        title: "Welcome Back!",
        description: "Successfully signed in to your account.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setSignInLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegisterValid()) return;

    setRegisterLoading(true);
    try {
      await signUp(registerEmail, registerPassword, { full_name: fullName });
      toast({
        title: "Account Created!",
        description: "Welcome to your trading journal. You've been automatically signed in.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black tracking-tight">
            TRINKO
          </CardTitle>
          <CardDescription>Your personal trading journal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    aria-describedby="signin-email-error"
                    className={!isValidEmail(signInEmail) && signInEmail ? 'border-red-500' : ''}
                  />
                  {!isValidEmail(signInEmail) && signInEmail && (
                    <p id="signin-email-error" className="text-sm text-red-500">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      aria-describedby="signin-password-error"
                      className={!isValidPassword(signInPassword) && signInPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {!isValidPassword(signInPassword) && signInPassword && (
                    <p id="signin-password-error" className="text-sm text-red-500">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                </div>

                <div className="text-right">
                  <button type="button" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isSignInValid() || signInLoading}
                  aria-describedby="signin-submit-status"
                >
                  {signInLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    aria-describedby="full-name-error"
                    className={fullName.trim().length < 2 && fullName ? 'border-red-500' : ''}
                  />
                  {fullName.trim().length < 2 && fullName && (
                    <p id="full-name-error" className="text-sm text-red-500">
                      Full name must be at least 2 characters long
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    aria-describedby="register-email-error"
                    className={!isValidEmail(registerEmail) && registerEmail ? 'border-red-500' : ''}
                  />
                  {!isValidEmail(registerEmail) && registerEmail && (
                    <p id="register-email-error" className="text-sm text-red-500">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      aria-describedby="register-password-error"
                      className={!isValidPassword(registerPassword) && registerPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {!isValidPassword(registerPassword) && registerPassword && (
                    <p id="register-password-error" className="text-sm text-red-500">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      aria-describedby="confirm-password-error"
                      className={registerPassword !== confirmPassword && confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {registerPassword !== confirmPassword && confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="accept-terms" className="text-sm">
                    I accept the{' '}
                    <button type="button" className="text-blue-600 hover:underline">
                      Terms of Service
                    </button>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isRegisterValid() || registerLoading}
                  aria-describedby="register-submit-status"
                >
                  {registerLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
