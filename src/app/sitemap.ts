import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://betadrop.app";

  // Static routes
  const staticRoutes = [
    "",
    "/blog",
    "/login",
    "/privacy",
    "/terms",
    "/contact",
  ];

  // Get all blog posts
  const blogPosts = getAllBlogPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "/blog" ? ("daily" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticSitemap, ...blogRoutes];
}
