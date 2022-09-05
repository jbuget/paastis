<script>
  import { goto } from '$app/navigation';
  import { registerUser } from "../../../lib/database.js";

  let name = '';
  let email = '';
  let password = '';

  const handleRegister = async () => {
    if (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0
    ) {
      await registerUser({ name, email, password });
      await goto('/');
    }
  };
</script>

<svelte:head>
  <title>Register</title>
  <meta name="description" content="Registration page"/>
</svelte:head>

<div>
  <h1>Register</h1>
  <form class="form" on:submit|preventDefault={handleRegister}>
    <div>
      <input
          bind:value={name}
          name="name"
          type="text"
          aria-label="Name"
          placeholder="Name"
      />
    </div>
    <div>
      <input
          bind:value={email}
          name="email"
          type="email"
          aria-label="Email address"
          placeholder="Email address"
      />
    </div>
    <div>
      <input
          bind:value={password}
          name="password"
          type="password"
          aria-label="Password"
          placeholder="Password"
      />
    </div>
    <button class="btn" type="submit">Login</button>
    <p class="center">Already have an account? <a href="/accounts/login">Get login</a>.</p>
  </form>
</div>

<style>
</style>
