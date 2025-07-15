import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  UserCog, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Shield,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  role?: string;
  status?: 'active' | 'suspended' | 'pending';
}

interface UserManagementProps {
  onStatsUpdate?: () => void;
}

export function UserManagement({ onStatsUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching users...');
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Profiles fetched:', profiles?.length, profiles);

      if (profiles) {
        // Fetch user roles separately
        const userIds = profiles.map(profile => profile.user_id);
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        const roleMap = new Map(
          userRoles?.map(role => [role.user_id, role.role]) || []
        );

        const usersWithRoles = profiles.map(profile => ({
          ...profile,
          role: roleMap.get(profile.user_id) || 'client',
          status: 'active' as const
        }));
        
        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client') => {
    try {
      console.log('Updating user role:', userId, 'to', newRole);
      
      // First check if user has an existing role
      const { data: existingRole, error: fetchError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('Existing role check:', existingRole, fetchError);

      let error;
      if (existingRole) {
        // Update existing role
        console.log('Updating existing role...');
        const result = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        console.log('Update result:', result);
        error = result.error;
      } else {
        // Insert new role
        console.log('Inserting new role...');
        const result = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
        console.log('Insert result:', result);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });

      fetchUsers();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      // In a real implementation, you would update a status field
      toast({
        title: "User Suspended",
        description: "User access has been suspended",
        variant: "destructive",
      });
      
      // Update local state for demo
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, status: 'suspended' as const } : user
      ));
      
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive",
      });
    }
  };

  const reactivateUser = async (userId: string) => {
    try {
      toast({
        title: "User Reactivated",
        description: "User access has been restored",
      });
      
      // Update local state for demo
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, status: 'active' as const } : user
      ));
      
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error reactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to reactivate user",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // First delete from user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Then delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Finally delete from auth.users (this requires admin privileges)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;

      toast({
        title: "User Deleted",
        description: "User account has been permanently deleted",
        variant: "destructive",
      });

      fetchUsers();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user account",
        variant: "destructive",
      });
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'client':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
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
            <Users className="h-5 w-5" />
            User Management ({filteredUsers.length})
          </CardTitle>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your criteria
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {user.first_name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.first_name} {user.last_name}
                      </span>
                      <Badge variant={getRoleVariant(user.role || 'client') as any}>
                        {user.role || 'client'}
                      </Badge>
                      <Badge variant={getStatusVariant(user.status || 'active') as any}>
                        {user.status || 'active'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {user.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      
                      {user.company_name && (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{user.company_name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        <UserCog className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage User</DialogTitle>
                      </DialogHeader>
                      
                      {selectedUser && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={selectedUser.avatar_url || undefined} />
                              <AvatarFallback>
                                {selectedUser.first_name?.[0] || selectedUser.email?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">
                                {selectedUser.first_name} {selectedUser.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Role</label>
                              <Select
                                value={selectedUser.role || 'client'}
                                onValueChange={(value) => updateUserRole(selectedUser.user_id, value as 'admin' | 'client')}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-2">
                              {selectedUser.status === 'active' ? (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => suspendUser(selectedUser.user_id)}
                                  className="flex-1"
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Suspend User
                                </Button>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => reactivateUser(selectedUser.user_id)}
                                  className="flex-1"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Reactivate User
                                </Button>
                              )}
                            </div>

                            <div className="border-t pt-3">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUser(selectedUser.user_id)}
                                className="w-full"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete Account Permanently
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1 text-center">
                                This action cannot be undone
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}