<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/state';
</script>

<Seo title="404" />

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
