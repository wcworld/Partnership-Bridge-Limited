import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Briefcase
} from 'lucide-react';

interface ApplicationData {
  id?: string;
  reference_number?: string;
  loan_amount: number;
  loan_type: string;
  status: string;
  current_stage: number;
  created_at?: string;
  updated_at?: string;
  last_action?: string | null;
  last_action_date?: string | null;
  user_id?: string;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
}

interface ApplicationDetailsProps {
  application?: ApplicationData | null;
  profile?: Profile | null;
  onSave?: (data: Partial<ApplicationData>) => void;
  isEditable?: boolean;
  isAdminView?: boolean;
}

const APPLICATION_STAGES = [
  { id: 1, name: 'Application', description: 'Initial application submitted' },
  { id: 2, name: 'Documents', description: 'Document collection and verification' },
  { id: 3, name: 'Review', description: 'Application under review' },
  { id: 4, name: 'Underwriting', description: 'Credit assessment and underwriting' },
  { id: 5, name: 'Decision', description: 'Final approval or rejection' }
];

const LOAN_TYPES = [
  'Business Term Loan',
  'Equipment Financing',
  'Working Capital Loan',
  'Invoice Financing',
  'Asset-Based Lending',
  'Commercial Real Estate',
  'SBA Loan',
  'Merchant Cash Advance'
];

const APPLICATION_STATUSES = [
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-500' },
  { value: 'document_review', label: 'Document Review', color: 'bg-yellow-500' },
  { value: 'underwriting', label: 'Underwriting', color: 'bg-orange-500' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'funded', label: 'Funded', color: 'bg-emerald-500' }
];

export function ApplicationDetails({ 
  application, 
  profile, 
  onSave, 
  isEditable = false,
  isAdminView = false 
}: ApplicationDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ApplicationData>>({
    loan_amount: application?.loan_amount || 100000,
    loan_type: application?.loan_type || 'Business Term Loan',
    status: application?.status || 'submitted',
    current_stage: application?.current_stage || 1
  });
  const { toast } = useToast();

  useEffect(() => {
    if (application) {
      setFormData({
        loan_amount: application.loan_amount,
        loan_type: application.loan_type,
        status: application.status,
        current_stage: application.current_stage
      });
    }
  }, [application]);

  const handleSave = async () => {
    try {
      if (onSave) {
        await onSave(formData);
      }
      
      if (application?.id && isAdminView) {
        const { error } = await supabase
          .from('loan_applications')
          .update({
            ...formData,
            last_action: `Application updated by admin`,
            last_action_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', application.id);

        if (error) throw error;
      }

      setIsEditing(false);
      toast({ 
        title: "Success", 
        description: "Application details updated successfully",
        duration: 3000
      });
    } catch (error) {
      console.error('Error saving application:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update application details",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      loan_amount: application?.loan_amount || 100000,
      loan_type: application?.loan_type || 'Business Term Loan',
      status: application?.status || 'submitted',
      current_stage: application?.current_stage || 1
    });
  };

  const getStatusInfo = (status: string) => {
    return APPLICATION_STATUSES.find(s => s.value === status) || APPLICATION_STATUSES[0];
  };

  const calculateProgress = (stage: number) => {
    return ((stage - 1) / (APPLICATION_STAGES.length - 1)) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!application && !isEditing) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Application Selected</h3>
          <p className="text-muted-foreground">Select an application to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Application Details</CardTitle>
                {application?.reference_number && (
                  <p className="text-sm text-muted-foreground font-mono">
                    Ref: {application.reference_number}
                  </p>
                )}
              </div>
            </div>
            {isEditable && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Status and Progress */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={
                    formData.status === 'approved' || formData.status === 'funded' ? 'default' :
                    formData.status === 'rejected' ? 'destructive' : 'secondary'
                  }
                  className="text-sm px-3 py-1"
                >
                  {getStatusInfo(formData.status || 'submitted').label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Stage {formData.current_stage} of {APPLICATION_STAGES.length}
                </span>
              </div>
              {application?.created_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Applied {new Date(application.created_at).toLocaleDateString('en-GB')}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Application Progress</span>
                <span>{Math.round(calculateProgress(formData.current_stage || 1))}%</span>
              </div>
              <Progress value={calculateProgress(formData.current_stage || 1)} className="h-2" />
            </div>
          </div>

          {/* Loan Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-primary" />
                Loan Amount
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: Number(e.target.value) })}
                  className="text-lg font-semibold"
                />
              ) : (
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(formData.loan_amount || 0)}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Briefcase className="h-4 w-4 text-primary" />
                Loan Type
              </Label>
              {isEditing ? (
                <Select 
                  value={formData.loan_type} 
                  onValueChange={(value) => setFormData({ ...formData, loan_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-lg">{formData.loan_type}</p>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          {isAdminView && isEditing && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Admin Controls
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Stage</Label>
                  <Select 
                    value={formData.current_stage?.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, current_stage: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STAGES.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id.toString()}>
                          Stage {stage.id}: {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {APPLICATION_STAGES.map((stage, index) => {
              const isCompleted = (formData.current_stage || 1) > stage.id;
              const isCurrent = (formData.current_stage || 1) === stage.id;
              const isUpcoming = (formData.current_stage || 1) < stage.id;

              return (
                <div key={stage.id} className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-primary text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isCurrent ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      stage.id
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.name}
                    </h4>
                    <p className={`text-sm ${isCurrent ? 'text-primary/80' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                      {stage.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Current
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information (Admin View) */}
      {isAdminView && profile && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                <p className="font-medium text-lg">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
              
              {profile.company_name && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {profile.company_name}
                  </p>
                </div>
              )}
              
              {profile.email && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {profile.email}
                  </p>
                </div>
              )}
              
              {profile.phone && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {profile.phone}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      {application?.last_action && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div className="flex-1">
                <p className="font-medium">{application.last_action}</p>
                {application.last_action_date && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(application.last_action_date).toLocaleString('en-GB')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}