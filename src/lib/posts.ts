export interface PostMeta {
	title: string;
	date: string;
	tags: string[];
	slug: string;
	description?: string;
}

export interface Post extends PostMeta {
	content: ConstructorOfATypedSvelteComponent;
	description: string;
}

// first paragraph of the post as plain text, for meta descriptions
function excerpt(raw: string, max = 160): string {
	const body = raw.replace(/^---[\s\S]*?---/, '').trim();
	const para = body.split(/\n\s*\n/).find((p) => p.trim() && !/^(#|```|<|!\[)/.test(p.trim())) ?? '';
	const text = para
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`>#]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > max ? text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : text;
}

export async function getPosts(): Promise<PostMeta[]> {
	const modules = import.meta.glob<{ metadata: Omit<PostMeta, 'slug'> }>('/src/lib/posts/*.md');

	const posts: PostMeta[] = [];

	for (const [path, resolver] of Object.entries(modules)) {
		const { metadata } = await resolver();
		const slug = path.split('/').pop()!.replace('.md', '');
		posts.push({ ...metadata, slug });
	}

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return posts;
}

export async function getPost(slug: string): Promise<Post | null> {
	const modules = import.meta.glob<{ default: ConstructorOfATypedSvelteComponent; metadata: Omit<PostMeta, 'slug'> }>('/src/lib/posts/*.md');

	const match = modules[`/src/lib/posts/${slug}.md`];
	if (!match) return null;

	const raw = import.meta.glob<string>('/src/lib/posts/*.md', { query: '?raw', import: 'default' });
	const mod = await match();
	return {
		...mod.metadata,
		slug,
		description: mod.metadata.description ?? excerpt(await raw[`/src/lib/posts/${slug}.md`]()),
		content: mod.default
	};
}
