import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              About Partnership Bridge Limited
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              We are a leading financial services company dedicated to providing exceptional 
              lending advice and finance solutions. With over 15 years of experience, we have 
              helped thousands of individuals and businesses achieve their financial goals.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg font-medium text-primary border border-primary/20 rounded-lg p-4 bg-primary/5">
                Partnership Bridge is a broker, not a lender. We will connect you with a lender suitable for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Founded in 2008, Partnership Bridge Limited emerged from a simple yet powerful vision: 
                  to bridge the gap between people's financial aspirations and the complex world of lending. 
                  Our founders, experienced financial professionals, recognized that individuals and businesses 
                  often struggled to navigate the intricate landscape of financial services.
                </p>
                <p className="text-lg leading-relaxed">
                  What started as a small advisory firm has grown into one of the UK's most trusted 
                  financial service providers. We've facilitated over £50 million in loans and helped 
                  more than 1,000 clients achieve their financial objectives. Our success is built on 
                  the foundation of trust, expertise, and unwavering commitment to our clients' success.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we continue to evolve and adapt to the changing financial landscape, ensuring 
                  our clients always receive the most current and effective solutions available in the market.
                </p>
              </div>
            </div>
            <div className="flex justify-center animate-scale-in">
              <Card className="w-full max-w-md bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-6 text-primary-foreground/90" />
                  <h3 className="text-2xl font-bold mb-4">15+ Years</h3>
                  <p className="text-primary-foreground/90 mb-6">
                    of proven excellence in financial services
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold">£50M+</div>
                      <div className="text-primary-foreground/80">Loans Facilitated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-primary-foreground/80">Happy Clients</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission & Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are guided by our core principles that shape every interaction and decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide accessible, transparent, and tailored financial solutions that empower 
                  our clients to achieve their personal and business objectives while building 
                  long-term financial security.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the UK's most trusted financial bridge, connecting dreams with reality through 
                  innovative lending solutions and exceptional client service that sets the industry standard.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
                <p className="text-muted-foreground">
                  Integrity, transparency, and client-first approach guide everything we do. We believe 
                  in building lasting relationships based on trust and delivering exceptional results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="bg-gradient-to-br from-success/5 to-primary/5 border-none">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary-foreground text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Consultation</h3>
                        <p className="text-muted-foreground">We begin with a comprehensive consultation to understand your unique financial situation and goals.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary-foreground text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Analysis</h3>
                        <p className="text-muted-foreground">Our experts analyze your requirements and identify the most suitable lending options from our network.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary-foreground text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Application</h3>
                        <p className="text-muted-foreground">We handle the entire application process, ensuring all documentation is complete and submitted efficiently.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-success-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Success</h3>
                        <p className="text-muted-foreground">We continue to support you throughout the process and beyond, ensuring your complete satisfaction.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Approach</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We believe that every client is unique, and so are their financial needs. Our proven 
                four-step approach ensures that you receive personalized service and the best possible 
                outcome for your specific situation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-muted-foreground">Personalized financial assessment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-muted-foreground">Access to exclusive lending rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-muted-foreground">End-to-end application management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-muted-foreground">Ongoing support and guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Expert Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our dedicated professionals bring together decades of experience in financial services 
              to provide you with the best possible outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face" 
                      alt="Managing Director"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Managing Director</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Strategic leadership and overall business direction, ensuring the highest standards 
                  of service delivery and client satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-success/20 group-hover:border-success/40 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&crop=face" 
                      alt="Private Client Team"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-success/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-success transition-colors">Private Client Team</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Specialists in personal lending solutions, providing tailored advice for mortgages, 
                  personal loans, and wealth management.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face" 
                      alt="Finance Brokers"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Finance Brokers</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Expert intermediaries who connect clients with the best lending options across 
                  our extensive network of financial partners.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 hover:border-success/20">
              <CardContent className="p-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-success/20 group-hover:border-success/40 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face" 
                      alt="Business Finance Team"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-success/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-success transition-colors">Business Finance Team</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Commercial lending specialists focused on helping businesses grow through 
                  strategic financing solutions and partnership opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&crop=face" 
                      alt="Operations Team"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Operations Team</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Behind-the-scenes professionals ensuring seamless application processing, 
                  compliance, and exceptional client support throughout your journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Partnership Bridge?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We stand apart from other financial service providers through our commitment to excellence 
              and client satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
              <p className="text-muted-foreground">Qualified financial advisors with extensive industry experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">FCA Regulated</h3>
              <p className="text-muted-foreground">Fully authorized and regulated by the Financial Conduct Authority</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-muted-foreground">98% success rate with over £50M in loans facilitated</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Award Winning</h3>
              <p className="text-muted-foreground">Recognized for excellence in customer service and innovation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Experience the Partnership Bridge Difference?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have achieved their financial goals with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="cta" size="xl">
              <Link to="/contact">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;