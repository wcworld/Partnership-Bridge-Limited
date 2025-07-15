import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Filter, 
  Clock, 
  User, 
  FileText, 
  Upload, 
  Edit, 
  LogIn, 
  LogOut,
  Calendar
} from 'lucide-react';

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

export function UserActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, actionFilter, timeFilter]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch applications
      const { data: applications } = await supabase
        .from('loan_applications')
        .select('id, user_id, status, created_at, updated_at, last_action, last_action_date')
        .order('updated_at', { ascending: false })
        .limit(100);

      // Fetch documents  
      const { data: documents } = await supabase
        .from('loan_documents')
        .select('id, loan_id, document_name, uploaded_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(50);

      // Get unique user IDs from both applications and documents
      const userIds = new Set<string>();
      applications?.forEach(app => userIds.add(app.user_id));
      
      // Get user IDs from documents via loan applications
      if (documents?.length) {
        const loanIds = documents.map(doc => doc.loan_id);
        const { data: loans } = await supabase
          .from('loan_applications')
          .select('id, user_id')
          .in('id', loanIds);
        loans?.forEach(loan => userIds.add(loan.user_id));
      }

      // Fetch profiles for all user IDs
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, avatar_url')
        .in('user_id', Array.from(userIds));

      // Create profile map
      const profileMap = new Map(
        profiles?.map(profile => [profile.user_id, profile]) || []
      );

      // Convert to activity logs
      const activityLogs: ActivityLog[] = [];

      // Application activities
      applications?.forEach(app => {
        const profile = profileMap.get(app.user_id);
        if (profile) {
          activityLogs.push({
            id: `app-${app.id}`,
            user_id: app.user_id,
            action: 'application_created',
            description: `Created loan application`,
            timestamp: app.created_at,
            profile: profile
          });

          if (app.last_action && app.last_action_date) {
            activityLogs.push({
              id: `app-update-${app.id}`,
              user_id: app.user_id,
              action: 'application_updated',
              description: app.last_action,
              timestamp: app.last_action_date,
              profile: profile
            });
          }
        }
      });

      // Document activities  
      if (documents?.length) {
        const loanIds = documents.map(doc => doc.loan_id);
        const { data: loans } = await supabase
          .from('loan_applications')
          .select('id, user_id')
          .in('id', loanIds);

        const loanMap = new Map(loans?.map(loan => [loan.id, loan.user_id]) || []);

        documents.forEach(doc => {
          if (doc.uploaded_at) {
            const userId = loanMap.get(doc.loan_id);
            const profile = userId ? profileMap.get(userId) : null;
            
            if (profile && userId) {
              activityLogs.push({
                id: `doc-${doc.id}`,
                user_id: userId,
                action: 'document_uploaded',
                description: `Uploaded ${doc.document_name}`,
                timestamp: doc.uploaded_at,
                profile: profile
              });
            }
          }
        });
      }

      // Sort by timestamp
      activityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(activityLogs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${activity.profile?.first_name} ${activity.profile?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action === actionFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const timeThreshold = {
        '1h': new Date(now.getTime() - 60 * 60 * 1000),
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }[timeFilter];

      if (timeThreshold) {
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= timeThreshold);
      }
    }

    setFilteredActivities(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'application_created':
      case 'application_updated':
        return <FileText className="h-4 w-4" />;
      case 'document_uploaded':
        return <Upload className="h-4 w-4" />;
      case 'profile_updated':
        return <Edit className="h-4 w-4" />;
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'logout':
        return <LogOut className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'application_created':
        return 'bg-blue-100 text-blue-800';
      case 'application_updated':
        return 'bg-yellow-100 text-yellow-800';
      case 'document_uploaded':
        return 'bg-green-100 text-green-800';
      case 'profile_updated':
        return 'bg-purple-100 text-purple-800';
      case 'login':
        return 'bg-emerald-100 text-emerald-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity Log</CardTitle>
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
            <Activity className="h-5 w-5" />
            User Activity Log ({filteredActivities.length})
          </CardTitle>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="application_created">Application Created</SelectItem>
              <SelectItem value="application_updated">Application Updated</SelectItem>
              <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
              <SelectItem value="profile_updated">Profile Updated</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activities found matching your criteria
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {activity.profile?.first_name?.[0] || activity.profile?.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {activity.profile?.first_name} {activity.profile?.last_name}
                      </span>
                      <Badge className={getActionColor(activity.action)}>
                        {formatAction(activity.action)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  
                  {activity.profile?.email && (
                    <p className="text-xs text-muted-foreground">
                      {activity.profile.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}