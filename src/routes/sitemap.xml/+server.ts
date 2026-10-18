import { site } from '$lib/config';
import { getPosts } from '$lib/posts';

export const prerender = true;

export async function GET() {
	const posts = await getPosts();
	const tags = [...new Set(posts.flatMap((p) => p.tags ?? []))];

	const urls: { loc: string; lastmod?: string }[] = [
		{ loc: '/' },
		{ loc: '/about/' },
		{ loc: '/ramblings/' },
		{ loc: '/tags/' },
		...posts.map((p) => ({ loc: `/ramblings/${p.slug}/`, lastmod: p.date })),
		...tags.map((t) => ({ loc: `/tags/${t}/` }))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) =>
			`  <url><loc>${site.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
