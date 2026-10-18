<script lang="ts">
	import { site } from '$lib/config';
	import Seo from '$lib/components/Seo.svelte';
	let { data } = $props();
</script>

<Seo title="tags" description="Posts by {site.name}, by tag." />

<section class="archive">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">ls <span class="path">~/tags</span></span>
	</div>
	<ul class="tag-cloud">
		{#each data.tags as tag}
			<li><a href="/tags/{tag.name}/">#{tag.name}</a> <span class="tag-count">({tag.count})</span></li>
		{/each}
	</ul>
</section>
