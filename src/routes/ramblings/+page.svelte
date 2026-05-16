<script lang="ts">
	let { data } = $props();

	const postsByYear = $derived.by(() => {
		const groups: Record<string, typeof data.posts> = {};
		for (const post of data.posts) {
			const year = post.date.slice(0, 4);
			(groups[year] ??= []).push(post);
		}
		return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
	});
</script>

<svelte:head>
	<title>ramblings | austin</title>
</svelte:head>

<section class="archive">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">ls <span class="flag">-R</span> <span class="path">~/ramblings</span></span>
	</div>
	<ul class="post-list archive-list">
		{#each postsByYear as [year, posts]}
			<li class="year-divider"><span class="comment"># {year}/</span></li>
			{#each posts as post}
				<li class="post-item">
					<time class="post-date" datetime={post.date}>{post.date}</time>
					<a class="post-title-link" href="/ramblings/{post.slug}">{post.title}</a>
				</li>
			{/each}
		{/each}
	</ul>
</section>
