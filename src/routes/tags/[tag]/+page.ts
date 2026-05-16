import { getPosts } from '$lib/posts';

export async function load({ params }) {
	const allPosts = await getPosts();
	const posts = allPosts.filter((p) => p.tags?.includes(params.tag));
	return { tag: params.tag, posts };
}
