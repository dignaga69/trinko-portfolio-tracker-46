import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [signInErrors, setSignInErrors] = useState<{ [key: string]: string }>({});
  const [signInLoading, setSignInLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [signUpErrors, setSignUpErrors] = useState<{ [key: string]: string }>({});
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateSignInForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!signInForm.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(signInForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!signInForm.password) {
      errors.password = 'Password is required';
    }
    
    setSignInErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!signUpForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!signUpForm.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(signUpForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!signUpForm.password) {
      errors.password = 'Password is required';
    } else if (signUpForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signUpForm.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms of service';
    }
    
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignInForm()) return;
    
    setSignInLoading(true);
    const { error } = await signIn(signInForm.email, signInForm.password, signInForm.rememberMe);
    
    if (error) {
      setSignInErrors({ general: error });
    }
    
    setSignInLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) return;
    
    setSignUpLoading(true);
    const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName);
    
    if (error) {
      setSignUpErrors({ general: error });
    }
    
    setSignUpLoading(false);
  };

  const isSignInFormValid = signInForm.email && signInForm.password && validateEmail(signInForm.email);
  const isSignUpFormValid = signUpForm.fullName.trim() && 
    signUpForm.email && 
    signUpForm.password && 
    signUpForm.confirmPassword && 
    signUpForm.agreeToTerms && 
    validateEmail(signUpForm.email) && 
    signUpForm.password.length >= 6 && 
    signUpForm.password === signUpForm.confirmPassword;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8" style={{ fontFamily: 'Monaco, monospace' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">TRINKO</h1>
          <p className="text-gray-600">Welcome Back!</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              {signInErrors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {signInErrors.general}
                </div>
              )}
              
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={signInForm.email}
                  onChange={(e) => {
                    setSignInForm(prev => ({ ...prev, email: e.target.value }));
                    if (signInErrors.email) setSignInErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={cn(
                    "h-12 bg-gray-50 border-gray-200 rounded-lg px-4",
                    signInErrors.email && "border-red-300 bg-red-50"
                  )}
                  aria-label="Email address"
                />
                {signInErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{signInErrors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Input
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signInForm.password}
                    onChange={(e) => {
                      setSignInForm(prev => ({ ...prev, password: e.target.value }));
                      if (signInErrors.password) setSignInErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={cn(
                      "h-12 bg-gray-50 border-gray-200 rounded-lg px-4 pr-12",
                      signInErrors.password && "border-red-300 bg-red-50"
                    )}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showSignInPassword ? "Hide password" : "Show password"}
                  >
                    {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signInErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{signInErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={signInForm.rememberMe}
                    onCheckedChange={(checked) => 
                      setSignInForm(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm text-orange-500 hover:text-orange-600">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={!isSignInFormValid || signInLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-base disabled:opacity-50"
              >
                {signInLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              {signUpErrors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {signUpErrors.general}
                </div>
              )}
              
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={signUpForm.fullName}
                  onChange={(e) => {
                    setSignUpForm(prev => ({ ...prev, fullName: e.target.value }));
                    if (signUpErrors.fullName) setSignUpErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  className={cn(
                    "h-12 bg-gray-50 border-gray-200 rounded-lg px-4",
                    signUpErrors.fullName && "border-red-300 bg-red-50"
                  )}
                  aria-label="Full name"
                />
                {signUpErrors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{signUpErrors.fullName}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={signUpForm.email}
                  onChange={(e) => {
                    setSignUpForm(prev => ({ ...prev, email: e.target.value }));
                    if (signUpErrors.email) setSignUpErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={cn(
                    "h-12 bg-gray-50 border-gray-200 rounded-lg px-4",
                    signUpErrors.email && "border-red-300 bg-red-50"
                  )}
                  aria-label="Email address"
                />
                {signUpErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{signUpErrors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Input
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signUpForm.password}
                    onChange={(e) => {
                      setSignUpForm(prev => ({ ...prev, password: e.target.value }));
                      if (signUpErrors.password) setSignUpErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={cn(
                      "h-12 bg-gray-50 border-gray-200 rounded-lg px-4 pr-12",
                      signUpErrors.password && "border-red-300 bg-red-50"
                    )}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                  >
                    {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signUpErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{signUpErrors.password}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={signUpForm.confirmPassword}
                  onChange={(e) => {
                    setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                    if (signUpErrors.confirmPassword) setSignUpErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={cn(
                    "h-12 bg-gray-50 border-gray-200 rounded-lg px-4",
                    signUpErrors.confirmPassword && "border-red-300 bg-red-50"
                  )}
                  aria-label="Confirm password"
                />
                {signUpErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{signUpErrors.confirmPassword}</p>
                )}
              </div>

              <div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={signUpForm.agreeToTerms}
                    onCheckedChange={(checked) => {
                      setSignUpForm(prev => ({ ...prev, agreeToTerms: checked as boolean }));
                      if (signUpErrors.agreeToTerms) setSignUpErrors(prev => ({ ...prev, agreeToTerms: '' }));
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <button type="button" className="text-orange-500 hover:text-orange-600 underline">
                      Terms of Service
                    </button>
                  </label>
                </div>
                {signUpErrors.agreeToTerms && (
                  <p className="text-sm text-red-600 mt-1">{signUpErrors.agreeToTerms}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isSignUpFormValid || signUpLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-base disabled:opacity-50"
              >
                {signUpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
