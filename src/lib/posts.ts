export interface PostMeta {
	title: string;
	date: string;
	tags: string[];
	slug: string;
}

export interface Post extends PostMeta {
	content: ConstructorOfATypedSvelteComponent;
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

	const mod = await match();
	return {
		...mod.metadata,
		slug,
		content: mod.default
	};
}
