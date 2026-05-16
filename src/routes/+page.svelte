<script lang="ts">
	import { site } from '$lib/config';
	let { data } = $props();

	const bars = [
		{ h: 25, c: '--pink', d: 0 },
		{ h: 40, c: '--cyan', d: 0.2 },
		{ h: 30, c: '--purple', d: 0.4 },
		{ h: 55, c: '--pink', d: 0.1 },
		{ h: 22, c: '--amber', d: 0.6 },
		{ h: 65, c: '--cyan', d: 0.3 },
		{ h: 35, c: '--purple', d: 0.5 },
		{ h: 50, c: '--pink', d: 0.15 },
		{ h: 28, c: '--cyan', d: 0.45 },
		{ h: 70, c: '--purple', d: 0.25 },
		{ h: 38, c: '--pink', d: 0.55 },
		{ h: 58, c: '--cyan', d: 0.35 },
		{ h: 20, c: '--amber', d: 0.1 },
		{ h: 45, c: '--purple', d: 0.4 },
		{ h: 32, c: '--pink', d: 0.5 },
		{ h: 62, c: '--cyan', d: 0.2 },
		{ h: 42, c: '--purple', d: 0.3 },
		{ h: 18, c: '--pink', d: 0.6 },
	];
</script>

<section class="whoami">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">neofetch</span>
	</div>
	<div class="neofetch-layout">
		<div class="eq-visualizer" aria-hidden="true">
			{#each bars as bar}
				<div
					class="eq-bar"
					style="height: {bar.h}px; --bar-color: var({bar.c}); animation-delay: {bar.d}s;"
				></div>
			{/each}
		</div>
		<div class="neofetch-info">
			<p class="nf-header">
				<span class="nf-user">root</span><span class="nf-at">@</span><span class="nf-host"
					>caffeine-machine</span
				>
			</p>
			<p class="nf-divider">──────────────────────</p>
			<p class="nf-row"><span class="nf-label">OS:</span> <span class="nf-val">mass-produced anxiety (darwin x86_64)</span></p>
			<p class="nf-row"><span class="nf-label">Host:</span> <span class="nf-val">apriendeau.com</span></p>
			<p class="nf-row"><span class="nf-label">Shell:</span> <span class="nf-val">zsh + emacs</span></p>
			<p class="nf-row"><span class="nf-label">Groups:</span> <span class="nf-val">engineer, parent</span></p>
			<p class="nf-row">
				<span class="nf-label">uid</span>=<span class="id-value">1000(austin)</span>
				<span class="nf-label">gid</span>=<span class="id-value">1000(autism,adhd)</span>
			</p>
			<p class="nf-bio">{site.description}</p>
			<div class="nf-palette">
				<span class="nf-c1">██</span><span class="nf-c2">██</span><span class="nf-c3">██</span><span
					class="nf-c4">██</span
				><span class="nf-c5">██</span><span class="nf-c6">██</span><span class="nf-c7">██</span>
			</div>
		</div>
	</div>
</section>

<section class="posts">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">ls -la <span class="flag">~/ramblings</span></span>
	</div>
	<ul class="post-list">
		{#each data.posts as post}
			<li class="post-item">
				<time class="post-date" datetime={post.date}>{post.date}</time>
				<a class="post-title-link" href="/ramblings/{post.slug}">{post.title}</a>
			</li>
		{/each}
	</ul>
	{#if data.posts.length >= 10}
		<p class="more-link"><a href="/ramblings">&rsaquo; see all posts</a></p>
	{/if}
</section>

<section class="projects">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">ls -la <span class="flag">~/projects</span></span>
	</div>
	<ul class="project-list">
		{#each site.projects as project}
			<li class="project-item">
				<a href={project.url} class="project-name" target="_blank" rel="noopener">{project.name}</a>
				<span class="project-lang">{project.lang}</span>
				<span class="project-desc">{project.desc}</span>
			</li>
		{/each}
	</ul>
</section>
