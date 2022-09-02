<script>
	import AppItem from "./AppItem.svelte";

	export let apps;
</script>

<div>
	Nb apps = {apps.length}

	{#each apps as app (app.id)}
		<AppItem app={app}/>
	{/each}
</div>

<style>
</style>
