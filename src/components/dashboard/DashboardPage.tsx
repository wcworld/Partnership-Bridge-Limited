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
  Clock,
  X
} from 'lucide-react';
import { ProgressStepper } from './ProgressStepper';
import { ActionItems } from './ActionItems';
import { DocumentUploader } from './DocumentUploader';
import { ApplicationDetails } from './ApplicationDetails';
import { ProfileSection } from './ProfileSection';
import { StartApplicationModal } from './StartApplicationModal';
import { useIsMobile } from '@/hooks/use-mobile';

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
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface UserRole {
  role: string;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [userRole, setUserRole] = useState<string>('client');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'applications' | 'profile'>('overview');
  const [documentProgress, setDocumentProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    if (applications.length > 0) {
      fetchDocuments();
    }
  }, [applications]);

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
        .select('first_name, last_name, company_name, email, phone, avatar_url')
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
      console.log('Fetching applications for user:', user?.id, 'Role:', userRole);
      
      // Always filter by user_id for client dashboard - don't rely on userRole state
      const { data } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      console.log('Applications fetched:', data);
      if (data) setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, company_name, email, phone, avatar_url')
        .eq('user_id', user?.id)
        .single();
      
      if (profileData) setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      if (applications[0]?.id) {
        const { data: documentsData } = await supabase
          .from('loan_documents')
          .select('*')
          .eq('loan_id', applications[0].id);
        
        if (documentsData) {
          // Transform documents to match the expected format - use database status values directly
          const formattedDocuments = documentsData.map(doc => ({
            name: doc.document_name,
            status: doc.status as 'missing' | 'processing' | 'approved' | 'reupload_needed',
            document_type: doc.document_type
          }));
          setDocuments(formattedDocuments);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
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
        { name: 'Valid Form of Identification (Passport or National ID)', status: 'missing' as const, document_type: 'identification' },
        { name: 'Company Registration/Incorporation Documents', status: 'missing' as const, document_type: 'company_registration' },
        { name: 'Proof of Business Address', status: 'missing' as const, document_type: 'business_address' },
        { name: 'Detailed Business Services and Business Plan', status: 'missing' as const, document_type: 'business_plan' },
        { name: 'Detailed Use of Funds Breakdown', status: 'missing' as const, document_type: 'use_of_funds' },
        { name: '3-Year Financial Projections', status: 'missing' as const, document_type: 'financial_projections' },
        { name: 'Relevant Business Licenses or Permits', status: 'missing' as const, document_type: 'business_licenses' }
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

  const rejectedCount = applications.filter(app => 
    app.status === 'rejected'
  ).length;

  const recentActivities = applications.map(app => {
    const getActivityType = (status: string) => {
      switch (status) {
        case 'approved':
        case 'funded':
          return 'success';
        case 'rejected':
          return 'error';
        case 'submitted':
        case 'document_review':
        case 'underwriting':
          return 'warning';
        default:
          return 'info';
      }
    };

    const getActivityTitle = (app: LoanApplication) => {
      if (app.last_action) {
        return app.last_action;
      }
      return `${app.loan_type} Application ${app.status === 'approved' ? 'Approved' : 
             app.status === 'rejected' ? 'Rejected' : 
             app.status === 'funded' ? 'Funded' : 'Submitted'}`;
    };

    const getActivityDescription = (app: LoanApplication) => {
      return `Your $${app.loan_amount.toLocaleString()} ${app.loan_type.toLowerCase()} application (Ref: ${app.reference_number}) ${
        app.status === 'approved' ? 'has been approved' :
        app.status === 'rejected' ? 'has been rejected' :
        app.status === 'funded' ? 'has been funded' :
        app.status === 'submitted' ? 'has been submitted' :
        'is under review'
      }`;
    };

    const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      return `${Math.floor(diffInDays / 30)} months ago`;
    };

    return {
      id: app.id,
      title: getActivityTitle(app),
      description: getActivityDescription(app),
      time: getTimeAgo(app.last_action_date || app.created_at),
      type: getActivityType(app.status)
    };
  }).slice(0, 5); // Show only the 5 most recent activities

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-card border-r border-border shadow-sm">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=48&h=48&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{sampleData.user.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {sampleData.user.company || 'Bridge Finance Client'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              <Button 
                variant={currentView === 'overview' ? 'secondary' : 'ghost'}
                className="w-full justify-start h-10"
                onClick={() => setCurrentView('overview')}
              >
                <FileText className="mr-3 h-4 w-4" />
                Overview
              </Button>
              <Button 
                variant={currentView === 'applications' ? 'secondary' : 'ghost'}
                className="w-full justify-start h-10"
                onClick={() => setCurrentView('applications')}
              >
                <FileText className="mr-3 h-4 w-4" />
                Applications
              </Button>
              <Button 
                variant={currentView === 'profile' ? 'secondary' : 'ghost'}
                className="w-full justify-start h-10"
                onClick={() => setCurrentView('profile')}
              >
                <User className="mr-3 h-4 w-4" />
                Profile
              </Button>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-10 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary-foreground" />
            </div>
            <h1 className="font-semibold">Dashboard</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mobile Tabs */}
        <div className="flex border-t border-border">
          <Button 
            variant="ghost"
            size="sm"
            className={`flex-1 rounded-none h-12 ${
              currentView === 'overview' ? 'border-b-2 border-primary bg-primary/5' : ''
            }`}
            onClick={() => setCurrentView('overview')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className={`flex-1 rounded-none h-12 ${
              currentView === 'applications' ? 'border-b-2 border-primary bg-primary/5' : ''
            }`}
            onClick={() => setCurrentView('applications')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Applications
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className={`flex-1 rounded-none h-12 ${
              currentView === 'profile' ? 'border-b-2 border-primary bg-primary/5' : ''
            }`}
            onClick={() => setCurrentView('profile')}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Content Area */}
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {currentView === 'overview' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Welcome back, {sampleData.user.name.split(' ')[0] || 'User'}
                </h1>
                <p className="text-muted-foreground">
                  Here's an overview of your loan applications and account activity.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                        <p className="text-xl font-semibold">{applications.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Approved Amount</p>
                        <p className="text-xl font-semibold">${approvedAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                        <p className="text-xl font-semibold">{pendingCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Rejected</p>
                        <p className="text-xl font-semibold">{rejectedCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentView('applications')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-500' : 
                          activity.type === 'error' ? 'bg-red-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-sm text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Application Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ProgressStepper 
                    steps={sampleData.application.steps}
                    currentStep={sampleData.application.currentStep}
                    documentProgress={documentProgress}
                    applicationStatus={applications[0]?.status}
                  />
                  <ActionItems 
                    userId={user.id}
                    applications={applications}
                    profile={profile}
                    onActionClick={(actionType, data) => {
                      if (actionType === 'profile') {
                        setCurrentView('profile');
                      } else if (actionType === 'documents' || actionType === 'application') {
                        setCurrentView('applications');
                      }
                    }}
                  />
                </div>
                
                <div>
                  {applications[0]?.id ? (
                     <DocumentUploader 
                       documents={documents} 
                       loanId={applications[0].id}
                       onDocumentUploaded={() => {
                         fetchApplications();
                         fetchDocuments();
                       }}
                       onProgressUpdate={setDocumentProgress}
                     />
                  ) : (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-8 text-center">
                        <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">No Applications Yet</h3>
                        <p className="text-muted-foreground text-sm mb-4">Start your loan application to see document requirements.</p>
                        <StartApplicationModal onApplicationCreated={fetchApplications} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'applications' && (
            <div className="space-y-8">
              {applications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-muted rounded-2xl mx-auto flex items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No applications yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ready to secure funding for your business? Start your first application today.
                  </p>
                  <StartApplicationModal onApplicationCreated={fetchApplications} />
                </div>
              ) : (
                <>
                  {applications.map((application) => (
                    <div key={application.id} className="space-y-8">
                      <ApplicationDetails 
                        application={application}
                        profile={profile}
                        onSave={(data) => {
                          console.log('Saving application data:', data);
                          // Handle save logic here
                        }}
                        isEditable={true}
                        isAdminView={false}
                      />
                      
                      <ProgressStepper 
                        steps={sampleData.application.steps}
                        currentStep={application.current_stage}
                        documentProgress={documentProgress}
                        applicationStatus={application.status}
                      />
                      
                      <ActionItems 
                        userId={user.id}
                        applications={[application]}
                        profile={profile}
                        onActionClick={(actionType, data) => {
                          if (actionType === 'profile') {
                            setCurrentView('profile');
                          }
                        }}
                      />
                      
                       <DocumentUploader 
                         documents={documents}
                         loanId={application.id}
                         onDocumentUploaded={fetchDocuments}
                         onProgressUpdate={setDocumentProgress}
                       />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {currentView === 'profile' && (
            <div className="max-w-4xl">
              <ProfileSection 
                profile={profile}
                onUpdate={fetchProfile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}