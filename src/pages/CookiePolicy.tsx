import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Settings, Eye, Shield, Trash2, HelpCircle } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Cookie Policy
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in">
              This policy explains how Partnership Bridge Limited uses cookies and similar technologies 
              on our website to enhance your browsing experience.
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

      {/* Cookie Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">1. What Are Cookies?</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Cookies are small text files that are placed on your computer, tablet, or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide a better user experience.</p>
                  <p>Cookies allow websites to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Improve website functionality and performance</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Analyze website traffic and user behavior</li>
                    <li>Enable social media features</li>
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
                  <h2 className="text-2xl font-bold">2. Types of Cookies We Use</h2>
                </div>
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Essential Cookies</h3>
                    <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Session management</li>
                      <li>Security features</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Performance Cookies</h3>
                    <p>These cookies collect information about how visitors use our website, helping us improve its performance and user experience.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Google Analytics</li>
                      <li>Page load time monitoring</li>
                      <li>Error tracking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Functional Cookies</h3>
                    <p>These cookies remember your preferences and choices to provide a more personalized experience.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Language preferences</li>
                      <li>Form data retention</li>
                      <li>User interface customization</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Marketing Cookies</h3>
                    <p>These cookies track your online activity to help us deliver more relevant advertising and measure campaign effectiveness.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Google Ads tracking</li>
                      <li>Social media pixels</li>
                      <li>Conversion tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">3. Third-Party Cookies</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use third-party services that may place cookies on your device:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Google Analytics</h4>
                      <p className="text-sm">Helps us understand website usage and improve user experience</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Google Ads</h4>
                      <p className="text-sm">Enables conversion tracking and remarketing campaigns</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Social Media</h4>
                      <p className="text-sm">Facebook, LinkedIn, and Twitter integration features</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Live Chat</h4>
                      <p className="text-sm">Customer support chat functionality</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">4. Managing Your Cookie Preferences</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have several options for managing cookies:</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Browser Settings</h3>
                    <p>Most browsers allow you to control cookies through their settings. You can:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Block all cookies</li>
                      <li>Block third-party cookies only</li>
                      <li>Delete existing cookies</li>
                      <li>Set up notifications when cookies are placed</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Cookie Banner</h3>
                    <p>When you first visit our website, you can choose which types of cookies to accept through our cookie banner. You can change these preferences at any time.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Opt-Out Tools</h3>
                    <p>You can opt out of specific tracking services:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                      <li>Google Ads: <a href="https://www.google.com/settings/ads" className="text-primary hover:underline">Ad Settings</a></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">5. How to Delete Cookies</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Instructions for deleting cookies in popular browsers:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Chrome</h4>
                      <p className="text-sm">Settings → Privacy and Security → Clear Browsing Data</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Firefox</h4>
                      <p className="text-sm">Options → Privacy & Security → Clear Data</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Safari</h4>
                      <p className="text-sm">Preferences → Privacy → Manage Website Data</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Edge</h4>
                      <p className="text-sm">Settings → Privacy & Security → Clear Browsing Data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">6. Contact Us</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about our use of cookies, please contact us:</p>
                  <div className="bg-secondary rounded-lg p-6 space-y-2">
                    <p><strong>Partnership Bridge Limited</strong></p>
                    <p>26 Talbot Road, Albrighton, Wolverhampton, England WV7 3HH</p>
                    <p>Email: privacy@partnershipbridge.co.uk</p>
                    <p>Phone: +447362055683</p>
                  </div>
                  <p>We may update this Cookie Policy from time to time. When we do, we will post the updated policy on this page and update the "Last Updated" date.</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;