import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
	themes: ['vitesse-black'],
	langs: ['javascript', 'typescript', 'shell', 'bash', 'go', 'rust', 'ruby', 'toml', 'yaml', 'json', 'markdown', 'html', 'css', 'python', 'dockerfile', 'graphql', 'sql', 'plaintext']
});

// mdsvex still emits `<script context="module">` for frontmatter, which Svelte 5
// deprecated in favour of `<script module>`. Rewrite it after mdsvex runs.
const moduleScript = {
	name: 'mdsvex-module-script',
	markup: ({ content, filename }) => {
		if (!filename?.endsWith('.md')) return;
		return { code: content.replace(/<script context="module">/g, '<script module>') };
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			highlight: {
				highlighter: (code, lang) => {
					const html = highlighter.codeToHtml(code, {
						lang: lang || 'plaintext',
						theme: 'vitesse-black'
					});
					return `{@html \`${html.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`;
				}
			}
		}),
		moduleScript
	],
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			handleMissingId: 'warn'
		}
	}
};

export default config;
