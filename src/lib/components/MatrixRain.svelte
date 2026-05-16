<script lang="ts">
	interface Props {
		active: boolean;
		onDismiss: () => void;
	}

	let { active, onDismiss }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (!active || !canvas) return;

		const ctx = canvas.getContext('2d')!;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const fontSize = 14;
		const columns = Math.floor(canvas.width / fontSize);
		const drops = new Array(columns).fill(1);
		const chars = '01';
		let frame: number;

		function draw() {
			ctx.fillStyle = 'rgba(7, 7, 15, 0.06)';
			ctx.fillRect(0, 0, canvas!.width, canvas!.height);
			ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

			for (let i = 0; i < drops.length; i++) {
				const char = chars[Math.floor(Math.random() * chars.length)];
				const x = i * fontSize;
				const y = drops[i] * fontSize;

				ctx.fillStyle =
					Math.random() > 0.96
						? '#ff3ec9'
						: Math.random() > 0.92
							? '#a66cff'
							: '#00e5ff';
				ctx.shadowColor = ctx.fillStyle;
				ctx.shadowBlur = 4;
				ctx.fillText(char, x, y);
				ctx.shadowBlur = 0;

				if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}

			frame = requestAnimationFrame(draw);
		}

		draw();

		const handleResize = () => {
			canvas!.width = window.innerWidth;
			canvas!.height = window.innerHeight;
		};

		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' || e.key === 'q') onDismiss();
		};

		const handleClick = () => onDismiss();

		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKey);
		canvas!.addEventListener('click', handleClick);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKey);
		};
	});
</script>

{#if active}
	<div class="matrix-overlay">
		<canvas bind:this={canvas}></canvas>
		<div class="matrix-dismiss">press ESC or click to exit</div>
	</div>
{/if}

<style>
	.matrix-overlay {
		position: fixed;
		inset: 0;
		z-index: 2000;
		background: #07070f;
	}
	.matrix-overlay canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	.matrix-dismiss {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(0, 229, 255, 0.4);
		font-family: var(--font-mono);
		font-size: 11px;
		z-index: 2001;
		letter-spacing: 0.1em;
	}
</style>
