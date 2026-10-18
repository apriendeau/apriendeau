<script lang="ts">
	import { site } from '$lib/config';
	import About from '$lib/about.md';
</script>

<svelte:head>
	<title>about | austin</title>
</svelte:head>

<article class="post">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">cat <span class="flag">about.md</span></span>
	</div>
	<div class="post-content">
		<About />
		<p>
			{#each site.social as s, i}
				{#if i > 0}&nbsp;·&nbsp;{/if}<a href={s.link} target="_blank" rel="noopener">{s.name}</a>
			{/each}
		</p>
	</div>
</article>
