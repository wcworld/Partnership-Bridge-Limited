import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus } from 'lucide-react';

interface StartApplicationModalProps {
  onApplicationCreated: () => void;
  trigger?: React.ReactNode;
}

export function StartApplicationModal({ onApplicationCreated, trigger }: StartApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanType: '',
    purpose: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate reference number using the database function
      const { data: refData, error: refError } = await supabase
        .rpc('generate_reference_number');

      if (refError) throw refError;

      // Create the loan application
      const { data: applicationData, error: applicationError } = await supabase
        .from('loan_applications')
        .insert({
          user_id: user.id,
          loan_amount: parseFloat(formData.loanAmount.replace(/[^0-9.]/g, '')),
          loan_type: formData.loanType,
          reference_number: refData,
          current_stage: 1,
          status: 'submitted',
          last_action: 'Application started',
          last_action_date: new Date().toISOString()
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Create required documents for the application
      const requiredDocuments = [
        { name: 'Photo ID', document_type: 'photo_id' },
        { name: 'Company Registration/Incorporation Documents', document_type: 'company_registration' },
        { name: 'Proof of Business Address', document_type: 'business_address' },
        { name: 'Detailed Business Services and Business Plan', document_type: 'business_plan' },
        { name: 'Detailed Use of Funds Breakdown', document_type: 'use_of_funds' },
        { name: '3-Year Financial Projections', document_type: 'financial_projections' },
        { name: 'Relevant Business Licenses or Permits', document_type: 'business_licenses' }
      ];

      const documentsToInsert = requiredDocuments.map(doc => ({
        loan_id: applicationData.id,
        document_name: doc.name,
        document_type: doc.document_type,
        status: 'missing'
      }));

      const { error: documentsError } = await supabase
        .from('loan_documents')
        .insert(documentsToInsert);

      if (documentsError) {
        console.error('Error creating documents:', documentsError);
        // Don't throw here as the application was created successfully
      }

      toast({
        title: "Success",
        description: "Your loan application has been started successfully!"
      });

      setOpen(false);
      setFormData({ loanAmount: '', loanType: '', purpose: '' });
      onApplicationCreated();
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: "Error",
        description: "Failed to start application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setFormData({ ...formData, loanAmount: formatted });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Start Application
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start New Loan Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount *</Label>
            <Input
              id="loanAmount"
              placeholder="£100,000"
              value={formData.loanAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type *</Label>
            <Select 
              value={formData.loanType} 
              onValueChange={(value) => setFormData({ ...formData, loanType: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business Term Loan">Business Term Loan</SelectItem>
                <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                <SelectItem value="Working Capital">Working Capital</SelectItem>
                <SelectItem value="SBA Loan">SBA Loan</SelectItem>
                <SelectItem value="Asset Finance">Asset Finance</SelectItem>
                <SelectItem value="Invoice Finance">Invoice Finance</SelectItem>
                <SelectItem value="Commercial Mortgage">Commercial Mortgage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose (Optional)</Label>
            <Textarea
              id="purpose"
              placeholder="Brief description of how you plan to use the loan..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.loanAmount || !formData.loanType}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Start Application'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}