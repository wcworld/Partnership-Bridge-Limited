import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calculator, CheckCircle, Phone, Mail } from 'lucide-react';

interface QuoteModalProps {
  children: React.ReactNode;
  serviceType?: string;
}

const QuoteModal = ({ children, serviceType = "" }: QuoteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    loanType: serviceType,
    loanAmount: '',
    businessType: '',
    timeInBusiness: '',
    annualTurnover: '',
    creditScore: '',
    purpose: '',
    additionalInfo: ''
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send to Telegram via Cloudflare Worker
      const response = await fetch('https://forms.partnershipbridge.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'quote'
        }),
      });

      if (response.ok) {
        toast({
          title: "Quote Request Submitted!",
          description: "Thank you for your interest. We'll contact you within 24 hours with a personalized quote.",
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
    
    setIsOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      loanType: '',
      loanAmount: '',
      businessType: '',
      timeInBusiness: '',
      annualTurnover: '',
      creditScore: '',
      purpose: '',
      additionalInfo: ''
    });
  };

  const isEligible = () => {
    const amount = parseInt(formData.loanAmount.replace(/[^0-9]/g, ''));
    const turnover = parseInt(formData.annualTurnover.replace(/[^0-9]/g, ''));
    const timeInBiz = parseInt(formData.timeInBusiness);
    
    return amount >= 5000 && turnover >= 50000 && timeInBiz >= 6;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Calculator className="w-6 h-6 mr-2 text-primary" />
            Get Your Free Quote
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Loan Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanType">Loan Type *</Label>
              <Select value={formData.loanType} onValueChange={(value) => handleInputChange('loanType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-secured">Business Loan - Secured</SelectItem>
                  <SelectItem value="business-unsecured">Business Loan - Unsecured</SelectItem>
                  <SelectItem value="working-capital">Working Capital Loan</SelectItem>
                  <SelectItem value="merchant-cash">Merchant Cash Advance</SelectItem>
                  <SelectItem value="invoice-finance">Invoice Finance</SelectItem>
                  <SelectItem value="acquisition-buyout">Acquisition & Management Buyout</SelectItem>
                  <SelectItem value="tax-loans">VAT, Corporation Tax & Self Assessment</SelectItem>
                  <SelectItem value="saas-finance">SAAS Finance</SelectItem>
                  <SelectItem value="trade-loans">Trade Loans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="loanAmount">Loan Amount Required *</Label>
              <Input
                id="loanAmount"
                placeholder="e.g., $50,000"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limited-company">Limited Company</SelectItem>
                  <SelectItem value="sole-trader">Sole Trader</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                  <SelectItem value="charity">Charity/Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeInBusiness">Time in Business (months) *</Label>
              <Input
                id="timeInBusiness"
                type="number"
                placeholder="e.g., 24"
                value={formData.timeInBusiness}
                onChange={(e) => handleInputChange('timeInBusiness', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="annualTurnover">Annual Turnover *</Label>
              <Input
                id="annualTurnover"
                placeholder="e.g., $250,000"
                value={formData.annualTurnover}
                onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="creditScore">Credit Score Range</Label>
              <Select value={formData.creditScore} onValueChange={(value) => handleInputChange('creditScore', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (720+)</SelectItem>
                  <SelectItem value="good">Good (650-719)</SelectItem>
                  <SelectItem value="fair">Fair (580-649)</SelectItem>
                  <SelectItem value="poor">Poor (Below 580)</SelectItem>
                  <SelectItem value="unknown">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose of Loan *</Label>
            <Textarea
              id="purpose"
              placeholder="Please describe what you'll use the loan for..."
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional details that might help us provide a better quote..."
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            />
          </div>

          {/* Qualification Check */}
          {formData.loanAmount && formData.annualTurnover && formData.timeInBusiness && (
            <div className={`p-4 rounded-lg border ${isEligible() ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-5 h-5 ${isEligible() ? 'text-success' : 'text-destructive'}`} />
                <span className={`font-semibold ${isEligible() ? 'text-success' : 'text-destructive'}`}>
                  {isEligible() ? 'Great! You appear to qualify for our business loans.' : 'Based on initial criteria, this application may need special consideration.'}
                </span>
              </div>
              {isEligible() && (
                <p className="text-sm text-muted-foreground mt-2">
                  Our team will provide you with competitive rates and terms within 24 hours.
                </p>
              )}
            </div>
          )}

          <div className="flex space-x-4">
            <Button type="submit" className="flex-1" variant="professional">
              Get My Free Quote
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p className="mb-2">Need immediate assistance?</p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+44 73 6205 5683</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>quotes@partnershipbridge.co.uk</span>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;