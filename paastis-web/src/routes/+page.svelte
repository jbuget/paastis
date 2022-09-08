<script>
  import AppList from "../lib/AppList.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app"/>
</svelte:head>

<!--
<section>
  <h2>Platforms</h2>
  <PlatformList platforms={data.platforms} />
</section>
-->

<section>
  <AppList apps={data.apps} />
</section>

<style>
</style>
