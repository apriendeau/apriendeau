<script lang="ts">
	import Redirect from '$lib/components/Redirect.svelte';
	let { data } = $props();
</script>

<Redirect to="/ramblings/{data.slug}/" />
