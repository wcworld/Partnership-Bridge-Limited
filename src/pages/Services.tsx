import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  Home, 
  TrendingUp, 
  CreditCard, 
  Banknote,
  ArrowRight,
  CheckCircle,
  Phone,
  Calculator,
  Shield,
  Coins,
  Receipt,
  FileText,
  DollarSign,
  Briefcase,
  Truck,
  ChartBar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QuoteModal from '@/components/QuoteModal';

const Services = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Our Financial Services
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              Comprehensive lending advice and finance solutions tailored to meet your unique 
              needs. From personal loans to business finance, we've got you covered.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg font-medium text-primary border border-primary/20 rounded-lg p-4 bg-primary/5">
                Partnership Bridge is a broker, not a lender. We will connect you with a lender suitable for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Loan Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Business Finance Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive business lending solutions tailored to your company's unique needs and growth objectives.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Business Loan - Secured */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Business Loan - Secured</h3>
                <p className="text-muted-foreground mb-6">
                  Lower rate business loans secured against business or personal assets with flexible terms up to 25 years.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">$10,000 - $1,000,000 available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Rates from 4.5% APR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Terms up to 25 years</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Asset-backed security</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="business-secured">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                  <Button asChild variant="ghost" className="w-full p-0 text-primary hover:text-primary-light">
                    <Link to="/contact">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>


            {/* Working Capital */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Working Capital Loan</h3>
                <p className="text-muted-foreground mb-6">
                  Short-term financing to manage cash flow gaps, seasonal fluctuations, and day-to-day operations.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">$5,000 - $100,000 available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Fast approval in 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Flexible repayment terms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Revolving credit facilities</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="working-capital">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                  <Button asChild variant="ghost" className="w-full p-0 text-primary hover:text-primary-light">
                    <Link to="/contact">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>


            {/* Invoice Finance */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Invoice Finance</h3>
                <p className="text-muted-foreground mb-6">
                  Release cash tied up in unpaid invoices to improve your cash flow and accelerate business growth.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Up to 90% of invoice value</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Factoring & discounting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Selective invoice finance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Bad debt protection</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="invoice-finance">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                  <Button asChild variant="ghost" className="w-full p-0 text-primary hover:text-primary-light">
                    <Link to="/contact">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Acquisition & Management Buyout */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <Briefcase className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Acquisition & Management Buyout Finance</h3>
                <p className="text-muted-foreground mb-6">
                  Specialized funding for business acquisitions, management buyouts, and strategic investments.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">$50,000 - $5,000,000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">MBO/MBI financing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Development capital</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Expert deal structuring</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="acquisition-buyout">
                    <Button className="w-full" variant="success">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                  <Button asChild variant="ghost" className="w-full p-0 text-primary hover:text-primary-light">
                    <Link to="/contact">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>


            {/* SAAS Finance */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <ChartBar className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">SAAS Finance</h3>
                <p className="text-muted-foreground mb-6">
                  Specialized funding for software-as-a-service businesses based on recurring revenue models.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">$10,000 - $2,000,000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">ARR-based underwriting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Growth capital solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Tech-friendly lenders</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="saas-finance">
                    <Button className="w-full" variant="success">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                  <Button asChild variant="ghost" className="w-full p-0 text-primary hover:text-primary-light">
                    <Link to="/contact">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trade Loans */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Trade Loans</h3>
                <p className="text-muted-foreground mb-6">
                  Import/export finance, letters of credit, and trade finance solutions for international businesses.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">$25,000 - $10,000,000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Letters of credit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Import/export finance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Supply chain finance</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="trade-loans">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                  <Button asChild variant="ghost" className="w-full p-0 text-primary hover:text-primary-light">
                    <Link to="/contact">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Additional Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond our core lending services, we offer a comprehensive range of financial 
              solutions to meet all your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Credit Cards</h3>
                <p className="text-muted-foreground mb-4">
                  Balance transfer cards, purchase cards, and business credit solutions.
                </p>
                <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  <Link to="/additional-services">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Investment Advice</h3>
                <p className="text-muted-foreground mb-4">
                  Investment planning and portfolio management services.
                </p>
                <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  <Link to="/additional-services">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Banknote className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Debt Consolidation</h3>
                <p className="text-muted-foreground mb-4">
                  Simplify multiple debts into one manageable monthly payment.
                </p>
                <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  <Link to="/additional-services">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Financial Planning</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive financial planning and retirement advice.
                </p>
                <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  <Link to="/additional-services">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Commercial Finance</h3>
                <p className="text-muted-foreground mb-4">
                  Commercial mortgages and property development finance.
                </p>
                <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  <Link to="/additional-services">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Insurance Services</h3>
                <p className="text-muted-foreground mb-4">
                  Life insurance, income protection, and business insurance.
                </p>
                <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  <Link to="/additional-services">Learn More <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">How We Work</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process ensures you get the best possible outcome with minimal hassle.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Initial Consultation</h3>
              <p className="text-muted-foreground">
                Free consultation to understand your financial needs and objectives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Market Research</h3>
              <p className="text-muted-foreground">
                We search the entire market to find the best deals for your situation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-foreground text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Application Support</h3>
              <p className="text-muted-foreground">
                Complete application management and documentation support.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Completion</h3>
              <p className="text-muted-foreground">
                Successful completion with ongoing support and aftercare service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Our Services?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Whole of Market Access</h3>
                    <p className="text-muted-foreground">We work with over 50 lenders to ensure you get the best available rates and terms.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
                    <p className="text-muted-foreground">Transparent pricing with no hidden charges - you'll know exactly what you're paying.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
                    <p className="text-muted-foreground">Qualified advisors with extensive knowledge of the global lending market.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                    <p className="text-muted-foreground">Continued support throughout the life of your loan with regular reviews.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-gradient-to-br from-primary to-success text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-6 text-primary-foreground/90" />
                  <h3 className="text-2xl font-bold mb-4">Start Today</h3>
                  <p className="text-primary-foreground/90 mb-6">
                    Get your free quote in under 24 hours
                  </p>
                  <div className="space-y-4">
                    <Button asChild variant="cta" size="lg" className="w-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground">
                      <a href="tel:+447362055683">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now
                      </a>
                    </Button>
                    <p className="text-sm text-primary-foreground/80">
                      +44 73 6205 5683
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Perfect Financial Solution?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact our expert team today for a free, no-obligation consultation and discover 
            how we can help achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="cta" size="xl">
              <Link to="/contact">
                Get Free Quote Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <a href="tel:+447362055683">
                <Phone className="w-5 h-5 mr-2" />
                Call +44 73 6205 5683
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;