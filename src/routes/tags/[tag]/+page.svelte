<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>#{data.tag} | austin</title>
</svelte:head>

<section class="archive">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">grep <span class="flag">-r</span> <span class="path">"{data.tag}"</span> ~/ramblings</span>
	</div>
	<ul class="post-list">
		{#each data.posts as post}
			<li class="post-item">
				<time class="post-date" datetime={post.date}>{post.date}</time>
				<a class="post-title-link" href="/ramblings/{post.slug}">{post.title}</a>
			</li>
		{/each}
	</ul>
</section>
