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
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [userRole, setUserRole] = useState<string>('client');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'applications' | 'profile'>('overview');

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
        { name: 'Photo ID', status: 'missing' as const, document_type: 'photo_id' },
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
      return `Your £${app.loan_amount.toLocaleString()} ${app.loan_type.toLowerCase()} application (Ref: ${app.reference_number}) ${
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Modern Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-card/95 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-xl">
        {/* Title Bar */}
        <div className="p-6 border-b border-border/50">
          <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="p-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 shadow-2xl ring-4 ring-primary/20">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=80&h=80&fit=crop&crop=face" 
                alt="Client Photo ID"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-1">{sampleData.user.name}</h2>
              <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full inline-block">
                {sampleData.user.company || 'Bridge Finance Client'}
              </p>
            </div>
          </div>
        </div>

        <Separator className="mx-6" />

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-3">
            <Button 
              variant={currentView === 'overview' ? 'default' : 'ghost'}
              className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                currentView === 'overview' 
                  ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' 
                  : 'hover:bg-muted/80'
              }`}
              onClick={() => setCurrentView('overview')}
            >
              <FileText className="mr-4 h-5 w-5" />
              <span className={currentView === 'overview' ? 'font-medium' : ''}>Overview</span>
            </Button>
            <Button 
              variant={currentView === 'applications' ? 'default' : 'ghost'}
              className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                currentView === 'applications' 
                  ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' 
                  : 'hover:bg-muted/80'
              }`}
              onClick={() => setCurrentView('applications')}
            >
              <FileText className="mr-4 h-5 w-5" />
              <span className={currentView === 'applications' ? 'font-medium' : ''}>Applications</span>
            </Button>
            <Button 
              variant={currentView === 'profile' ? 'default' : 'ghost'}
              className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                currentView === 'profile' 
                  ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' 
                  : 'hover:bg-muted/80'
              }`}
              onClick={() => setCurrentView('profile')}
            >
              <UserCheck className="mr-4 h-5 w-5" />
              <span className={currentView === 'profile' ? 'font-medium' : ''}>Profile</span>
            </Button>
          </div>
        </nav>

        <Separator className="mx-6" />

        {/* Enhanced Logout */}
        <div className="p-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="mr-4 h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Content with left margin for fixed sidebar */}
      <div className="ml-80">
        {/* Title Bar for Main Content */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-6">
          <h1 className="text-2xl font-bold text-foreground">
            {currentView === 'overview' && 'Dashboard Overview'}
            {currentView === 'applications' && 'My Applications'}
            {currentView === 'profile' && 'Profile Settings'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentView === 'overview' && 'Here\'s an overview of your loan applications and account activity.'}
            {currentView === 'applications' && 'Manage and track your loan applications.'}
            {currentView === 'profile' && 'Update your personal and business information.'}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {currentView === 'overview' && (
            <>
              {/* Welcome Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {sampleData.user.name.split(' ')[0] || 'User'}
                </h2>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        Active
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{applications.length}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Applications</div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-500/10 rounded-xl">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-0">
                        Approved
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">
                      £{approvedAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Approved Amount</div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-500/10 rounded-xl">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 border-0">
                        Pending
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{pendingCount}</div>
                    <div className="text-sm text-muted-foreground font-medium">Pending Review</div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-500/10 rounded-xl">
                        <X className="h-6 w-6 text-red-600" />
                      </div>
                      <Badge variant="secondary" className="bg-red-500/10 text-red-700 border-0">
                        Rejected
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{rejectedCount}</div>
                    <div className="text-sm text-muted-foreground font-medium">Rejected Applications</div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Recent Activity */}
              <Card className="mb-10 border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      Recent Activity
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="hover:bg-muted/80">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-200">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                          activity.type === 'error' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                          activity.type === 'warning' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{activity.title}</h4>
                          <p className="text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-2 font-medium">{activity.time}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${
                            activity.type === 'success' ? 'border-green-200 text-green-700 bg-green-50' :
                            activity.type === 'error' ? 'border-red-200 text-red-700 bg-red-50' :
                            activity.type === 'warning' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                            'border-blue-200 text-blue-700 bg-blue-50'
                          }`}
                        >
                          {activity.type === 'success' ? 'Completed' : 
                           activity.type === 'error' ? 'Rejected' :
                           activity.type === 'warning' ? 'In Review' : 'Processing'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Components Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="transform hover:scale-[1.02] transition-transform duration-200">
                    <ProgressStepper 
                      steps={sampleData.application.steps}
                      currentStep={sampleData.application.currentStep}
                    />
                  </div>
                  <div className="transform hover:scale-[1.02] transition-transform duration-200">
                    <ActionItems actionItems={sampleData.application.actionItems} />
                  </div>
                </div>
                
                <div className="transform hover:scale-[1.02] transition-transform duration-200">
                  {applications[0]?.id ? (
                    <DocumentUploader 
                      documents={documents} 
                      loanId={applications[0].id}
                      onDocumentUploaded={() => {
                        fetchApplications();
                        fetchDocuments();
                      }}
                    />
                  ) : (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
                      <CardContent className="p-12 text-center">
                        <div className="p-4 bg-muted/50 rounded-2xl w-fit mx-auto mb-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No Applications Yet</h3>
                        <p className="text-muted-foreground mb-6">Start your loan application to see document requirements.</p>
                        <StartApplicationModal onApplicationCreated={fetchApplications} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
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
                      />
                      
                      <ActionItems 
                        actionItems={sampleData.application.actionItems}
                      />
                      
                      <DocumentUploader 
                        documents={documents}
                        loanId={application.id}
                        onDocumentUploaded={fetchDocuments}
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