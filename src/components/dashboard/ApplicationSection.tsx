import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Building2, DollarSign, Calendar, FileText, Edit3, Save, X } from 'lucide-react';

interface ApplicationData {
  loanAmount: string;
  loanType: string;
  businessName: string;
  businessType: string;
  yearsInBusiness: string;
  monthlyRevenue: string;
  creditScore: string;
  purpose: string;
}

interface ApplicationSectionProps {
  application?: any;
  onSave: (data: ApplicationData) => void;
}

export function ApplicationSection({ application, onSave }: ApplicationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>({
    loanAmount: application?.loan_amount ? `$${application.loan_amount.toLocaleString()}` : '$100,000',
    loanType: application?.loan_type || 'Business Term Loan',
    businessName: 'Tech Solutions Inc.',
    businessType: 'Technology Services',
    yearsInBusiness: '5',
    monthlyRevenue: '$50,000',
    creditScore: '720',
    purpose: 'Equipment purchase and working capital expansion'
  });
  const { toast } = useToast();

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    toast({ title: "Success", description: "Application details updated successfully" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Application Details</CardTitle>
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
        {/* Loan Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Loan Amount
            </Label>
            {isEditing ? (
              <Input
                id="loanAmount"
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
              />
            ) : (
              <p className="text-2xl font-bold text-primary">{formData.loanAmount}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type</Label>
            {isEditing ? (
              <Select value={formData.loanType} onValueChange={(value) => setFormData({ ...formData, loanType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business Term Loan">Business Term Loan</SelectItem>
                  <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                  <SelectItem value="Working Capital">Working Capital</SelectItem>
                  <SelectItem value="SBA Loan">SBA Loan</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium">{formData.loanType}</p>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              {isEditing ? (
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.businessName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              {isEditing ? (
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.businessType}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearsInBusiness" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Years in Business
              </Label>
              {isEditing ? (
                <Input
                  id="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.yearsInBusiness} years</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
              {isEditing ? (
                <Input
                  id="monthlyRevenue"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formData.monthlyRevenue}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creditScore">Credit Score</Label>
              {isEditing ? (
                <Input
                  id="creditScore"
                  value={formData.creditScore}
                  onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                />
              ) : (
                <p className="font-medium text-green-600">{formData.creditScore}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose</Label>
            {isEditing ? (
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-muted-foreground">{formData.purpose}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}