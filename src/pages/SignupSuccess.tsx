import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowRight, Building2 } from 'lucide-react';

export default function SignupSuccess() {
  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-90"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome to Partnership Bridge
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Your account has been successfully created. Check your email to get started.
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Account created successfully</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Email verification sent</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Ready to start your loan application</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Expert support available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Success Message */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
            <p className="text-white/80">Welcome to Partnership Bridge</p>
          </div>

          <Card className="bg-white shadow-[var(--shadow-large)]">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Account Created Successfully!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                We've sent a verification email to your inbox
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Check Your Email</h3>
                    <p className="text-sm text-blue-700">
                      We've sent a verification link to your email address. Click the link to verify your account and complete the setup process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">What's Next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Verify your email address</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Sign in to your account</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Complete your loan application</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Get expert financial guidance</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  asChild
                  className="w-full h-12 bg-primary hover:bg-primary-light text-white font-medium text-base"
                >
                  <Link to="/auth">
                    Sign In to Your Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button 
                  asChild
                  variant="outline"
                  className="w-full h-12 border-input hover:bg-muted"
                >
                  <Link to="/">
                    Back to Home
                  </Link>
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{' '}
                  <Link to="/contact" className="text-primary hover:underline">
                    contact support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}