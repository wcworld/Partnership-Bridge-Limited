import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Upload, 
  Camera, 
  Trash2,
  User,
  ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function UserPhotoManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, email, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (profiles) {
        setUsers(profiles);
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

    if (searchTerm) {
      filtered = filtered.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedUser) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Delete old avatar if exists
      if (selectedUser.avatar_url) {
        const oldPath = selectedUser.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`avatars/${selectedUser.user_id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${selectedUser.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', selectedUser.user_id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });

      // Update local state
      setUsers(prev => prev.map(user => 
        user.user_id === selectedUser.user_id 
          ? { ...user, avatar_url: data.publicUrl }
          : user
      ));

      setSelectedUser(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = async (user: User) => {
    if (!user.avatar_url) return;

    try {
      setUploading(true);

      // Remove from storage
      const oldPath = user.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`avatars/${user.user_id}/${oldPath}`]);
      }

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.user_id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile photo removed successfully",
      });

      // Update local state
      setUsers(prev => prev.map(u => 
        u.user_id === user.user_id 
          ? { ...u, avatar_url: null }
          : u
      ));

      if (selectedUser?.user_id === user.user_id) {
        setSelectedUser(prev => prev ? { ...prev, avatar_url: null } : null);
      }

    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Failed to remove photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Photo Management</CardTitle>
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
            <Camera className="h-5 w-5" />
            User Photo Management ({filteredUsers.length})
          </CardTitle>
        </div>

        {/* Search */}
        <div className="mt-4">
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
      </CardHeader>

      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {user.first_name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="font-medium">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="flex gap-2 w-full">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Profile Photo</DialogTitle>
                        </DialogHeader>
                        
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="flex flex-col items-center space-y-4">
                              <Avatar className="h-32 w-32">
                                <AvatarImage src={selectedUser.avatar_url || undefined} />
                                <AvatarFallback className="text-2xl">
                                  {selectedUser.first_name?.[0] || selectedUser.email?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="text-center">
                                <h3 className="font-semibold text-lg">
                                  {selectedUser.first_name} {selectedUser.last_name}
                                </h3>
                                <p className="text-muted-foreground">{selectedUser.email}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={openFileDialog}
                                disabled={uploading}
                                className="flex-1"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? 'Uploading...' : 'Upload New Photo'}
                              </Button>
                              
                              {selectedUser.avatar_url && (
                                <Button
                                  variant="destructive"
                                  onClick={() => removePhoto(selectedUser)}
                                  disabled={uploading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="text-sm text-muted-foreground">
                              <p>• Supported formats: JPG, PNG, GIF</p>
                              <p>• Maximum file size: 5MB</p>
                              <p>• Recommended size: 400x400 pixels</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {user.avatar_url && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removePhoto(user)}
                        disabled={uploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Card>
  );
}