<script>
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error;

  const handleLogin = async () => {
    await goto('/');
  };
</script>

<svelte:head>
  <title>Login</title>
  <meta name="description" content="Login page"/>
</svelte:head>

<div>
  <h1>Login</h1>
  {#if error}
    <p class="center error">{error}</p>
  {/if}
  <form class="form" on:submit|preventDefault={handleLogin}>
    <input
        bind:value={email}
        name="email"
        type="email"
        aria-label="Email address"
        placeholder="Email address"
    />
    <input
        bind:value={password}
        name="password"
        type="password"
        aria-label="password"
        placeholder="password"
    />
    <button class="btn" type="submit">Login</button>
    <p class="center">No account yet? <a href="/accounts/register">Get started</a>.</p>
  </form>
</div>

<style>
</style>
