import { SITE_URL } from "@/constants/site-constants";
import { getPosts } from "@/lib/blog/query";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let postPages: MetadataRoute.Sitemap = [];

	try {
		const data = await getPosts();
		postPages =
			data?.posts?.map((post) => ({
				url: `${SITE_URL}/blog/${post.slug}`,
				lastModified: new Date(post.publishedAt),
				changeFrequency: "weekly",
				priority: 0.8,
			})) ?? [];
	} catch (error) {
		console.warn("Failed to fetch blog posts for sitemap:", error);
		// 继续生成 sitemap，只是不包含博客文章
	}

	return [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/contributors`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.5,
		},
		{
			url: `${SITE_URL}/roadmap`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/privacy`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${SITE_URL}/terms`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${SITE_URL}/why-not-capcut`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...postPages,
	];
}
