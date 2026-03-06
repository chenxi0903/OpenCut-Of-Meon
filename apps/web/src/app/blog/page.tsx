import type { Metadata } from "next";
import Link from "next/link";
import { BasePage } from "@/app/base-page";
import { Separator } from "@/components/ui/separator";
import { getPosts } from "@/lib/blog/query";
import type { Post } from "@/types/blog";

export const metadata: Metadata = {
	title: "Blog - OpenCut",
	description:
		"Read the latest news and updates about OpenCut, the free and open-source video editor.",
	openGraph: {
		title: "Blog - OpenCut",
		description:
			"Read the latest news and updates about OpenCut, the free and open-source video editor.",
		type: "website",
	},
};

export default async function BlogPage() {
	try {
		const data = await getPosts();
		if (!data || !data.posts || data.posts.length === 0) {
			return (
				<BasePage
					title="Blog"
					description="Read the latest news and updates about OpenCut, the free and open-source video editor."
				>
					<div className="flex flex-col items-center justify-center py-12">
						<p className="text-muted-foreground">No posts available yet.</p>
					</div>
				</BasePage>
			);
		}

		return (
			<BasePage
				title="Blog"
				description="Read the latest news and updates about OpenCut, the free and open-source video editor."
			>
				<div className="flex flex-col">
					{data.posts.map((post) => (
						<div key={post.id} className="flex flex-col">
							<BlogPostItem post={post} />
							<Separator />
						</div>
					))}
				</div>
			</BasePage>
		);
	} catch (error) {
		console.error("Failed to load blog posts:", error);
		return (
			<BasePage
				title="Blog"
				description="Read the latest news and updates about OpenCut, the free and open-source video editor."
			>
				<div className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">
						Unable to load blog posts at this time.
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						Please try again later.
					</p>
				</div>
			</BasePage>
		);
	}
}

function BlogPostItem({ post }: { post: Post }) {
	return (
		<Link href={`/blog/${post.slug}`}>
			<div className="flex h-auto w-full items-center justify-between py-6 opacity-100 hover:opacity-75">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold">{post.title}</h2>
					<p className="text-muted-foreground">{post.description}</p>
				</div>
			</div>
		</Link>
	);
}
