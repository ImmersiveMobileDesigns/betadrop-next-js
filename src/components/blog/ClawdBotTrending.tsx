import Image from "next/image";
import {
  TrendingUp,
  Sparkles,
  Zap,
  Smartphone,
  Globe,
  Shield,
  Bot,
  GitBranch,
  Bug,
  LayoutGrid,
} from "lucide-react";
import { blogPosts } from "@/lib/blog";

interface ClawdBotTrendingProps {
  onTopicSelect?: (topic: string) => void;
}

export default function ClawdBotTrending({
  onTopicSelect,
}: ClawdBotTrendingProps) {
  // Calculate trending topics from blog posts
  const keywordCounts: Record<string, number> = {};

  blogPosts.forEach((post) => {
    // We use secondaryKeywords as tags to determine trends
    const tags = post.secondaryKeywords || [];
    tags.forEach((tag) => {
      // Normalize tag
      const normalizedTag = tag.trim().toLowerCase();
      keywordCounts[normalizedTag] = (keywordCounts[normalizedTag] || 0) + 1;
    });
  });

  // Sort by count descending and take top 9
  const sortedKeywords = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 9);

  // Color palette from original design
  const colors = [
    "from-blue-400 to-cyan-400",
    "from-green-400 to-emerald-400",
    "from-purple-400 to-pink-400",
    "from-orange-400 to-red-400",
    "from-indigo-400 to-violet-400",
    "from-pink-400 to-rose-400",
    "from-teal-400 to-cyan-400",
    "from-red-400 to-orange-400",
    "from-blue-500 to-indigo-500",
  ];

  // Helper to pick icon based on keyword content
  const getIconForTopic = (keyword: string) => {
    const k = keyword.toLowerCase();
    if (
      k.includes("ios") ||
      k.includes("android") ||
      k.includes("mobile") ||
      k.includes("app")
    )
      return Smartphone;
    if (
      k.includes("test") ||
      k.includes("qa") ||
      k.includes("bug") ||
      k.includes("crash")
    )
      return Bug;
    if (k.includes("ai") || k.includes("bot") || k.includes("intelligence"))
      return Bot;
    if (k.includes("security") || k.includes("privacy") || k.includes("auth"))
      return Shield;
    if (k.includes("global") || k.includes("world")) return Globe;
    if (k.includes("cicd") || k.includes("devops") || k.includes("pipeline"))
      return GitBranch;
    if (k.includes("distribut") || k.includes("release")) return Zap;
    if (k.includes("tool") || k.includes("platform")) return LayoutGrid;
    return Sparkles;
  };

  const trendingTopics = sortedKeywords.map(([label, count], index) => {
    return {
      id: index + 1,
      // Title Case the label
      label: label
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      icon: getIconForTopic(label),
      color: colors[index % colors.length],
      count: `+${count} posts`,
    };
  });

  return (
    <section className="py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            {/* Robot Mascot Section */}
            <div className="lg:w-1/3 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
                <div className="relative w-full h-full rounded-full border-2 border-white/10 bg-black/40 overflow-hidden shadow-2xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300">
                  <Image
                    src="/images/clawdbot_mascot.png"
                    alt="ClawdBot AI"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black/80 border border-white/10 p-2 rounded-xl backdrop-blur-md shadow-lg">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-bounce" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                ClawdBot<span className="text-primary-400">.AI</span> Insights
              </h2>
              <p className="text-white/60 mb-6">
                Analyzing trends to bring you the top topics in mobile
                development this week.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-primary-300 font-medium tracking-wide uppercase">
                <TrendingUp className="w-3 h-3" />
                Live Trends
              </div>
            </div>

            {/* Trending Topics Grid */}
            <div className="lg:w-2/3 w-full">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-primary-400 to-purple-400 rounded-full" />
                Trending Topics This Week
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onTopicSelect?.(topic.label)}
                    className="group relative flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-left"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                    />

                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`p-2 rounded-lg bg-white/5 text-white group-hover:bg-white/10 transition-colors`}
                      >
                        <topic.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-medium text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                        {topic.count}
                      </span>
                    </div>

                    <span className="text-white font-medium group-hover:text-primary-300 transition-colors">
                      {topic.label}
                    </span>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <TrendingUp className="w-4 h-4 text-white/40" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
