import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  FileText, 
  UserCheck, 
  LogOut,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { ProgressStepper } from './ProgressStepper';
import { ActionItems } from './ActionItems';
import { DocumentUploader } from './DocumentUploader';

interface LoanApplication {
  id: string;
  reference_number: string;
  loan_type: string;
  loan_amount: number;
  status: string;
  current_stage: number;
  created_at: string;
  last_action: string | null;
  last_action_date: string | null;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
}

interface UserRole {
  role: string;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [userRole, setUserRole] = useState<string>('client');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchApplications();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
      
      if (roleData) setUserRole(roleData.role);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, company_name')
        .eq('user_id', user?.id)
        .single();
      
      if (profileData) setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('loan_applications').select('*');
      
      if (userRole === 'client') {
        query = query.eq('user_id', user?.id);
      }
      
      const { data } = await query.order('created_at', { ascending: false });
      
      if (data) setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  // Sample data for the components
  const sampleData = {
    user: { 
      name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
      company: profile?.company_name || ''
    },
    application: {
      steps: ['Application', 'Documents', 'Review', 'Offers', 'Closing'],
      currentStep: applications[0]?.current_stage || 1,
      actionItems: [
        { id: 1, text: 'Upload your latest pay stub' },
        { id: 2, text: 'Sign the Tax Return Authorization form' },
        { id: 3, text: 'Complete credit authorization' }
      ],
      documents: [
        { name: 'Photo ID', status: 'Approved' as const, document_type: 'photo_id' },
        { name: 'Latest Pay Stub', status: 'Requested' as const, document_type: 'pay_stub' },
        { name: 'Tax Return (2023)', status: 'Uploaded' as const, document_type: 'tax_return' },
        { name: 'Bank Statements', status: 'Requested' as const, document_type: 'bank_statements' }
      ]
    }
  };

  const approvedAmount = applications
    .filter(app => app.status === 'approved' || app.status === 'funded')
    .reduce((sum, app) => sum + app.loan_amount, 0);

  const pendingCount = applications.filter(app => 
    app.status === 'submitted' || 
    app.status === 'document_review' || 
    app.status === 'underwriting'
  ).length;

  const recentActivities = [
    {
      id: 1,
      title: 'Asset Finance Application Approved',
      description: `Your £${approvedAmount.toLocaleString()} asset finance application has been approved`,
      time: '2 days ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Business Loan Under Review',
      description: 'Your £50,000 business loan application is being reviewed',
      time: '5 days ago',
      type: 'warning'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* User Profile Section */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">{sampleData.user.name}</h2>
          <p className="text-sm text-muted-foreground">{sampleData.user.company}</p>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Button 
                variant="default" 
                className="w-full justify-start"
              >
                <FileText className="mr-3 h-4 w-4" />
                Overview
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground"
              >
                <FileText className="mr-3 h-4 w-4" />
                Applications
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground"
              >
                <UserCheck className="mr-3 h-4 w-4" />
                Profile
              </Button>
            </li>
          </ul>
        </nav>

        <Separator />

        {/* Logout */}
        <div className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{applications.length}</div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  £{approvedAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Approved Amount</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`w-1 h-12 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Components Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProgressStepper 
              steps={sampleData.application.steps}
              currentStep={sampleData.application.currentStep}
            />
            <ActionItems actionItems={sampleData.application.actionItems} />
          </div>
          
          <div>
            <DocumentUploader 
              documents={sampleData.application.documents} 
              loanId={applications[0]?.id || 'sample-loan-id'}
              onDocumentUploaded={fetchApplications}
            />
          </div>
        </div>
      </div>
    </div>
  );
}