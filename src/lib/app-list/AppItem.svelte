<script>
	import { restartApp } from "../scalingo.js";

	export let app;

</script>

<div>

	{app.name} <button on:click={restartApp(app.id)}>restart</button>
</div>

<style>
</style>
