import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send to Telegram via Cloudflare Worker
      const response = await fetch('https://your-worker.your-subdomain.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'contact'
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Contact Partnership Bridge
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              Ready to take the next step towards your financial goals? Get in touch with our 
              expert team for a free consultation and personalized advice.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-primary-foreground/90 mb-3">Speak directly with our advisors</p>
                <p className="text-lg font-bold">+44 20 7123 4567</p>
                <p className="text-sm text-primary-foreground/80 mt-2">Mon-Fri: 9am-6pm</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-success to-success text-success-foreground">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-success-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-success-foreground/90 mb-3">Send us your inquiry</p>
                <p className="text-lg font-bold">info@partnershipbridge.co.uk</p>
                <p className="text-sm text-success-foreground/80 mt-2">Response within 24hrs</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-primary-foreground/90 mb-3">Meet us in person</p>
                <p className="text-sm">26 Talbot Road</p>
                <p className="text-sm">Albrighton, Wolverhampton</p>
                <p className="text-sm">England WV7 3HH</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Get Your Free Quote</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and one of our financial experts will contact you 
                    within 24 hours to discuss your requirements.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Interested In</Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select a service</option>
                        <option value="personal-loan">Personal Loan</option>
                        <option value="business-finance">Business Finance</option>
                        <option value="mortgage">Mortgage Advice</option>
                        <option value="debt-consolidation">Debt Consolidation</option>
                        <option value="investment">Investment Advice</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your financial needs and any specific requirements..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <Button type="submit" variant="professional" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                    <p className="text-sm font-medium text-primary border border-primary/20 rounded-lg p-3 bg-primary/5">
                      Partnership Bridge is a broker, not a lender. We will connect you with a lender suitable for your needs.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-medium">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <p className="text-sm text-success-foreground font-medium">
                      Emergency contact available 24/7 for existing clients
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold">What to Expect</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Quick Response</p>
                        <p className="text-sm text-muted-foreground">We'll respond to your inquiry within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Free Consultation</p>
                        <p className="text-sm text-muted-foreground">Initial consultation is completely free with no obligations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Expert Advice</p>
                        <p className="text-sm text-muted-foreground">Qualified advisors will assess your specific needs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Tailored Solutions</p>
                        <p className="text-sm text-muted-foreground">Personalized recommendations based on your situation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Book Appointment */}
              <Card className="bg-gradient-to-br from-primary/5 to-success/5">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Book a Meeting</h3>
                  <p className="text-muted-foreground mb-4">
                    Prefer to meet in person? Schedule a face-to-face consultation at our office.
                  </p>
                  <Button variant="outline" className="w-full">
                    Schedule Appointment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get quick answers to common questions about our services and process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How quickly can I get a decision?</h3>
                <p className="text-muted-foreground">
                  Most applications are processed within 24-48 hours. For urgent cases, 
                  we can often provide same-day decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">What documents do I need?</h3>
                <p className="text-muted-foreground">
                  Generally, you'll need ID, proof of income, and bank statements. 
                  We'll provide a complete list based on your specific requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Are there any upfront fees?</h3>
                <p className="text-muted-foreground">
                  No, our initial consultation and advice are completely free. 
                  You only pay our arrangement fee upon successful completion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Do you work with bad credit clients?</h3>
                <p className="text-muted-foreground">
                  Yes, we have specialist lenders who work with various credit situations. 
                  We'll find the best available options for your circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-primary/10 to-success/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Visit Our Office</h3>
                  <p className="text-muted-foreground">26 Talbot Road, Albrighton, Wolverhampton, England WV7 3HH</p>
                  <Button variant="outline" className="mt-4">
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;