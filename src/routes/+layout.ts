import { getPosts } from '$lib/posts';

export const prerender = true;
// emit dir/index.html so GitHub Pages serves both /x and /x/ (old Hugo URLs had the slash)
export const trailingSlash = 'always';

export async function load() {
	const posts = await getPosts();
	return { posts };
}
