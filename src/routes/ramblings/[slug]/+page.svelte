<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title} | austin</title>
</svelte:head>

<article class="post">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">cat <span class="flag">{data.post.slug}.md</span></span>
	</div>
	<header class="post-header">
		<h1 class="post-heading">{data.post.title}</h1>
		<div class="post-meta">
			<time datetime={data.post.date}>{data.post.date}</time>
			{#if data.post.tags?.length}
				<span class="tags">
					{#each data.post.tags as tag}
						<a class="tag" href="/tags/{tag}">#{tag}</a>
					{/each}
				</span>
			{/if}
		</div>
	</header>
	<div class="post-content">
		<data.post.content />
	</div>
	<nav class="post-nav">
		{#if data.prev}
			<a class="prev" href="/ramblings/{data.prev.slug}">&lsaquo; {data.prev.title}</a>
		{/if}
		{#if data.next}
			<a class="next" href="/ramblings/{data.next.slug}">{data.next.title} &rsaquo;</a>
		{/if}
	</nav>
</article>
