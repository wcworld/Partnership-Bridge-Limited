import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Linkedin, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/lovable-uploads/3c9c587e-aeec-4682-834d-62d407a4045f.png" alt="Partnership Bridge" className="w-8 h-8 object-contain invert" />
              </div>
              <div>
                <span className="text-lg font-bold">Partnership Bridge</span>
                <p className="text-xs text-primary-foreground/80">Limited</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Providing high-quality lending advice and finance solutions for individuals and businesses across the UK.
            </p>
            <p className="text-primary-foreground/90 text-sm font-medium border border-primary-foreground/20 rounded-lg p-3 bg-primary-foreground/5">
              Partnership Bridge is a broker, not a lender. We will connect you with a lender suitable for your needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Home
              </Link>
              <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                About Us
              </Link>
              <Link to="/services" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Services
              </Link>
              <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Our Services</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Personal Loans
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Business Financing
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Mortgage Advice
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Investment Solutions
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-foreground/60 mt-0.5" />
                <div className="text-sm text-primary-foreground/80">
                  <p>26 Talbot Road</p>
                  <p>Albrighton, Wolverhampton</p>
                  <p>England WV7 3HH</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80">+44 20 7123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80">info@partnershipbridge.co.uk</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary-foreground/60" />
                <div className="text-sm text-primary-foreground/80">
                  <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Partnership Bridge Limited. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy-policy" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                onClick={() => window.scrollTo(0, 0)}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-service" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                onClick={() => window.scrollTo(0, 0)}
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookie-policy" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                onClick={() => window.scrollTo(0, 0)}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;