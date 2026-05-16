<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { site } from '$lib/config';
	import type { PostMeta } from '$lib/posts';

	interface Props {
		posts: PostMeta[];
		onToggleMatrix: () => void;
	}

	let { posts, onToggleMatrix }: Props = $props();

	let input = $state('');
	let history: string[] = $state([]);
	let historyIndex = $state(-1);
	let output: Array<{ type: string; html: string }> = $state([]);
	let panelOpen = $state(false);
	let hasInteracted = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();
	let panelEl: HTMLDivElement | undefined = $state();
	let startTime = Date.now();

	let path = $derived(() => {
		const p = page.url.pathname;
		return p === '/' ? '~' : '~' + p;
	});

	function esc(s: string): string {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	function push(type: string, html: string) {
		output = [...output, { type, html }];
	}

	function formatUptime(ms: number): string {
		const s = Math.floor(ms / 1000);
		const m = Math.floor(s / 60);
		const h = Math.floor(m / 60);
		if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
		if (m > 0) return `${m}m ${s % 60}s`;
		return `${s}s`;
	}

	function cowTemplate(msg: string): string {
		const maxW = 40;
		const words = msg.split(' ');
		const lines: string[] = [];
		let cur = '';
		for (const w of words) {
			if (cur.length + w.length + 1 > maxW && cur) {
				lines.push(cur);
				cur = w;
			} else {
				cur = cur ? `${cur} ${w}` : w;
			}
		}
		if (cur) lines.push(cur);
		const width = Math.max(...lines.map((l) => l.length));
		const top = '┌' + '─'.repeat(width + 2) + '┐';
		const bot = '└' + '─'.repeat(width + 2) + '┘';
		const body = lines.map((l) => '│ ' + l.padEnd(width) + ' │').join('\n');
		return `${top}\n${body}\n${bot}\n       \\   ^__^\n        \\  (oo)\\_______\n           (__)\\       )\\/\\\n               ||----w |\n               ||     ||`;
	}

	const fortunes = [
		"There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.",
		"It works on my machine. Ship the machine.",
		"Weeks of coding can save you hours of planning.",
		"There's no place like 127.0.0.1",
		"!false — it's funny because it's true.",
		"A SQL query walks into a bar, walks up to two tables and asks 'Can I join you?'",
		"The best code is no code at all.",
		"To understand recursion, you must first understand recursion.",
		"It's not a bug, it's an undocumented feature.",
		"Real programmers count from 0.",
	];

	function neofetchOutput(): string {
		return `<pre class="nf-block"><span class="nf-sun">        ██████████
     ████████████████
   ████████████████████
  ██████████████████████
  ██████████████████████</span>
<span class="nf-hz"> ────────────────────────</span>
<span class="nf-r1">  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</span>     <span class="nf-user">austin</span>@<span class="nf-host">apriendeau.com</span>
<span class="nf-r2">    ─  ─  ─  ─  ─  ─</span>      ──────────────────────
<span class="nf-r3">      ─   ─   ─   ─</span>        <span class="nf-label">OS</span>: synthwave 6.6.6-neon
                            <span class="nf-label">Host</span>: apriendeau.com
                            <span class="nf-label">Kernel</span>: sveltekit 2.x
                            <span class="nf-label">Uptime</span>: ${formatUptime(Date.now() - startTime)}
                            <span class="nf-label">Shell</span>: zsh + emacs
                            <span class="nf-label">Memory</span>: ${posts.length} posts loaded

                            <span class="nf-c1">██</span><span class="nf-c2">██</span><span class="nf-c3">██</span><span class="nf-c4">██</span><span class="nf-c5">██</span><span class="nf-c6">██</span><span class="nf-c7">██</span></pre>`;
	}

	const commands: Record<string, (args: string[]) => void> = {
		help: () => {
			push(
				'out',
				`<span class="t-header">Available commands:</span>
  <span class="t-cmd">help</span>          show this message
  <span class="t-cmd">whoami</span>        display identity
  <span class="t-cmd">neofetch</span>      system information
  <span class="t-cmd">ls</span>            list posts
  <span class="t-cmd">cd</span> <span class="t-arg">&lt;path&gt;</span>    navigate (ramblings, tags, ~)
  <span class="t-cmd">cat</span> <span class="t-arg">&lt;slug&gt;</span>   read a post
  <span class="t-cmd">grep</span> <span class="t-arg">&lt;term&gt;</span>  search posts
  <span class="t-cmd">pwd</span>           print working directory
  <span class="t-cmd">date</span>          current date/time
  <span class="t-cmd">uptime</span>        session uptime
  <span class="t-cmd">echo</span> <span class="t-arg">&lt;msg&gt;</span>    print a message
  <span class="t-cmd">cowsay</span> <span class="t-arg">&lt;msg&gt;</span>  moo
  <span class="t-cmd">fortune</span>       wisdom of the ancients
  <span class="t-cmd">matrix</span>        enter the matrix
  <span class="t-cmd">clear</span>         clear terminal
  <span class="t-cmd">exit</span>          nice try`
			);
		},

		whoami: () => {
			push(
				'out',
				`<span class="id-field">uid</span>=<span class="id-value">1000(austin)</span> <span class="id-field">gid</span>=<span class="id-value">1000(autism,adhd)</span> <span class="id-field">groups</span>=<span class="id-value">1000(engineer),1001(parent)</span>`
			);
		},

		id: (args) => commands.whoami(args),

		ls: () => {
			const lines = posts
				.map(
					(p) =>
						`<span class="t-perm">-rw-r--r--</span>  <span class="t-date">${p.date}</span>  <a href="/ramblings/${p.slug}" class="t-file">${esc(p.slug)}.md</a>`
				)
				.join('\n');
			push('out', lines);
		},

		cd: (args) => {
			const target = args[0];
			if (!target || target === '~' || target === '/') {
				goto('/');
			} else if (target === 'ramblings' || target === '~/ramblings') {
				goto('/ramblings');
			} else if (target === 'tags' || target === '~/tags') {
				goto('/tags');
			} else if (target === '..') {
				const parts = page.url.pathname.split('/').filter(Boolean);
				parts.pop();
				goto('/' + parts.join('/') || '/');
			} else {
				push('err', `cd: no such directory: ${esc(target)}`);
				return;
			}
			push('out', '');
		},

		cat: (args) => {
			const slug = args[0]?.replace('.md', '');
			if (!slug) {
				push('err', 'cat: missing operand');
				return;
			}
			const post = posts.find((p) => p.slug === slug);
			if (post) {
				goto(`/ramblings/${post.slug}`);
				push('out', '');
			} else {
				push('err', `cat: ${esc(args[0])}: No such file or directory`);
			}
		},

		grep: (args) => {
			const query = args
				.filter((a) => !a.startsWith('-'))
				.join(' ')
				.toLowerCase();
			if (!query) {
				push('err', 'grep: missing search pattern');
				return;
			}
			const matches = posts.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.tags?.some((t) => t.toLowerCase().includes(query))
			);
			if (matches.length === 0) {
				push('out', `(no matches for "${esc(query)}")`);
			} else {
				push(
					'out',
					matches
						.map(
							(p) =>
								`<a href="/ramblings/${p.slug}" class="t-file">${esc(p.slug)}.md</a>: <span class="t-match">${esc(p.title)}</span>`
						)
						.join('\n')
				);
			}
		},

		pwd: () => {
			const p = page.url.pathname;
			push('out', p === '/' ? '/home/austin' : '/home/austin' + p);
		},

		date: () => {
			push('out', new Date().toString());
		},

		uptime: () => {
			push(
				'out',
				` ${new Date().toLocaleTimeString()} up ${formatUptime(Date.now() - startTime)}, 1 user`
			);
		},

		echo: (args) => {
			push('out', esc(args.join(' ')));
		},

		cowsay: (args) => {
			const msg = args.join(' ') || 'moo';
			push('out', `<pre class="t-cow">${esc(cowTemplate(msg))}</pre>`);
		},

		fortune: () => {
			push('out', `<span class="t-fortune">${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>`);
		},

		matrix: () => {
			push('out', '<span class="t-matrix">Entering the Matrix...</span>');
			onToggleMatrix();
		},

		neofetch: () => {
			push('out', neofetchOutput());
		},

		clear: () => {
			output = [];
			panelOpen = false;
		},

		exit: () => {
			push('out', '<span class="t-dim">There is no escape. You live here now.</span>');
		},

		sudo: (args) => {
			if (args.join(' ').includes('rm -rf')) {
				push('out', '<span class="t-warn">Deleting everything...</span>');
				setTimeout(() => {
					push(
						'out',
						'<span class="t-dim">Just kidding. I\'m a static site. Nice try though.</span>'
					);
				}, 800);
			} else {
				push('err', `sudo: ${esc(args[0] || '???')}: you're not root here`);
			}
		},

		vim: () => push('out', '<span class="t-editor">We use emacs here. Try again.</span>'),
		nano: () => push('out', '<span class="t-editor">We use emacs here. Try again.</span>'),
		emacs: () =>
			push('out', '<span class="t-emacs">Ah, I see you are a person of culture as well.</span>'),

		man: (args) =>
			push('out', `No manual entry for ${esc(args[0] || '???')}. This is a blog, not a man page.`),

		rm: () => push('err', 'rm: operation not permitted. This is a read-only filesystem, friend.'),
	};

	function exec(cmdLine: string) {
		const trimmed = cmdLine.trim();
		if (!trimmed) return;

		hasInteracted = true;
		push('cmd', `<span class="t-prompt">$</span> ${esc(trimmed)}`);
		history = [trimmed, ...history];
		historyIndex = -1;

		const parts = trimmed.split(/\s+/);
		const cmd = parts[0].toLowerCase();
		const args = parts.slice(1);

		if (cmd in commands) {
			commands[cmd](args);
		} else {
			push(
				'err',
				`${esc(cmd)}: command not found. Type <span class="t-cmd">help</span> for available commands.`
			);
		}

		panelOpen = true;
		requestAnimationFrame(() => {
			if (panelEl) panelEl.scrollTop = panelEl.scrollHeight;
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			exec(input);
			input = '';
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex < history.length - 1) {
				historyIndex++;
				input = history[historyIndex];
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				input = history[historyIndex];
			} else {
				historyIndex = -1;
				input = '';
			}
		} else if (e.key === 'Escape') {
			panelOpen = false;
			inputEl?.blur();
		} else if (e.key === 'Tab') {
			e.preventDefault();
			const cmdNames = Object.keys(commands);
			if (input) {
				const match = cmdNames.find((c) => c.startsWith(input.toLowerCase()));
				if (match) input = match;
			}
		}
	}

	function handlePanelClick(e: MouseEvent) {
		const anchor = (e.target as HTMLElement).closest('a');
		if (anchor) {
			const href = anchor.getAttribute('href');
			if (href && href.startsWith('/')) {
				e.preventDefault();
				goto(href);
			}
		}
	}

	function focusInput() {
		inputEl?.focus();
	}
</script>

<div class="terminal-container">
	{#if panelOpen && output.length > 0}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="terminal-panel" bind:this={panelEl} onclick={handlePanelClick} role="log">
			{#each output as line}
				<div class="terminal-line terminal-{line.type}">
					{@html line.html}
				</div>
			{/each}
		</div>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="terminal-input-bar" onclick={focusInput}>
		<div class="terminal-prompt-side">
			<span class="prompt-user">austin</span>
			<span class="prompt-arrow">&rsaquo;</span>
			<span class="prompt-path">{path()}</span>
			<span class="prompt-dollar">$</span>
			<input
				bind:this={inputEl}
				bind:value={input}
				onkeydown={handleKeydown}
				onfocus={() => (hasInteracted = true)}
				class="terminal-input"
				spellcheck="false"
				autocomplete="off"
				autocorrect="off"
				autocapitalize="off"
				aria-label="Terminal input"
			/>
			{#if !hasInteracted}
				<span class="terminal-hint">type 'help' for commands</span>
			{/if}
		</div>
		<div class="socials">
			{#each site.social as s}
				<a
					href={s.link}
					rel="noopener"
					target="_blank"
					class="social-link"
					onclick={(e) => e.stopPropagation()}>{s.name}</a
				>
			{/each}
		</div>
	</div>
</div>
