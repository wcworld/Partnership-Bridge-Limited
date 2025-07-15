import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, FileText, DollarSign, Clock, User } from 'lucide-react';

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
  user_id: string;
}

interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
}

interface ActivityWithProfile extends LoanApplication {
  profile: Profile;
}

export function ClientActivities() {
  const [activities, setActivities] = useState<ActivityWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientActivities();
  }, []);

  const fetchClientActivities = async () => {
    try {
      setLoading(true);
      
      console.log('=== ClientActivities: Starting fetch ===');
      
      // Fetch applications with profile information
      const { data: applications } = await supabase
        .from('loan_applications')
        .select(`
          *
        `)
        .order('last_action_date', { ascending: false, nullsFirst: false })
        .limit(50);

      console.log('=== ClientActivities raw data ===', applications);

      if (applications) {
        // Fetch profiles for each application
        const userIds = [...new Set(applications.map(app => app.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, company_name')
          .in('user_id', userIds);

        const profileMap = new Map(
          profiles?.map(profile => [profile.user_id, profile]) || []
        );

        const activitiesWithProfiles = applications.map(app => ({
          ...app,
          profile: profileMap.get(app.user_id) || {
            user_id: app.user_id,
            first_name: null,
            last_name: null,
            company_name: null
          }
        }));

        setActivities(activitiesWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching client activities:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Activities</CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Client Activities ({activities.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activities found
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                <Avatar>
                  <AvatarFallback>
                    {activity.profile.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {activity.profile.first_name} {activity.profile.last_name}
                      </span>
                      {activity.profile.company_name && (
                        <span className="text-sm text-muted-foreground">
                          ({activity.profile.company_name})
                        </span>
                      )}
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {formatStatus(activity.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{activity.loan_type}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${activity.loan_amount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Ref:</span>
                      <span className="font-mono text-xs">{activity.reference_number}</span>
                    </div>
                  </div>
                  
                  {activity.last_action && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Last Action:</strong> {activity.last_action}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {activity.last_action_date 
                        ? `Updated ${new Date(activity.last_action_date).toLocaleDateString()}`
                        : `Created ${new Date(activity.created_at).toLocaleDateString()}`
                      }
                    </span>
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