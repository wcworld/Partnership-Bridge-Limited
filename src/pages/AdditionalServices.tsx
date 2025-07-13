import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard,
  TrendingUp,
  Banknote,
  Calculator,
  Building,
  Users,
  ArrowRight,
  CheckCircle,
  Phone,
  Shield,
  Home,
  Briefcase,
  PiggyBank,
  Target,
  Heart,
  FileText,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QuoteModal from '@/components/QuoteModal';

const AdditionalServices = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Additional Financial Services
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              Comprehensive financial solutions beyond our core lending services. From credit cards 
              to investment advice, we provide the complete financial support you need.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg font-medium text-primary border border-primary/20 rounded-lg p-4 bg-primary/5">
                Partnership Bridge is a broker, not a lender. We will connect you with a lender suitable for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit & Card Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Credit & Card Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible credit solutions designed to meet your personal and business needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Personal Credit Cards</h3>
                <p className="text-muted-foreground mb-6">
                  Compare and apply for the best personal credit cards with competitive rates, rewards, and benefits.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">0% balance transfer options</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Cashback and rewards programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Low purchase APR rates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Credit building opportunities</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="credit-cards">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <Briefcase className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Business Credit Cards</h3>
                <p className="text-muted-foreground mb-6">
                  Streamline business expenses with dedicated business credit cards offering enhanced rewards and expense management.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Higher credit limits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Business expense tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Corporate rewards programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Separate business credit history</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="business-credit">
                    <Button className="w-full" variant="success">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Financial Planning & Investment */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Financial Planning & Investment</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Build your financial future with expert investment advice and comprehensive planning services.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Investment Advice</h3>
                <p className="text-muted-foreground mb-6">
                  Professional investment planning and portfolio management to help grow your wealth over time.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">ISA and pension planning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Diversified portfolio management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Risk assessment and profiling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Regular portfolio reviews</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="investment-advice">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <Calculator className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Financial Planning</h3>
                <p className="text-muted-foreground mb-6">
                  Comprehensive financial planning services including retirement planning, estate planning, and goal setting.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Retirement planning strategies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Estate planning guidance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Goal-based financial planning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Tax-efficient strategies</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="financial-planning">
                    <Button className="w-full" variant="success">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Debt Management & Consolidation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Debt Management Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Take control of your finances with our debt consolidation and management services.
            </p>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Banknote className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">Debt Consolidation</h3>
                    <p className="text-muted-foreground mb-6">
                      Simplify multiple debts into one manageable monthly payment with potentially lower interest rates.
                    </p>
                    <div className="space-y-3">
                      <QuoteModal serviceType="debt-consolidation">
                        <Button className="group-hover:bg-primary-light" variant="professional">
                          Get Debt Consolidation Quote <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </QuoteModal>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Combine multiple debts into one payment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Potentially lower monthly payments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Reduced interest rates</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Simplified debt management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Clear payoff timeline</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-muted-foreground">Improved credit score potential</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Property & Commercial Finance */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Property & Commercial Finance</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized financing solutions for property investment and commercial ventures.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Building className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Commercial Finance</h3>
                <p className="text-muted-foreground mb-6">
                  Commercial mortgages, property development finance, and investment property funding.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Commercial mortgages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Property development finance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Investment property loans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Bridging finance</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="commercial-finance">
                    <Button className="w-full group-hover:bg-primary-light" variant="professional">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <Home className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Residential Mortgages</h3>
                <p className="text-muted-foreground mb-6">
                  First-time buyer mortgages, remortgages, and buy-to-let property financing solutions.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">First-time buyer support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Remortgage services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Buy-to-let mortgages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm text-muted-foreground">Self-employed mortgages</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <QuoteModal serviceType="residential-mortgage">
                    <Button className="w-full" variant="success">
                      Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </QuoteModal>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insurance Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Insurance & Protection</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive insurance solutions to protect you, your family, and your business.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Life Insurance</h3>
                <p className="text-muted-foreground mb-4">
                  Term life, whole life, and universal life insurance policies.
                </p>
                <Button variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Income Protection</h3>
                <p className="text-muted-foreground mb-4">
                  Short and long-term income protection insurance.
                </p>
                <Button variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Business Insurance</h3>
                <p className="text-muted-foreground mb-4">
                  Professional indemnity, public liability, and business protection.
                </p>
                <Button variant="ghost" className="p-0 text-primary hover:text-primary-light">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Explore Our Additional Services?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Get in touch with our expert team to discover how our additional services can complement 
            your financial strategy and help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="cta" size="xl">
              <Link to="/contact">
                Get Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <Phone className="w-5 h-5 mr-2" />
              Call +44 20 7123 4567
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdditionalServices;