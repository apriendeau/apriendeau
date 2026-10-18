import { getPosts } from '$lib/posts';

// not linked anywhere, so tell the prerenderer which old URLs to emit
export async function entries() {
	const posts = await getPosts();
	return posts.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	return { slug: params.slug };
}
