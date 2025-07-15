import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScheduleModal = ({ open, onOpenChange }: ScheduleModalProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  const services = [
    'Personal Loan Consultation',
    'Business Finance Review',
    'Mortgage Advice',
    'Debt Consolidation Planning',
    'Investment Consultation',
    'General Financial Advice'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Both date and time are required to schedule your appointment.",
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentData = {
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        formType: 'appointment'
      };

      // Send to Cloudflare Worker
      const response = await fetch('https://forms.partnershipbridge.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast({
          title: "Appointment Scheduled!",
          description: `Your consultation is scheduled for ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedTime}. We'll send you a confirmation email shortly.`,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
        setSelectedDate(undefined);
        setSelectedTime('');
        onOpenChange(false);
      } else {
        throw new Error('Failed to schedule');
      }
    } catch (error) {
      console.error('Scheduling error:', error);
      toast({
        title: "Scheduling Error",
        description: "There was an error scheduling your appointment. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  // Disable past dates and weekends
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6; // Disable Sundays (0) and Saturdays (6)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Schedule Your Consultation
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            Book an online consultation with our experienced financial advisors
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Date & Time Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Select Date
                </Label>
                <Card>
                  <CardContent className="p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateDisabled}
                      className="rounded-md border-0"
                    />
                  </CardContent>
                </Card>
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Select Time
                  </Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-name" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="schedule-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="schedule-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number *
                  </Label>
                  <Input
                    id="schedule-phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-service">Service Type</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-message">Additional Notes</Label>
                  <Textarea
                    id="schedule-message"
                    name="message"
                    placeholder="Tell us about your specific needs or questions..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {selectedDate && selectedTime && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-primary mb-2">Appointment Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Duration:</strong> 30 minutes</p>
                  <p><strong>Type:</strong> Online consultation via video call</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="professional"
              className="flex-1"
              disabled={!selectedDate || !selectedTime}
            >
              <Send className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              By scheduling this appointment, you agree to our privacy policy and terms of service.
            </p>
            <p className="text-sm font-medium text-primary border border-primary/20 rounded-lg p-3 bg-primary/5">
              You'll receive a confirmation email with call details shortly after booking.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;