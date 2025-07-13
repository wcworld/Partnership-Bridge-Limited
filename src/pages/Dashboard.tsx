import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';

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
  deadline_date: string | null;
}

interface UserRole {
  role: string;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
}

const STAGE_NAMES = [
  'Application Submitted',
  'Document Review', 
  'Underwriting',
  'Approval',
  'Funding'
];

const STATUS_COLORS = {
  submitted: 'bg-blue-500',
  document_review: 'bg-yellow-500',
  underwriting: 'bg-orange-500',
  approved: 'bg-green-500',
  funded: 'bg-emerald-500',
  rejected: 'bg-red-500'
};

export default function Dashboard() {
  const { user, loading } = useAuth();
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
        .select('first_name, last_name')
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

  const getStageProgress = (currentStage: number) => (currentStage / 5) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'funded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      case 'document_review':
      case 'underwriting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const ClientDashboard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {profile?.first_name || 'Client'}!
        </h1>
        <p className="text-muted-foreground">Track your loan applications and manage documents</p>
      </div>

      {applications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-4">Start your loan application journey today</p>
            <Button>Start New Application</Button>
          </CardContent>
        </Card>
      ) : (
        applications.map((app) => (
          <Card key={app.id} className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    {app.loan_type} - ${app.loan_amount.toLocaleString()}
                  </CardTitle>
                  <CardDescription>
                    Application #{app.reference_number} • Applied {new Date(app.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={`${STATUS_COLORS[app.status as keyof typeof STATUS_COLORS]} text-white`}>
                  {app.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Application Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Step {app.current_stage} of 5
                  </span>
                </div>
                <Progress value={getStageProgress(app.current_stage)} className="mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {STAGE_NAMES.map((stage, index) => (
                    <span 
                      key={index}
                      className={`${index < app.current_stage ? 'text-primary font-medium' : ''}`}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>

              {app.last_action && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Last Update</p>
                  <p className="text-sm text-muted-foreground">{app.last_action}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {app.last_action_date && new Date(app.last_action_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Docs
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Advisor
                </Button>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">
                  ${applications.reduce((sum, app) => sum + Number(app.loan_amount), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Manage and review loan applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">#{app.reference_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.loan_type} • ${app.loan_amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${STATUS_COLORS[app.status as keyof typeof STATUS_COLORS]} text-white`}>
                    {app.status.replace('_', ' ')}
                  </Badge>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6">
        {userRole === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
      </div>
    </div>
  );
}