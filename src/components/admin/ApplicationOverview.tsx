import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, DollarSign, Calendar, Edit, Eye, User, Building, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoanApplication {
  id: string;
  reference_number: string;
  loan_type: string;
  loan_amount: number;
  status: string;
  current_stage: number;
  created_at: string;
  user_id: string;
}

interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
}

interface ApplicationWithProfile extends LoanApplication {
  profile: Profile;
}

export function ApplicationOverview() {
  const [applications, setApplications] = useState<ApplicationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('Fetching applications with filter:', statusFilter);
      
      let query = supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data: applications, error: appError } = await query;
      console.log('Applications fetched:', applications?.length, 'Error:', appError);

      if (appError) {
        console.error('Error fetching applications:', appError);
        return;
      }

      if (applications && applications.length > 0) {
        // Fetch profiles for each application
        const userIds = [...new Set(applications.map(app => app.user_id))];
        console.log('Fetching profiles for user IDs:', userIds);
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, company_name, email, phone')
          .in('user_id', userIds);

        console.log('Profiles fetched:', profiles?.length, 'Error:', profileError);

        const profileMap = new Map(
          profiles?.map(profile => [profile.user_id, profile]) || []
        );

        const applicationsWithProfiles = applications.map(app => ({
          ...app,
          profile: profileMap.get(app.user_id) || {
            user_id: app.user_id,
            first_name: null,
            last_name: null,
            company_name: null,
            email: null,
            phone: null
          }
        }));

        console.log('Final applications with profiles:', applicationsWithProfiles.length);
        setApplications(applicationsWithProfiles);
      } else {
        console.log('No applications found');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ 
          status: newStatus,
          last_action: `Status updated to ${newStatus}`,
          last_action_date: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated successfully",
      });

      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'funded':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'document_review':
      case 'underwriting':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const ApplicationDetailsModal = ({ application }: { application: ApplicationWithProfile }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Application Details - {application.reference_number}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium">
                {application.profile.first_name} {application.profile.last_name}
              </p>
            </div>
            {application.profile.company_name && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p className="font-medium flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {application.profile.company_name}
                </p>
              </div>
            )}
            {application.profile.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {application.profile.email}
                </p>
              </div>
            )}
            {application.profile.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {application.profile.phone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Application Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Application Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reference Number</label>
              <p className="font-mono font-medium">{application.reference_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Loan Type</label>
              <p className="font-medium">{application.loan_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Loan Amount</label>
              <p className="font-medium text-lg">£{application.loan_amount.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(application.status) as any}>
                  {formatStatus(application.status)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Application Stage</label>
              <p className="font-medium">Stage {application.current_stage} of 5</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Application Date</label>
              <p className="font-medium">
                {new Date(application.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline/Progress */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Application Timeline</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Application Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(application.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {application.current_stage > 1 && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Initial Review Completed</p>
                </div>
              </div>
            )}
            {application.current_stage > 2 && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Documents Under Review</p>
                </div>
              </div>
            )}
            {application.current_stage > 3 && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Underwriting Assessment</p>
                </div>
              </div>
            )}
            {application.current_stage > 4 && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Final Approval</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Loan Applications ({applications.length})
          </CardTitle>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="document_review">Document Review</SelectItem>
              <SelectItem value="underwriting">Underwriting</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="funded">Funded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No applications found
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">
                      {application.profile.first_name} {application.profile.last_name}
                    </h3>
                    {application.profile.company_name && (
                      <p className="text-sm text-muted-foreground">
                        {application.profile.company_name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono">
                      Ref: {application.reference_number}
                    </p>
                  </div>
                  
                  <Badge variant={getStatusVariant(application.status) as any}>
                    {formatStatus(application.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{application.loan_type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">£{application.loan_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Stage {application.current_stage} of 5
                  </div>
                  
                   <div className="flex gap-2">
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-blue-600 border-blue-200 hover:bg-blue-50"
                         >
                           <Eye className="h-4 w-4 mr-1" />
                           View Details
                         </Button>
                       </DialogTrigger>
                       <ApplicationDetailsModal application={application} />
                     </Dialog>
                    
                    <Select
                      onValueChange={(value) => updateApplicationStatus(application.id, value)}
                    >
                      <SelectTrigger className="w-auto">
                        <Edit className="h-4 w-4 mr-1" />
                        Update Status
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="document_review">Document Review</SelectItem>
                        <SelectItem value="underwriting">Underwriting</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="funded">Funded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}