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
  TrendingUp,
  Settings,
  BarChart3,
  Shield
} from 'lucide-react';
import { PendingSignups } from './PendingSignups';
import { ClientActivities } from './ClientActivities';
import { ApplicationOverview } from './ApplicationOverview';
import { UserManagement } from './UserManagement';
import { UserActivityLog } from './UserActivityLog';
import { AdminStats } from './AdminStats';

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
      {/* Enhanced Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive system management and monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              System Online
            </Badge>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="signups" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Signups
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AdminStats onStatsChange={(newStats) => {
              setStats({
                totalUsers: newStats.totalUsers,
                pendingSignups: newStats.newUsersToday,
                totalApplications: newStats.totalApplications,
                recentActivities: newStats.pendingApplications
              });
            }} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="signups">
            <PendingSignups onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="activities">
            <ClientActivities />
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationOverview />
          </TabsContent>

          <TabsContent value="logs">
            <UserActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}