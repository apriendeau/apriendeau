<script lang="ts">
	import { site } from '$lib/config';
	import About from '$lib/about.md';
	import { person } from '$lib/seo';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="about"
	description="About {site.name}: {site.jobTitle} at {site.worksFor}, software engineer, and writer of ramblings."
	type="profile"
	jsonLd={{ '@type': 'ProfilePage', mainEntity: person }}
/>

<article class="post">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">cat <span class="flag">about.md</span></span>
	</div>
	<div class="post-content">
		<About />
		<p class="about-links">
			{#each site.social as s, i}
				{#if i > 0}&nbsp;·&nbsp;{/if}<a href={s.link} target="_blank" rel="noopener">{s.name}</a>
			{/each}
		</p>
	</div>
</article>
