import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Building2, Lock, Mail, User, Shield } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await resetPassword(email);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2F4F9F] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-lg border-0 border-4 border-[#2F4F9F] rounded-xl">
          <CardHeader className="text-center space-y-4 pt-8 pb-6">
            <div className="mx-auto w-16 h-16 bg-[#2F4F9F] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground mb-2">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to your FundingBay account to manage your applications
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {!showForgotPassword && activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-input focus:border-[#2F4F9F] rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 border-input focus:border-[#2F4F9F] rounded-md"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="text-left">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#2F4F9F] hover:text-[#253f85] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#2F4F9F] hover:bg-[#253f85] text-white font-medium text-base rounded-md" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-[#2F4F9F] hover:text-[#253f85] font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </span>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-muted-foreground">
                    For demo purposes, use any email and password
                  </p>
                </div>
              </form>
            )}

            {activeTab === 'signup' && (
              <div>
                <div className="text-center mb-6">
                  <CardTitle className="text-2xl font-semibold text-foreground mb-2">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Join FundingBay to get started
                  </CardDescription>
                </div>
                
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        className="h-12 border-input focus:border-[#2F4F9F] rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Smith"
                        className="h-12 border-input focus:border-[#2F4F9F] rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 border-input focus:border-[#2F4F9F] rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className="h-12 border-input focus:border-[#2F4F9F] rounded-md"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#2F4F9F] hover:bg-[#253f85] text-white font-medium text-base rounded-md" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <span className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="text-[#2F4F9F] hover:text-[#253f85] font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </span>
                </div>
              </div>
            )}
              
            {/* Forgot Password Form */}
            {showForgotPassword && (
              <div>
                <div className="text-center mb-6">
                  <CardTitle className="text-2xl font-semibold text-foreground mb-2">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enter your email to receive reset instructions
                  </CardDescription>
                </div>
                
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-input focus:border-[#2F4F9F] rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#2F4F9F] hover:bg-[#253f85] text-white font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full h-12 rounded-md border-[#2F4F9F] text-[#2F4F9F] hover:bg-[#2F4F9F] hover:text-white"
                    disabled={isLoading}
                  >
                    Back to Sign In
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}