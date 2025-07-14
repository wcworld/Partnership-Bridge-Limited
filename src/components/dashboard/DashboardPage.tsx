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
import { ApplicationSection } from './ApplicationSection';
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

  const fetchProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, company_name, email, phone')
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
          // Transform documents to match the expected format
          const formattedDocuments = documentsData.map(doc => ({
            name: doc.document_name,
            status: doc.status === 'missing' ? 'Requested' as const : 
                   doc.status === 'uploaded' ? 'Uploaded' as const :
                   doc.status === 'approved' ? 'Approved' as const : 'Requested' as const,
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
        { name: 'Photo ID', status: 'Requested' as const, document_type: 'photo_id' },
        { name: 'Bank Statements', status: 'Approved' as const, document_type: 'bank_statement' },
        { name: 'Tax Returns', status: 'Uploaded' as const, document_type: 'tax_return' },
        { name: 'Pay Stubs', status: 'Requested' as const, document_type: 'pay_stub' },
        { name: 'Financial Statement', status: 'Requested' as const, document_type: 'financial_statement' }
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
                            activity.type === 'warning' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                            'border-blue-200 text-blue-700 bg-blue-50'
                          }`}
                        >
                          {activity.type === 'success' ? 'Completed' : activity.type === 'warning' ? 'In Review' : 'Processing'}
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
                      documents={documents.length > 0 ? documents : sampleData.application.documents} 
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
            <div className="max-w-4xl">
              <ApplicationSection 
                application={applications[0]}
                onSave={(data) => {
                  console.log('Application data saved:', data);
                  // Handle application update
                }}
              />
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