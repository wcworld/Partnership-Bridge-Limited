import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  LogOut,
  UserCheck,
  FileText,
  TrendingUp
} from 'lucide-react';
import { PendingSignups } from './PendingSignups';
import { ClientActivities } from './ClientActivities';
import { ApplicationOverview } from './ApplicationOverview';

interface AdminStats {
  totalUsers: number;
  pendingSignups: number;
  totalApplications: number;
  recentActivities: number;
}

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingSignups: 0,
    totalApplications: 0,
    recentActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total confirmed users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total applications
      const { count: totalApplications } = await supabase
        .from('loan_applications')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: totalUsers || 0,
        pendingSignups: 0, // Would need to track unconfirmed signups
        totalApplications: totalApplications || 0,
        recentActivities: 0 // Would calculate based on recent activity
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and monitor activities</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '-' : stats.totalUsers}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '-' : stats.pendingSignups}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Signups</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '-' : stats.totalApplications}
                  </div>
                  <div className="text-sm text-muted-foreground">Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '-' : stats.recentActivities}
                  </div>
                  <div className="text-sm text-muted-foreground">Recent Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="signups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signups">Pending Signups</TabsTrigger>
            <TabsTrigger value="activities">Client Activities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signups">
            <PendingSignups onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="activities">
            <ClientActivities />
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}