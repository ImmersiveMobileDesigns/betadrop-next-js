import Link from "next/link";
import {
  Zap,
  FileBox,
  Shield,
  Smartphone,
  Search,
  History,
  RotateCcw,
  Clock,
  Users,
  MessageSquare,
  BarChart3,
  MonitorSmartphone,
  LinkIcon,
  Palette,
  Lock,
  TrendingUp,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  benefit: string;
  icon: LucideIcon;
  iconColor: string;
  iconGradient: string;
}

interface FeatureCategory {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  gradient: string;
  borderHover: string;
  badgeColor: string;
  badgeBorder: string;
  badgeText: string;
  features: Feature[];
}

const featureCategories: FeatureCategory[] = [
  {
    title: "Smart Build Intelligence",
    icon: FileBox,
    iconColor: "text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderHover: "hover:border-blue-500/30",
    badgeColor: "bg-blue-500/10",
    badgeBorder: "border-blue-500/20",
    badgeText: "text-blue-300",
    features: [
      {
        title: "Auto-Detect Everything",
        description:
          "App name, version, build number, bundle ID extracted instantly. 30-day hosting by default.",
        benefit: "Save 2 minutes per upload",
        icon: Search,
        iconColor: "text-blue-400",
        iconGradient: "from-blue-500/20 to-cyan-500/20",
      },
      {
        title: "Build History & Versions",
        description:
          "Track every version with automatic latest/deprecated status. See your entire release timeline.",
        benefit: "Never lose track of builds",
        icon: History,
        iconColor: "text-blue-400",
        iconGradient: "from-blue-500/20 to-cyan-500/20",
      },
      {
        title: "Quick Rollback",
        description:
          "Pushed a bad build? Disable it and re-enable the previous version in one click.",
        benefit: "Fix mistakes in seconds",
        icon: RotateCcw,
        iconColor: "text-blue-400",
        iconGradient: "from-blue-500/20 to-cyan-500/20",
      },
    ],
  },
  {
    title: "Advanced Distribution Controls",
    icon: Shield,
    iconColor: "text-purple-400",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderHover: "hover:border-purple-500/30",
    badgeColor: "bg-purple-500/10",
    badgeBorder: "border-purple-500/20",
    badgeText: "text-purple-300",
    features: [
      {
        title: "Smart Expiry Rules",
        description:
          "Default to 30-Day for your builds, or set custom rules: Time-based, download-limit, or device-limit.",
        benefit: "Control distribution precisely",
        icon: Clock,
        iconColor: "text-purple-400",
        iconGradient: "from-purple-500/20 to-pink-500/20",
      },
      {
        title: "Role-Based Sharing",
        description:
          "Generate separate links for QA, stakeholders, and beta testers. Track who installs what.",
        benefit: "Organize your testers",
        icon: Users,
        iconColor: "text-purple-400",
        iconGradient: "from-purple-500/20 to-pink-500/20",
      },
      {
        title: "Reviewer-Only Links",
        description:
          "Special links with built-in feedback forms. Collect bug reports and suggestions directly.",
        benefit: "Streamline feedback",
        icon: MessageSquare,
        iconColor: "text-purple-400",
        iconGradient: "from-purple-500/20 to-pink-500/20",
      },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: TrendingUp,
    iconColor: "text-orange-400",
    gradient: "from-orange-500/20 to-red-500/20",
    borderHover: "hover:border-orange-500/30",
    badgeColor: "bg-orange-500/10",
    badgeBorder: "border-orange-500/20",
    badgeText: "text-orange-300",
    features: [
      {
        title: "Install Analytics",
        description:
          "Downloads, unique devices, install success/failure rates, and geographic distribution per build.",
        benefit: "Know your reach",
        icon: BarChart3,
        iconColor: "text-orange-400",
        iconGradient: "from-orange-500/20 to-red-500/20",
      },
      {
        title: "Device Type Breakdown",
        description:
          "See which iOS/Android versions, device models, and screen sizes your testers use.",
        benefit: "Optimize for real devices",
        icon: MonitorSmartphone,
        iconColor: "text-orange-400",
        iconGradient: "from-orange-500/20 to-red-500/20",
      },
      {
        title: "Claim Guest Uploads",
        description:
          "Uploaded as guest before? Sign in and claim those builds to get full analytics retroactively.",
        benefit: "Never lose your data",
        icon: LinkIcon,
        iconColor: "text-orange-400",
        iconGradient: "from-orange-500/20 to-red-500/20",
      },
    ],
  },
  {
    title: "Customization & Polish",
    icon: Smartphone,
    iconColor: "text-pink-400",
    gradient: "from-pink-500/20 to-rose-500/20",
    borderHover: "hover:border-pink-500/30",
    badgeColor: "bg-pink-500/10",
    badgeBorder: "border-pink-500/20",
    badgeText: "text-pink-300",
    features: [
      {
        title: "Custom Install Pages",
        description:
          "Upload your logo, choose accent colors, and add custom messaging. Make install pages feel like yours.",
        benefit: "Professional branding",
        icon: Palette,
        iconColor: "text-pink-400",
        iconGradient: "from-pink-500/20 to-rose-500/20",
      },
      {
        title: "Private by Default",
        description:
          "All builds are unlisted. Only people with the link can access. Enable/disable builds anytime.",
        benefit: "Total control",
        icon: Lock,
        iconColor: "text-pink-400",
        iconGradient: "from-pink-500/20 to-rose-500/20",
      },
    ],
  },
];

export default function DeveloperFeatures() {
  return (
    <div
      id="features"
      className="mt-24 mb-12 scroll-mt-24 max-w-6xl mx-auto px-4"
    >
      <AnimateOnScroll
        animation="fadeUp"
        duration={700}
        threshold={0.2}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-blue-300">
            Power User Features
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Sign In to Unlock{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-shimmer bg-[length:200%_auto]">
            Developer Superpowers
          </span>
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          Guest uploads are perfect for quick sharing. But serious developers
          need serious tools.
          <br />
          <span className="text-white font-medium">
            Sign in once, unlock everything instantly.
          </span>{" "}
          No setup, no onboarding, just power.
        </p>
      </AnimateOnScroll>

      {/* Feature Categories */}
      <div className="space-y-16 max-w-7xl mx-auto">
        {featureCategories.map((category, categoryIndex) => (
          <AnimateOnScroll
            key={categoryIndex}
            animation="fadeUp"
            duration={700}
            delay={categoryIndex * 100}
            threshold={0.15}
          >
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                >
                  <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {category.title}
                </h3>
              </div>

              <div
                className={`grid ${category.features.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}
              >
                {category.features.map((feature, featureIndex) => (
                  <AnimateOnScroll
                    key={featureIndex}
                    animation="fadeUp"
                    duration={600}
                    delay={featureIndex * 80}
                    threshold={0.15}
                    className={`relative group h-full p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 ${category.borderHover} hover:bg-white/[0.08] transition-all duration-300`}
                  >
                    {/* Icon with gradient background */}
                    <div
                      className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <feature.icon
                        className={`w-6 h-6 ${feature.iconColor}`}
                      />
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Benefit badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${category.badgeColor} border ${category.badgeBorder}`}
                    >
                      <Zap className={`w-3 h-3 ${category.iconColor}`} />
                      <span
                        className={`text-xs font-medium ${category.badgeText}`}
                      >
                        {feature.benefit}
                      </span>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Comparison Callout */}
      <AnimateOnScroll
        animation="scaleIn"
        duration={700}
        delay={100}
        threshold={0.2}
        className="mt-20"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Why Developers Choose BetaDrop
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                {
                  name: "TestFlight",
                  desc: "90-day review wait, 100 tester limit, iOS only",
                },
                {
                  name: "Firebase App Distribution",
                  desc: "Complex setup, requires Google account, limited analytics",
                },
                {
                  name: "Diawi",
                  desc: "7-day expiry, no build management, basic features only",
                },
              ].map((competitor, i) => (
                <AnimateOnScroll
                  key={i}
                  animation="fadeUp"
                  duration={500}
                  delay={i * 100}
                  threshold={0.2}
                >
                  <div className="text-white/40 text-sm font-medium mb-2">
                    {competitor.name}
                  </div>
                  <div className="text-white/60 text-sm">{competitor.desc}</div>
                </AnimateOnScroll>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <AnimateOnScroll
                animation="fadeUp"
                duration={600}
                delay={200}
                threshold={0.2}
              >
                <div className="text-xl font-bold text-white mb-2">
                  BetaDrop
                </div>
                <div className="text-white/80">
                  Instant setup, unlimited builds, advanced analytics, full
                  control.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-semibold">
                    All free, forever.
                  </span>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Enhanced CTA */}
      <AnimateOnScroll
        animation="scaleIn"
        duration={700}
        delay={100}
        threshold={0.2}
        className="text-center mt-16"
      >
        <Link
          href="/login"
          className="relative group/btn inline-flex items-center gap-3 px-10 py-4 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-2xl shadow-blue-500/20"
        >
          {/* Animated gradient background */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-shimmer bg-[length:200%_auto]" />
          {/* Shimmer effect on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          {/* Glow */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/50 blur-2xl rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            Sign In & Unlock Everything Instantly
            <svg
              className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </Link>
        <p className="text-white/50 text-sm mt-4">
          No credit card. No setup wizard. Just sign in with Google and start
          shipping.
        </p>
      </AnimateOnScroll>
    </div>
  );
}
