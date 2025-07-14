import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function Admin() {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          console.log('Fetching role for user:', user.id);
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user role:', error);
          } else {
            console.log('User role data:', data);
            setUserRole(data?.role || 'client');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('client');
        }
      }
      setRoleLoading(false);
    };

    fetchUserRole();
  }, [user]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  console.log('Current userRole state:', userRole, 'Type:', typeof userRole);
  
  if (userRole !== 'admin') {
    console.log('Redirecting to dashboard because userRole is not admin:', userRole);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Rendering AdminDashboard');

  return <AdminDashboard />;
}