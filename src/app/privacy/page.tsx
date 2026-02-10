import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Lock, Cookie, Globe, Bell, Users, Mail, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how BetaDrop protects your privacy. We are committed to transparency about data collection, storage, and your rights as a user.',
  openGraph: {
    title: 'Privacy Policy | BetaDrop',
    description: 'Privacy policy and data protection practices for BetaDrop platform.',
  },
  alternates: {
    canonical: '/privacy',
  },
};

const sections = [
  {
    id: 'overview',
    title: '1. Privacy Overview',
    icon: Shield,
    content: `At BetaDrop, we believe in **privacy by design**. This Privacy Policy explains how we collect, use, and protect your information when you use our beta app distribution platform.

**Our Commitment**
• We collect only essential data needed to provide our services
• We never sell your personal information to third parties
• We use industry-standard security measures to protect your data
• We give you control over your information

This policy applies to all users of BetaDrop, including developers, testers, and website visitors.`,
  },
  {
    id: 'information-collected',
    title: '2. Information We Collect',
    icon: Database,
    content: `**Information You Provide**
• **Account Information**: Email address and password when you register
• **Profile Data**: Optional display name and organization details
• **Uploaded Content**: Application files (.ipa, .apk) and associated metadata
• **Communications**: Messages you send to our support team

**Automatically Collected Information**
• **Device Information**: Browser type, operating system, and device identifiers
• **Usage Data**: Pages visited, features used, and interaction patterns
• **Log Data**: IP addresses, access times, and referring URLs
• **Analytics**: Aggregated platform usage statistics

**Information from Third Parties**
• Authentication providers if you use social login (e.g., GitHub)
• Payment processors for transaction records (if applicable)`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    icon: Eye,
    content: `We use collected information for the following purposes:

**Service Delivery**
• Hosting and distributing your applications to testers
• Generating secure installation links and managing your builds
• Providing account management and user authentication
• Processing file uploads and serving download requests

**Platform Improvement**
• Analyzing usage patterns to improve features and performance
• Identifying and fixing bugs or security issues
• Developing new features based on user behavior insights

**Communication**
• Sending essential service notifications (upload confirmations, errors)
• Responding to support requests and inquiries
• Sharing important updates about our terms or policies
• Marketing communications (only with your explicit consent)

**Security & Compliance**
• Detecting and preventing fraud, abuse, or unauthorized access
• Enforcing our Terms of Service
• Complying with legal obligations and requests`,
  },
  {
    id: 'data-sharing',
    title: '4. Data Sharing & Disclosure',
    icon: Users,
    content: `**We Do Not Sell Your Data**
BetaDrop does not sell, rent, or trade your personal information to third parties for marketing purposes.

**When We May Share Information**
• **With Your Consent**: When you explicitly authorize sharing
• **Testers**: Your apps are shared with users who have the install link
• **Service Providers**: Trusted third parties who help operate our platform (hosting, analytics, email delivery)
• **Legal Requirements**: When required by law, subpoena, or legal process
• **Business Transfers**: In case of merger, acquisition, or sale of assets
• **Safety**: To protect rights, safety, or property of BetaDrop or users

**Third-Party Services**
Our platform may integrate with:
• Cloud storage providers for file hosting
• Analytics services (aggregated, non-identifying data)
• Email delivery services for notifications
• Authentication providers for secure login`,
  },
  {
    id: 'data-security',
    title: '5. Data Security',
    icon: Lock,
    content: `We implement comprehensive security measures to protect your information:

**Technical Safeguards**
• **Encryption**: All data transmitted via TLS/SSL encryption
• **Secure Storage**: Application files stored on encrypted servers
• **Access Controls**: Role-based access with principle of least privilege
• **Authentication**: Secure password hashing and optional 2FA

**Operational Security**
• Regular security audits and vulnerability assessments
• Incident response procedures for potential breaches
• Employee training on data protection practices
• Secure development lifecycle for our platform

**Your Role**
• Use strong, unique passwords for your account
• Never share your login credentials
• Report suspicious activity immediately
• Keep your devices and browsers updated

While we strive to protect your data, no system is 100% secure. We encourage responsible use and prompt reporting of any concerns.`,
  },
  {
    id: 'cookies',
    title: '6. Cookies & Tracking',
    icon: Cookie,
    content: `**What Are Cookies?**
Cookies are small text files stored on your device that help us provide and improve our services.

**Cookies We Use**
• **Essential Cookies**: Required for authentication, security, and core functionality
• **Preference Cookies**: Remember your settings and preferences
• **Analytics Cookies**: Help us understand how users interact with our platform

**Third-Party Cookies**
Some features may use cookies from:
• Analytics services (e.g., for usage statistics)
• Authentication providers (for secure login)

**Managing Cookies**
You can control cookies through your browser settings:
• Block all cookies (may affect site functionality)
• Delete cookies after each session
• Allow only first-party cookies

**Do Not Track**
We respect "Do Not Track" browser signals where technically feasible. When enabled, we limit non-essential tracking.`,
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    icon: Database,
    content: `**Retention Periods**
• **Guest Uploads**: Files automatically deleted after 3 days
• **Registered User Content**: Retained for 30 days or until you delete them
• **Account Data**: Kept while your account is active
• **Log Data**: Typically retained for 90 days for security analysis
• **Analytics**: Aggregated statistics retained indefinitely (no personal data)

**After Account Deletion**
When you delete your account:
• Personal data removed within 30 days
• Uploaded applications deleted permanently
• Backup copies may persist for up to 90 days
• Anonymized analytics data may be retained

**Legal Retention**
We may retain certain data longer if required by law or for legitimate business purposes (e.g., fraud prevention, legal claims).`,
  },
  {
    id: 'your-rights',
    title: '8. Your Privacy Rights',
    icon: CheckCircle,
    content: `Depending on your location, you may have the following rights:

**Access & Portability**
• Request a copy of the personal data we hold about you
• Receive your data in a commonly used, machine-readable format
• Transfer your data to another service provider

**Correction & Deletion**
• Update or correct inaccurate personal information
• Request deletion of your personal data ("right to be forgotten")
• Delete specific uploads or your entire account

**Control**
• Object to certain types of data processing
• Restrict processing of your information
• Withdraw consent for optional data uses
• Opt out of marketing communications

**How to Exercise Your Rights**
• Use in-app settings for immediate actions
• Email us at support@betadrop.app for complex requests
• We'll respond within 30 days (or as required by applicable law)

**Verification**
We may need to verify your identity before processing certain requests to protect your privacy.`,
  },
  {
    id: 'international',
    title: '9. International Data Transfers',
    icon: Globe,
    content: `**Global Operations**
BetaDrop may process data on servers located in various countries. By using our service, you consent to the transfer of your information to countries that may have different data protection laws.

**Safeguards**
When transferring data internationally, we implement appropriate safeguards:
• Standard contractual clauses approved by regulatory authorities
• Data processing agreements with our service providers
• Privacy Shield certification where applicable

**European Users (GDPR)**
If you're located in the European Economic Area (EEA), we:
• Process data based on legitimate interests, consent, or contractual necessity
• Provide a lawful basis for each processing activity
• Honor your rights under GDPR

**California Users (CCPA)**
California residents have additional rights:
• Right to know what personal information is collected
• Right to request deletion of personal information
• Right to opt out of "sale" of personal information (we don't sell data)
• Right to non-discrimination for exercising your rights`,
  },
  {
    id: 'children',
    title: '10. Children\'s Privacy',
    icon: Users,
    content: `**Age Requirement**
BetaDrop is not intended for use by children under 16 years of age. We do not knowingly collect personal information from children under 16.

**Parental Responsibility**
Parents and guardians should supervise their children's online activities and ensure they do not provide personal information without consent.

**Discovery of Child Data**
If we learn that we have collected personal information from a child under 16:
• We will delete the information promptly
• We may suspend the associated account
• We may implement additional verification measures

**Reporting**
If you believe a child has provided us with personal information, please contact us immediately at support@betadrop.app.`,
  },
  {
    id: 'updates',
    title: '11. Policy Updates',
    icon: Bell,
    content: `**Changes to This Policy**
We may update this Privacy Policy periodically to reflect:
• New features or services
• Changes in legal requirements
• Improvements to our privacy practices
• Feedback from users and regulators

**Notification of Changes**
When we make significant changes:
• We'll update the "Last Updated" date at the top
• We'll notify registered users via email
• We may display a notice on our website
• Material changes take effect 30 days after posting

**Your Continued Use**
Your continued use of BetaDrop after policy updates constitutes acceptance of the revised policy. If you disagree with changes, you should stop using our services and delete your account.`,
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    icon: Mail,
    content: `If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:

**Primary Contact**
Email: support@betadrop.app

**Response Time**
We aim to respond to all privacy-related inquiries within 48-72 business hours.

**Data Protection Inquiries**
For specific data protection requests (access, deletion, correction), please include:
• Your account email address
• A clear description of your request
• Any supporting documentation

**Complaints**
If you're unsatisfied with our response, you may have the right to lodge a complaint with your local data protection authority.

**Updates**
This privacy policy was last updated in January 2026. Check back periodically for revisions.`,
  },
];

const highlights = [
  { icon: Shield, title: 'Privacy First', desc: 'We never sell your data' },
  { icon: Lock, title: 'Encrypted', desc: 'TLS/SSL protection' },
  { icon: Eye, title: 'Transparent', desc: 'Clear data practices' },
  { icon: CheckCircle, title: 'Your Control', desc: 'Delete anytime' },
];

export default function PrivacyPage() {
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
          <AnimateOnScroll animation="fadeUp" duration={700} threshold={0.2} className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  Privacy Policy
                </h1>
                <p className="text-white/60 mt-1">
                  Last updated: January 2026
                </p>
              </div>
            </div>
            <p className="text-lg text-white/60 leading-relaxed">
              Your privacy matters to us. This policy explains how BetaDrop collects, uses, and protects your information.
            </p>
          </AnimateOnScroll>

          {/* Privacy Highlights */}
          <AnimateOnScroll animation="fadeUp" duration={600} delay={50} threshold={0.2} className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {highlights.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center group hover:bg-white/[0.05] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-white/50 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
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
                    className="flex items-center gap-2 text-white/60 hover:text-emerald-400 transition-colors py-1.5 text-sm"
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
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/5">
                      <section.icon className="w-5 h-5 text-emerald-400" />
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
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/10 text-center">
              <p className="text-white/60 text-sm">
                By using BetaDrop, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Link 
                  href="/terms" 
                  className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                >
                  Terms & Conditions →
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
