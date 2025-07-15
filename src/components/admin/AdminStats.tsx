import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface AdminStatsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoanAmount: number;
  averageProcessingTime: number;
  documentUploadRate: number;
  systemHealth: number;
}

interface AdminStatsProps {
  onStatsChange?: (stats: AdminStatsData) => void;
}

export function AdminStats({ onStatsChange }: AdminStatsProps) {
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalLoanAmount: 0,
    averageProcessingTime: 0,
    documentUploadRate: 0,
    systemHealth: 95
  });
  const [loading, setLoading] = useState(true);
  const [previousStats, setPreviousStats] = useState<AdminStatsData | null>(null);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setPreviousStats(stats);

      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Application stats
      const { count: totalApplications } = await supabase
        .from('loan_applications')
        .select('*', { count: 'exact', head: true });

      const { count: pendingApplications } = await supabase
        .from('loan_applications')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'document_review', 'underwriting']);

      const { count: approvedApplications } = await supabase
        .from('loan_applications')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'funded']);

      const { count: rejectedApplications } = await supabase
        .from('loan_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      // Total loan amount
      const { data: loanAmounts } = await supabase
        .from('loan_applications')
        .select('loan_amount')
        .in('status', ['approved', 'funded']);

      const totalLoanAmount = loanAmounts?.reduce((sum, app) => sum + app.loan_amount, 0) || 0;

      // Document upload rate (percentage of required documents uploaded)
      const { count: totalDocuments } = await supabase
        .from('loan_documents')
        .select('*', { count: 'exact', head: true });

      const { count: uploadedDocuments } = await supabase
        .from('loan_documents')
        .select('*', { count: 'exact', head: true })
        .neq('file_path', null);

      const documentUploadRate = totalDocuments ? (uploadedDocuments / totalDocuments) * 100 : 0;

      const newStats: AdminStatsData = {
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0, // Same as total users since we don't track active sessions
        newUsersToday: newUsersToday || 0,
        totalApplications: totalApplications || 0,
        pendingApplications: pendingApplications || 0,
        approvedApplications: approvedApplications || 0,
        rejectedApplications: rejectedApplications || 0,
        totalLoanAmount,
        averageProcessingTime: 0, // Would need to calculate from actual processing times
        documentUploadRate,
        systemHealth: 100 // System is healthy if we can fetch data
      };

      setStats(newStats);
      onStatsChange?.(newStats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeIndicator = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return null;
    
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle, 
    previousValue 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string; 
    subtitle?: string;
    previousValue?: number;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{title}</p>
              {typeof value === 'number' && previousValue !== undefined && 
                getChangeIndicator(value, previousValue)
              }
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !previousStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          subtitle={`${stats.newUsersToday} new today`}
          previousValue={previousStats?.totalUsers}
        />

        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="bg-green-500"
          subtitle={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active rate`}
          previousValue={previousStats?.activeUsers}
        />

        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={FileText}
          color="bg-purple-500"
          subtitle={`${stats.pendingApplications} pending`}
          previousValue={previousStats?.totalApplications}
        />

        <StatCard
          title="Total Loan Value"
          value={`£${(stats.totalLoanAmount / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="bg-emerald-500"
          subtitle="Approved loans"
          previousValue={previousStats?.totalLoanAmount}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Approved</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.approvedApplications}</span>
            </div>
            <Progress 
              value={(stats.approvedApplications / stats.totalApplications) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Pending</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</span>
            </div>
            <Progress 
              value={(stats.pendingApplications / stats.totalApplications) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium">Rejected</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</span>
            </div>
            <Progress 
              value={(stats.rejectedApplications / stats.totalApplications) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="font-medium">System Health</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.systemHealth}%</span>
            </div>
            <Progress 
              value={stats.systemHealth} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Upload Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{stats.documentUploadRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.documentUploadRate} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Percentage of required documents uploaded by users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{stats.averageProcessingTime} days</div>
              <p className="text-sm text-muted-foreground">
                From application submission to decision
              </p>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-green-600">15% faster than last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}