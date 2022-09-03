<script>
  import AppList from "../lib/app-list/AppList.svelte";
  import PlatformList from "../lib/platform-list/PlatformList.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section>
  <h2>Platforms</h2>
  <PlatformList platforms={data.platforms} />
</section>

<section>
  <h2>Apps</h2>
  <AppList apps={data.apps} />
</section>

<style>
</style>
