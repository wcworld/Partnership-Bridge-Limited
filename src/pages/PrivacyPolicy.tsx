import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, FileText, Users, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              Your privacy is important to us. This policy explains how Partnership Bridge Limited 
              collects, uses, and protects your personal information.
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

      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We collect information to provide you with our financial services. This includes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Personal Information:</strong> Name, address, date of birth, contact details</li>
                    <li><strong>Financial Information:</strong> Income, employment details, credit history, bank statements</li>
                    <li><strong>Technical Information:</strong> IP address, browser type, device information when you use our website</li>
                    <li><strong>Communication Records:</strong> Records of phone calls, emails, and meetings for quality and training purposes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use your personal information for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To assess your financial needs and provide suitable lending solutions</li>
                    <li>To submit applications to appropriate lenders on your behalf</li>
                    <li>To communicate with you about our services and your applications</li>
                    <li>To comply with legal and regulatory requirements</li>
                    <li>To improve our services and website functionality</li>
                    <li>To prevent fraud and ensure security</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">3. Information Sharing</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We may share your information with:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Lenders:</strong> To process your loan applications and provide quotes</li>
                    <li><strong>Credit Reference Agencies:</strong> To check your credit history and verify your identity</li>
                    <li><strong>Regulatory Bodies:</strong> When required by law or regulation</li>
                    <li><strong>Service Providers:</strong> Third parties who help us deliver our services</li>
                    <li><strong>Legal Authorities:</strong> When required by law enforcement or court orders</li>
                  </ul>
                  <p className="font-medium">We never sell your personal information to third parties for marketing purposes.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">4. Data Security</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure servers and databases with restricted access</li>
                    <li>Regular security audits and updates</li>
                    <li>Staff training on data protection best practices</li>
                    <li>Secure disposal of physical and electronic records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">5. Your Rights</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Under GDPR, you have the following rights:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                    <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
                    <li><strong>Right to Object:</strong> Object to certain types of processing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">6. Contact Us</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
                  <div className="bg-secondary rounded-lg p-6 space-y-2">
                    <p><strong>Partnership Bridge Limited</strong></p>
                    <p>26 Talbot Road, Albrighton, Wolverhampton, England WV7 3HH</p>
                    <p>Email: privacy@partnershipbridge.co.uk</p>
                    <p>Phone: +447362055683</p>
                  </div>
                  <p>You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data protection rights have been breached.</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;