import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Globe, Clock, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read the terms and conditions for using BetaDrop beta app distribution platform. Understand your rights and responsibilities.',
  openGraph: {
    title: 'Terms & Conditions | BetaDrop',
    description: 'Terms of service for BetaDrop beta app distribution platform.',
  },
  alternates: {
    canonical: '/terms',
  },
};

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    icon: FileText,
    content: `By accessing or using BetaDrop ("Platform", "Service", "we", "us", or "our"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access or use our services.

These terms apply to all users of the Platform, including developers, testers, and visitors. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of any modifications.`,
  },
  {
    id: 'description',
    title: '2. Service Description',
    icon: Globe,
    content: `BetaDrop provides a platform for distributing iOS (.ipa) and Android (.apk) beta applications to testers through Over-The-Air (OTA) installation. Key features include:

• **File Hosting**: Temporary and permanent hosting for mobile application files
• **Link Generation**: Secure, shareable installation links for testers
• **OTA Installation**: Direct installation on iOS and Android devices without app store involvement
• **Guest Access**: Anonymous uploads with 30-day expiration
• **Developer Accounts**: Registered users receive permanent hosting and additional features

The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.`,
  },
  {
    id: 'user-responsibilities',
    title: '3. User Responsibilities',
    icon: Shield,
    content: `When using BetaDrop, you agree to:

**Lawful Use Only**
• Only upload applications you own or have legal rights to distribute
• Ensure your applications comply with all applicable laws and regulations
• Not distribute malware, spyware, or any malicious software
• Not infringe on intellectual property rights of third parties

**Content Standards**
• Not upload applications containing illegal, harmful, or offensive content
• Not distribute applications that violate privacy or collect user data without consent
• Ensure applications are properly signed with valid certificates (for iOS)
• Not use the Service to circumvent app store guidelines for commercial distribution

**Account Security**
• Maintain the confidentiality of your account credentials
• Notify us immediately of any unauthorized access to your account
• Accept responsibility for all activities under your account`,
  },
  {
    id: 'prohibited-uses',
    title: '4. Prohibited Uses',
    icon: AlertTriangle,
    content: `The following activities are strictly prohibited:

• **Malicious Software**: Uploading viruses, trojans, ransomware, or any code designed to harm devices or steal data
• **Piracy**: Distributing copyrighted applications without authorization
• **Circumvention**: Using our service to bypass app store policies for commercial enterprise distribution
• **Abuse**: Automated scraping, excessive API calls, or denial-of-service attacks
• **Impersonation**: Misrepresenting your identity or affiliation with organizations
• **Spam**: Generating excessive uploads or sharing links in a spammy manner
• **Illegal Content**: Distributing applications that facilitate illegal activities

Violation of these rules may result in immediate account termination and removal of content without notice.`,
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual Property',
    icon: Scale,
    content: `**Your Content**
You retain all ownership rights to the applications and content you upload. By uploading, you grant BetaDrop a limited license to host, distribute, and display your content solely for the purpose of providing the Service.

**Our Content**
The BetaDrop name, logo, website design, and all associated trademarks are our exclusive property. You may not use our branding without written permission.

**Third-Party Content**
We respect intellectual property rights. If you believe content on our platform infringes your rights, please contact us with a detailed DMCA notice at our contact email.

**Open Source**
Certain components of our platform may utilize open-source software, subject to their respective licenses.`,
  },
  {
    id: 'data-storage',
    title: '6. Data Storage & Retention',
    icon: Clock,
    content: `**Guest Uploads**
Files uploaded by non-registered users are stored for 30 days from the upload date. After this period, files and associated data are automatically deleted.

**Registered User Content**
Developers with accounts enjoy permanent hosting. However, we reserve the right to remove inactive content or content that violates our terms.

**Backups & Recovery**
While we implement reasonable backup procedures, we do not guarantee data recovery. Users are responsible for maintaining their own backups of important files.

**Deletion Requests**
You may request deletion of your content at any time. Account deletion requests will result in permanent removal of all associated data within 30 days.`,
  },
  {
    id: 'limitation',
    title: '7. Limitation of Liability',
    icon: AlertTriangle,
    content: `**Disclaimer of Warranties**
THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

**Limitation of Damages**
IN NO EVENT SHALL BETADROP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.

**Maximum Liability**
Our total liability for any claims arising from your use of the Service shall not exceed the amount you paid to us (if any) in the twelve months preceding the claim.

**Indemnification**
You agree to indemnify and hold harmless BetaDrop from any claims, damages, or expenses arising from your use of the Service or violation of these terms.`,
  },
  {
    id: 'termination',
    title: '8. Termination',
    icon: Clock,
    content: `**By You**
You may stop using our Service at any time. Registered users may delete their accounts through account settings or by contacting support.

**By Us**
We reserve the right to suspend or terminate accounts that:
• Violate these Terms and Conditions
• Engage in abusive or fraudulent behavior
• Pose a security risk to our platform or users
• Have been inactive for an extended period

**Effect of Termination**
Upon termination, your right to access the Service ends immediately. We may delete your content and associated data. Provisions that should survive termination (such as limitation of liability) will remain in effect.`,
  },
  {
    id: 'governing-law',
    title: '9. Governing Law & Disputes',
    icon: Scale,
    content: `**Jurisdiction**
These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through appropriate legal channels.

**Dispute Resolution**
Before pursuing legal action, we encourage users to contact us to attempt informal resolution. For formal disputes, arbitration may be required as an alternative to court proceedings.

**Class Action Waiver**
You agree to resolve disputes on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.

**Severability**
If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.`,
  },
  {
    id: 'contact',
    title: '10. Contact Information',
    icon: Mail,
    content: `If you have questions about these Terms & Conditions, please contact us:

**Email**: support@betadrop.app

**Response Time**: We aim to respond to all inquiries within 48-72 business hours.

**Updates**: Major changes to these terms will be announced via email to registered users and posted on this page with an updated "Last Modified" date.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <AnimateOnScroll animation="fadeDown" duration={500} threshold={0.2}>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </AnimateOnScroll>

          {/* Header */}
          <AnimateOnScroll animation="fadeUp" duration={700} threshold={0.2} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  Terms & Conditions
                </h1>
                <p className="text-white/60 mt-1">
                  Last updated: January 2026
                </p>
              </div>
            </div>
            <p className="text-lg text-white/60 leading-relaxed">
              Please read these terms carefully before using BetaDrop. By using our platform, you agree to these terms and conditions.
            </p>
          </AnimateOnScroll>

          {/* Table of Contents */}
          <AnimateOnScroll animation="fadeUp" duration={600} delay={100} threshold={0.2} className="mb-12">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Navigation</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors py-1.5 text-sm"
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <AnimateOnScroll 
                key={section.id}
                animation="fadeUp" 
                duration={600} 
                delay={index * 50}
                threshold={0.1}
              >
                <section
                  id={section.id}
                  className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/15 transition-colors scroll-mt-24"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5">
                      <section.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="text-white/70 leading-relaxed whitespace-pre-line">
                      {section.content.split('\n').map((paragraph, i) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h3 key={i} className="text-white font-semibold mt-4 mb-2 text-base">
                              {paragraph.replace(/\*\*/g, '')}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith('•')) {
                          const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={i} className="ml-4 my-1 text-white/60">
                              {parts.map((part, j) => 
                                part.startsWith('**') && part.endsWith('**') 
                                  ? <strong key={j} className="text-white">{part.replace(/\*\*/g, '')}</strong>
                                  : part
                              )}
                            </p>
                          );
                        }
                        if (paragraph.includes('**')) {
                          const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={i} className="my-2">
                              {parts.map((part, j) => 
                                part.startsWith('**') && part.endsWith('**') 
                                  ? <strong key={j} className="text-white">{part.replace(/\*\*/g, '')}</strong>
                                  : part
                              )}
                            </p>
                          );
                        }
                        return paragraph.trim() ? (
                          <p key={i} className="my-2">{paragraph}</p>
                        ) : null;
                      })}
                    </div>
                  </div>
                </section>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Footer Note */}
          <AnimateOnScroll animation="fadeUp" duration={600} threshold={0.2} className="mt-12">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 text-center">
              <p className="text-white/60 text-sm">
                By using BetaDrop, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Link 
                  href="/privacy" 
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  Privacy Policy →
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-sm text-white/40">
          © {new Date().getFullYear()} BetaDrop. All rights reserved.
        </div>
      </footer>
    </>
  );
}
