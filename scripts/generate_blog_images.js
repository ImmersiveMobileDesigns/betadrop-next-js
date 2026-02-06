const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), 'public/images/blog');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const templates = [
  { file: 'overcome_testflight_limits.svg', title: 'TestFlight Limits', colors: ['#4F46E5', '#7C3AED'], icon: '🚀' },
  { file: 'beta_feedback_best_practices.svg', title: 'Feedback Best Practices', colors: ['#059669', '#10B981'], icon: '💬' },
  { file: 'cross_platform_beta.svg', title: 'Cross-Platform Beta', colors: ['#EA580C', '#F97316'], icon: '📱' },
  { file: 'distribute_without_testflight.svg', title: 'No TestFlight Needed', colors: ['#2563EB', '#3B82F6'], icon: '📲' },
  { file: 'free_beta_platforms.svg', title: 'Free Beta Platforms', colors: ['#0891B2', '#06B6D4'], icon: '🆓' },
  { file: 'ota_ipa_install.svg', title: 'OTA IPA Install', colors: ['#7C3AED', '#8B5CF6'], icon: '☁️' },
  { file: 'share_android_apk.svg', title: 'Share Android APK', colors: ['#16A34A', '#22C55E'], icon: '🤖' },
  { file: 'testflight_alternatives.svg', title: 'TestFlight Alternatives', colors: ['#0284C7', '#0EA5E9'], icon: '🔄' },
  { file: 'apk_vs_playstore.svg', title: 'APK vs Play Store', colors: ['#475569', '#64748B'], icon: '⚖️' },
  { file: 'instant_beta_delivery.svg', title: 'Instant Delivery', colors: ['#DC2626', '#EF4444'], icon: '⚡' },
  { file: 'secure_no_login.svg', title: 'Secure No-Login', colors: ['#1E293B', '#334155'], icon: '🔒' },
  { file: 'internal_startup.svg', title: 'Startup Distribution', colors: ['#4338CA', '#6366F1'], icon: '🏢' },
  { file: 'common_mistakes.svg', title: 'Common Mistakes', colors: ['#B91C1C', '#DC2626'], icon: '⚠️' },
  { file: 'resign_ipa.svg', title: 'Resign IPA Files', colors: ['#3730A3', '#4F46E5'], icon: '📝' },
  { file: 'find_udid.svg', title: 'Find Device UDID', colors: ['#4B5563', '#6B7280'], icon: '🔍' },
  { file: 'ios_ad_hoc.svg', title: 'iOS Ad Hoc', colors: ['#1D4ED8', '#3B82F6'], icon: '🛠️' },
  { file: 'test_aab.svg', title: 'Test Android Bundles', colors: ['#15803D', '#22C55E'], icon: '📦' },
  { file: 'enterprise_cert.svg', title: 'Enterprise Certs', colors: ['#334155', '#475569'], icon: '🏢' },
  { file: 'website_to_app.svg', title: 'Web to App', colors: ['#0D9488', '#14B8A6'], icon: '🌐' },
  { file: 'sideload_securely.svg', title: 'Sideload Securely', colors: ['#047857', '#10B981'], icon: '🛡️' },
  { file: 'automate_fastlane.svg', title: 'Fastlane Automation', colors: ['#BE185D', '#EC4899'], icon: '🏎️' }
];

function generateSVG({ title, colors, icon }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
    </linearGradient>
    <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#grad)" />
  
  <!-- Decorative Circles -->
  <circle cx="10%" cy="10%" r="200" fill="white" fill-opacity="0.05" />
  <circle cx="90%" cy="90%" r="300" fill="white" fill-opacity="0.05" />
  
  <!-- Glass Card -->
  <rect x="150" y="115" width="900" height="400" rx="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  
  <!-- Content -->
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" fill="white" filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.2))">
    ${icon}
  </text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="white" font-weight="bold" letter-spacing="1">
    ${title.toUpperCase()}
  </text>
  
  <!-- Branding -->
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="rgba(255,255,255,0.6)" font-weight="medium">
    BETADROP.APP
  </text>
</svg>`;
}

templates.forEach(t => {
  const content = generateSVG(t);
  fs.writeFileSync(path.join(outputDir, t.file), content);
  console.log(`Generated ${t.file}`);
});
