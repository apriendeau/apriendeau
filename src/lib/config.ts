export const site = {
	title: 'austin',
	description:
		'Autistic, ADHD, part-time yeller at LLMs. Full-time keeper of two tiny humans.',
	url: 'https://www.apriendeau.com',
	social: [
		{ name: 'github', link: 'https://github.com/apriendeau' },
		{ name: 'linkedin', link: 'https://www.linkedin.com/in/apriendeau' }
	],
	projects: [
		{
			name: 'nidus',
			desc: 'latin for nest. a light, embeddable vector search born of spite.',
			url: 'https://nidus.duckedup.org',
			lang: 'Rust'
		},
		{
			name: 'wdpkr',
			desc: 'like a woodpecker — rapidly scans surfaces, taps methodically, finds the exact thing hidden inside a huge noisy structure',
			url: 'https://wdpkr.duckedup.org',
			lang: 'Rust'
		},
		{
			name: 'phx',
			desc: 'it was already on fire. we just gave it wings.',
			url: 'https://github.com/duckedup/phx',
			lang: 'Rust'
		},
		{
			name: 'linear-mg',
			desc: 'a linear cli and importable library',
			url: 'https://github.com/duckedup/linear-mg',
			lang: 'Rust'
		},
		{
			name: 'notion-mg',
			desc: 'notion management tooling',
			url: 'https://github.com/duckedup/notion-mg',
			lang: 'Rust'
		}
	]
} as const;
