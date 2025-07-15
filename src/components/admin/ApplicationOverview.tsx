import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, DollarSign, Calendar, Edit, Eye } from 'lucide-react';
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
  }, []);

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
          .select('user_id, first_name, last_name, company_name')
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
            company_name: null
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'funded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'document_review':
      case 'underwriting':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

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
                  
                  <Badge className={getStatusColor(application.status)}>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    
                    <Select
                      onValueChange={(value) => updateApplicationStatus(application.id, value)}
                    >
                      <SelectTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Update Status
                        </Button>
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