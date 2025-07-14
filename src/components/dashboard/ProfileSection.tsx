import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Building, MapPin, Edit3, Save, X, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ProfileSectionProps {
  profile?: any;
  onUpdate: () => void;
}

export function ProfileSection({ profile, onUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    firstName: profile?.first_name || 'John',
    lastName: profile?.last_name || 'Doe',
    email: profile?.email || 'john.doe@techsolutions.com',
    phone: profile?.phone || '+1 (555) 123-4567',
    company: profile?.company_name || 'Tech Solutions Inc.',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsEditing(false);
      onUpdate();
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update profile", 
        variant: "destructive" 
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      firstName: profile?.first_name || 'John',
      lastName: profile?.last_name || 'Doe',
      email: profile?.email || 'john.doe@techsolutions.com',
      phone: profile?.phone || '+1 (555) 123-4567',
      company: profile?.company_name || 'Tech Solutions Inc.',
      address: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Profile Information</CardTitle>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=80&h=80&fit=crop&crop=face" />
              <AvatarFallback>{formData.firstName[0]}{formData.lastName[0]}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{formData.firstName} {formData.lastName}</h3>
            <p className="text-muted-foreground">{formData.company}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business Information
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            {isEditing ? (
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            ) : (
              <p className="font-medium">{formData.company}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address Information
          </h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{formData.city}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                {isEditing ? (
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{formData.state}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                {isEditing ? (
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{formData.zipCode}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}