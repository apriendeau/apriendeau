import { getPosts } from '$lib/posts';

export async function load() {
	const posts = await getPosts();
	const tagCounts: Record<string, number> = {};
	for (const post of posts) {
		for (const tag of post.tags ?? []) {
			tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
		}
	}
	const tags = Object.entries(tagCounts)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, count]) => ({ name, count }));
	return { tags };
}
