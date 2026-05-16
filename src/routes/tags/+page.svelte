<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>tags | austin</title>
</svelte:head>

<section class="archive">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">ls <span class="path">~/tags</span></span>
	</div>
	<ul class="tag-cloud">
		{#each data.tags as tag}
			<li><a href="/tags/{tag.name}">#{tag.name}</a> <span class="tag-count">({tag.count})</span></li>
		{/each}
	</ul>
</section>
