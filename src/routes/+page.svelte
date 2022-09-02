<script>
  import AppList from "../lib/app-list/AppList.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section>
  <h1>It works!</h1>
  <div>
    <h2>Apps</h2>
    <AppList apps={data.apps} />
  </div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    h1 {
        width: 100%;
    }

</style>
