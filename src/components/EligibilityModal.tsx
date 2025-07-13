import * as React from "react";
import { useState } from "react";
import { User, FileText, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface EligibilityModalProps {
  children: React.ReactNode;
}

const steps = [
  { number: 1, icon: User, title: "Personal Details" },
  { number: 2, icon: FileText, title: "Loan Details" },
  { number: 3, icon: FileText, title: "Business Info" },
  { number: 4, icon: CheckCircle, title: "Review" },
];

export function EligibilityModal({ children }: EligibilityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    loanAmount: "",
    loanPurpose: "",
    businessName: "",
    timeInBusiness: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.loanAmount && formData.loanPurpose;
      case 3:
        return formData.businessName && formData.timeInBusiness;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields are mandatory to proceed to the next step.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Eligibility Check Complete!",
      description: "Based on your information, you appear to be eligible for our loan products. Our team will contact you shortly.",
    });
    setIsOpen(false);
    setCurrentStep(1);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      loanAmount: "",
      loanPurpose: "",
      businessName: "",
      timeInBusiness: "",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Loan Details</h3>
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount *</Label>
              <Input
                id="loanAmount"
                placeholder="Enter desired loan amount"
                required
                value={formData.loanAmount}
                onChange={(e) => handleInputChange("loanAmount", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanPurpose">Loan Purpose *</Label>
              <Input
                id="loanPurpose"
                placeholder="What will you use the loan for?"
                required
                value={formData.loanPurpose}
                onChange={(e) => handleInputChange("loanPurpose", e.target.value)}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Business Information</h3>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                required
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeInBusiness">Time in Business *</Label>
              <Input
                id="timeInBusiness"
                placeholder="How long have you been in business?"
                required
                value={formData.timeInBusiness}
                onChange={(e) => handleInputChange("timeInBusiness", e.target.value)}
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Review Your Information</h3>
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="font-medium">{formData.loanAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business</p>
                  <p className="font-medium">{formData.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time in Business</p>
                  <p className="font-medium">{formData.timeInBusiness}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Loan Application</h2>
            <p className="text-muted-foreground">Complete your application in 4 simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isActive 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.number}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted h-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
              disabled={!isStepValid()}
            >
              {currentStep === 4 ? 'Submit' : 'Next'}
              {currentStep < 4 && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}