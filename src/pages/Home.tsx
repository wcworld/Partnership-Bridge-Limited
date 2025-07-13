import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Phone,
  Mail,
  Star
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-success py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Your Trusted Partner in
                <span className="block text-success-light">Financial Success</span>
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                Partnership Bridge Limited provides expert lending advice and tailored finance solutions 
                for individuals and businesses across the UK. Let us bridge the gap to your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="cta" size="xl" className="group">
                  Get Your Free Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="xl" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end animate-scale-in">
              <div className="relative">
                <div className="w-96 h-96 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm p-8 animate-float">
                  <div className="h-full bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-20 h-20 text-primary-foreground mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-primary-foreground mb-2">£50M+</h3>
                      <p className="text-primary-foreground/80">Loans Facilitated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">£50M+</div>
              <div className="text-muted-foreground">Loans Arranged</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Finance Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer comprehensive financial services tailored to meet your unique needs, 
              whether you're an individual seeking personal finance or a business looking to grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Personal Loans</h3>
                <p className="text-muted-foreground mb-6">
                  Competitive personal loans for debt consolidation, home improvements, or major purchases.
                </p>
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-light">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Business Finance</h3>
                <p className="text-muted-foreground mb-6">
                  Flexible business loans, asset finance, and working capital solutions to fuel your growth.
                </p>
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-light">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Mortgage Advice</h3>
                <p className="text-muted-foreground mb-6">
                  Expert mortgage guidance for first-time buyers, remortgages, and buy-to-let properties.
                </p>
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-light">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Partnership Bridge?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                    <p className="text-muted-foreground">15+ years of experience in financial services with a team of qualified advisors.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Competitive Rates</h3>
                    <p className="text-muted-foreground">Access to exclusive rates from our extensive network of lending partners.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
                    <p className="text-muted-foreground">Quick decision-making process with most applications processed within 24-48 hours.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
                    <p className="text-muted-foreground">Tailored solutions designed to meet your specific financial needs and circumstances.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Card className="w-80 bg-primary text-primary-foreground">
                  <CardContent className="p-8 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-6 text-primary-foreground/80" />
                    <h3 className="text-2xl font-bold mb-4">Quick Response</h3>
                    <p className="text-primary-foreground/90 mb-6">
                      Get a decision on your application within 24 hours
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>Call Now</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>Email Us</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-success text-success" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Partnership Bridge made the loan process incredibly smooth. Their team was professional, 
                  responsive, and helped me secure the best rate for my business expansion."
                </p>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Small Business Owner</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-success text-success" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Excellent service from start to finish. They found me a mortgage deal I couldn't 
                  have found on my own. Highly recommend their expertise."
                </p>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">First-time Buyer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-success text-success" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Professional, reliable, and trustworthy. They helped us refinance our property 
                  portfolio with much better terms. Outstanding service!"
                </p>
                <div>
                  <p className="font-semibold">David & Emma Wilson</p>
                  <p className="text-sm text-muted-foreground">Property Investors</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Secure Your Financial Future?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and discover how we can help you achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="cta" size="xl">
              <Link to="/contact">Get Free Quote</Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call +44 20 7123 4567
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;