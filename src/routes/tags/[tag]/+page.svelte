<script lang="ts">
	import { site } from '$lib/config';
	import Seo from '$lib/components/Seo.svelte';
	let { data } = $props();
</script>

<Seo title="#{data.tag}" description="Posts by {site.name} tagged #{data.tag}." />

<section class="archive">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">grep <span class="flag">-r</span> <span class="path">"{data.tag}"</span> ~/ramblings</span>
	</div>
	<ul class="post-list">
		{#each data.posts as post}
			<li class="post-item">
				<time class="post-date" datetime={post.date}>{post.date}</time>
				<a class="post-title-link" href="/ramblings/{post.slug}/">{post.title}</a>
			</li>
		{/each}
	</ul>
</section>
