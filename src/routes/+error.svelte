<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>404 | austin</title>
</svelte:head>

<section class="archive">
	<div class="command-line">
		<span class="prompt-char">$</span>
		<span class="command">cat <span class="path">{page.url.pathname}</span></span>
	</div>
	<div class="output" style="padding: 6px 22px 18px 36px;">
		<p class="bio">
			<span style="color: var(--pink);">error:</span> {page.status} — {page.error?.message ?? 'not found'}
		</p>
		<p class="bio">
			<span style="color: var(--text-muted);">try:</span> <a href="/" class="social-link">cd ~</a>
		</p>
	</div>
</section>
