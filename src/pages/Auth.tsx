import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';

export default function Auth() {
  const { user, signIn, resetPassword, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white shadow-[var(--shadow-large)]">
        <CardHeader className="text-center space-y-4 pt-8 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your Partnership Bridge account to manage your applications
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {showForgotPassword ? (
            /* Forgot Password Form - Full View */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Reset Password</h3>
                <p className="text-sm text-muted-foreground">Enter your email to receive reset instructions</p>
              </div>
              
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-input focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary-light text-white font-medium text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </form>
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-primary hover:text-primary-light transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Sign In Form */
            <div className="space-y-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-input focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12 border-input focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="text-left">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary-light text-white font-medium text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="text-center">
                <a 
                  href="/signup"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Don't have an account? <span className="text-primary hover:text-primary-light font-medium">Sign up</span>
                </a>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Secure authentication powered by Partnership Bridge
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}