<script>

	import PlatformItem from "./PlatformItem.svelte";

	export let platforms;
</script>

<div>
	{#each platforms as platform (platform.id)}
		<PlatformItem platform={platform}/>
	{/each}
</div>

<style>
</style>
