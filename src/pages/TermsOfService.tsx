import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale, Shield, AlertTriangle, Users, Phone } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              These terms govern your use of our services and website. Please read them carefully 
              before using our financial advisory and brokerage services.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg font-medium text-primary border border-primary/20 rounded-lg p-4 bg-primary/5">
                Partnership Bridge is a broker, not a lender. We will connect you with a lender suitable for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">1. About Our Services</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Partnership Bridge Limited is a financial services broker authorized and regulated by the Financial Conduct Authority (FCA). We provide:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Loan brokerage services for personal and business finance</li>
                    <li>Mortgage advice and application services</li>
                    <li>Investment and financial planning guidance</li>
                    <li>Insurance product recommendations</li>
                    <li>Debt consolidation advice</li>
                  </ul>
                  <p className="font-medium">We do not lend money directly but connect you with suitable lenders from our panel.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">2. Your Obligations</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>When using our services, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate and complete information about your financial situation</li>
                    <li>Update us promptly of any changes to your circumstances</li>
                    <li>Respond to requests for additional information in a timely manner</li>
                    <li>Use our services for lawful purposes only</li>
                    <li>Pay agreed fees when services are successfully completed</li>
                    <li>Not misuse our website or attempt to gain unauthorized access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">3. Our Responsibilities</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We commit to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Conduct business in accordance with FCA regulations</li>
                    <li>Treat customers fairly and with due care and skill</li>
                    <li>Provide clear information about our services and fees</li>
                    <li>Handle your personal data securely and in compliance with GDPR</li>
                    <li>Maintain appropriate professional indemnity insurance</li>
                    <li>Act in your best interests when providing advice</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">4. Fees and Charges</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Our fee structure:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Initial consultations are provided free of charge</li>
                    <li>Arrangement fees are only charged upon successful completion of your application</li>
                    <li>All fees will be clearly disclosed before you proceed with our services</li>
                    <li>Some lenders may pay us a commission, which will be disclosed to you</li>
                    <li>You have the right to request information about any commission we receive</li>
                  </ul>
                  <p className="font-medium">No fees are charged unless we successfully arrange finance for you.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Please note the following limitations:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We cannot guarantee that any lender will approve your application</li>
                    <li>Final lending decisions rest with the individual lenders</li>
                    <li>We are not responsible for changes in interest rates or lending criteria</li>
                    <li>Our liability is limited to the amount of fees paid to us</li>
                    <li>We exclude liability for indirect or consequential losses</li>
                    <li>Nothing in these terms limits our liability for death, personal injury, or fraud</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">6. Complaints and Disputes</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have a complaint about our services:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Contact us directly to try to resolve the matter</li>
                    <li>We have 8 weeks to provide a final response</li>
                    <li>If unsatisfied, you can refer your complaint to the Financial Ombudsman Service</li>
                    <li>You may be eligible for compensation from the Financial Services Compensation Scheme</li>
                  </ul>
                  <div className="bg-secondary rounded-lg p-6 space-y-2">
                    <p><strong>Contact Details:</strong></p>
                    <p>Email: complaints@partnershipbridge.co.uk</p>
                    <p>Phone: +447362055683</p>
                    <p>Address: 26 Talbot Road, Albrighton, Wolverhampton, England WV7 3HH</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">7. General Terms</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>These terms are governed by English law</li>
                    <li>Any disputes will be subject to the exclusive jurisdiction of English courts</li>
                    <li>We may update these terms from time to time with notice</li>
                    <li>If any part of these terms is unenforceable, the rest remains valid</li>
                    <li>You may cancel our services at any time before completion</li>
                    <li>We reserve the right to refuse service in our discretion</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;