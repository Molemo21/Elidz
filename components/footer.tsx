"use client"

import Link from "next/link"
import Image from "next/image"
import { Building2, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/home.png"
                alt="ELIDZ-STP"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              AI-powered platform helping SMMEs discover and apply for funding opportunities across South Africa.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Building2 className="h-4 w-4" />
              <span>Integrated with leading funding systems</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/opportunities" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Funding Opportunities
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/applications" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* System Integration */}
          <div>
            <h3 className="font-semibold text-lg mb-4">System Integration</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/api-docs" className="text-sm text-white/70 hover:text-orange-500 transition-colors flex items-center gap-1">
                  API Documentation
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Third-Party Integrations
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Partner Systems
                </Link>
              </li>
              <li>
                <Link href="/webhooks" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Webhook Configuration
                </Link>
              </li>
              <li>
                <Link href="/sso" className="text-sm text-white/70 hover:text-orange-500 transition-colors">
                  Single Sign-On (SSO)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/70">
                  East London Industrial Development Zone<br />
                  Coega, Eastern Cape, South Africa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <a
                  href="mailto:support@elidz-stp.co.za"
                  className="text-sm text-white/70 hover:text-orange-500 transition-colors"
                >
                  support@elidz-stp.co.za
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <a
                  href="tel:+27431234567"
                  className="text-sm text-white/70 hover:text-orange-500 transition-colors"
                >
                  +27 43 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-white/70 hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/70 hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-white/70 hover:text-orange-500 transition-colors">
                Contact Us
              </Link>
              <Link href="/accessibility" className="text-white/70 hover:text-orange-500 transition-colors">
                Accessibility
              </Link>
            </div>
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} ELIDZ-STP Funding Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

