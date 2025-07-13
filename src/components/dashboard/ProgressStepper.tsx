import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={index} className="flex items-center gap-4">
                {/* Step Indicator */}
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-muted-foreground text-muted-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1">
                  <div className={`
                    font-medium
                    ${isCompleted 
                      ? 'text-green-600' 
                      : isActive 
                      ? 'text-primary'
                      : 'text-muted-foreground'
                    }
                  `}>
                    {step}
                  </div>
                  {isActive && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Currently in progress
                    </div>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-4 mt-8 w-0.5 h-6 bg-border ml-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}