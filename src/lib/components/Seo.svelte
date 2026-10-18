<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config';

	let {
		title,
		description = site.description,
		type = 'website',
		jsonLd
	}: {
		title?: string;
		description?: string;
		type?: 'website' | 'article' | 'profile';
		jsonLd?: Record<string, unknown>;
	} = $props();

	const fullTitle = $derived(title ? `${title} | ${site.name}` : site.name);
	const url = $derived(site.url + page.url.pathname);
	// escape "<" so post text can't close the script tag early
	const ld = $derived(
		jsonLd ? JSON.stringify({ '@context': 'https://schema.org', ...jsonLd }).replace(/</g, '\\u003c') : ''
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.name} />
	<link rel="canonical" href={url} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	{#if ld}
		{@html `<script type="application/ld+json">${ld}</script>`}
	{/if}
</svelte:head>
