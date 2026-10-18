<script lang="ts">
	import { site } from '$lib/config';

	// Static hosting can't send a 301, so old Hugo URLs get a
	// canonical + instant meta refresh, which Google treats as a redirect.
	let { to }: { to: string } = $props();
</script>

<svelte:head>
	<link rel="canonical" href="{site.url}{to}" />
	<meta http-equiv="refresh" content="0; url={to}" />
</svelte:head>

<p class="more-link">moved to <a href={to}>{to}</a></p>
