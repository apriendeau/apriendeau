import { error } from '@sveltejs/kit';
import { getPost, getPosts } from '$lib/posts';

export async function load({ params }) {
	const post = await getPost(params.slug);
	if (!post) throw error(404, 'Post not found');

	const allPosts = await getPosts();
	const idx = allPosts.findIndex((p) => p.slug === params.slug);
	const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
	const next = idx > 0 ? allPosts[idx - 1] : null;

	return { post, prev, next };
}
