<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { site } from '$lib/config';
	import Terminal from '$lib/components/Terminal.svelte';
	import MatrixRain from '$lib/components/MatrixRain.svelte';

	let { children, data } = $props();

	let booted = $state(true);
	let matrixActive = $state(false);

	const navLinks = [
		{ name: '~', href: '/' },
		{ name: 'ramblings', href: '/ramblings' },
		{ name: 'tags', href: '/tags' }
	];

	const konamiSequence = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'b',
		'a'
	];
	let konamiIndex = $state(0);

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!sessionStorage.getItem('crt-booted')) {
			booted = false;
			sessionStorage.setItem('crt-booted', '1');
			setTimeout(() => {
				booted = true;
			}, 1200);
		}
	});

	$effect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key === konamiSequence[konamiIndex]) {
				konamiIndex++;
				if (konamiIndex === konamiSequence.length) {
					konamiIndex = 0;
					matrixActive = true;
				}
			} else {
				konamiIndex = 0;
			}
		}
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});

	beforeNavigate(() => {
		document.documentElement.classList.add('nav-flicker');
		setTimeout(() => document.documentElement.classList.remove('nav-flicker'), 200);
	});

	function handleDotClick(color: string) {
		if (color === 'pink') {
			document.documentElement.classList.add('glitch-flash');
			setTimeout(() => document.documentElement.classList.remove('glitch-flash'), 350);
		} else if (color === 'cyan') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else if (color === 'purple') {
			matrixActive = !matrixActive;
		}
	}
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<MatrixRain active={matrixActive} onDismiss={() => (matrixActive = false)} />

<div class="scanlines" aria-hidden="true"></div>
<div class="crt" class:crt-booting={!booted}>
	<main class="shell">
		<header class="terminal-header">
			<div class="terminal-bar" aria-hidden="true">
				<button class="dot dot-pink" onclick={() => handleDotClick('pink')} aria-label="Glitch effect"></button>
				<button class="dot dot-cyan" onclick={() => handleDotClick('cyan')} aria-label="Scroll to top"></button>
				<button class="dot dot-purple" onclick={() => handleDotClick('purple')} aria-label="Matrix mode"></button>
				<span class="terminal-title">~/austin — zsh</span>
			</div>
			<nav class="terminal-nav">
				{#each navLinks as link}
					<a
						href={link.href}
						class="nav-link"
						class:active={page.url.pathname === link.href ||
							(link.href !== '/' && page.url.pathname.startsWith(link.href))}
					>
						{link.name}
					</a>
				{/each}
			</nav>
		</header>

		{@render children()}
	</main>
</div>

<Terminal posts={data.posts} onToggleMatrix={() => (matrixActive = !matrixActive)} />
