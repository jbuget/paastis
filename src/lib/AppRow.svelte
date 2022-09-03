<script>

  import { restartApp, stopApp } from "./scalingo.js";
  import Fa from 'svelte-fa/src/fa.svelte';
  import { faArrowUpRightFromSquare, faArrowsRotate, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';

  export let app;

  let isOpen = false;

  function toggleApp() {
    isOpen = !isOpen;
  }

</script>

<div class="app">
  <div class="table-row">
    <div class="table-cell app-service status {app.status}" on:click|self={toggleApp}>
      <a href="{app.url}" target="{app.name}"><span class="app-name">{app.name}</span></a>
    </div>
    <div class="table-cell app-provider" on:click|self={toggleApp}>
      <a href="https://dashboard.scalingo.com/apps/{app.region}/{app.name}" target="{app.region}_{app.name}"><img src="/platforms/logo_scalingo.png" alt="">{app.region}</a>
    </div>
    <div class="table-cell app-last-deployed" on:click|self={toggleApp}>
      {#if app.last_deployed_at}
        {app.last_deployed_at}
      {:else}
        N/A
      {/if}

    </div>
    <!--
            <div class="table-cell app-actions">
              <button class="app-action" title="Start"><Fa icon={faPlay} /></button>
              <button class="app-action" on:click={stopApp(app.id)} title="Stop"><Fa icon={faStop} /></button>
              <button class="app-action" on:click={restartApp(app.id)} title="Redeploy"><Fa icon={faArrowsRotate} /></button>
            </div>
    -->
  </div>
</div>

{#if isOpen}
  <div>coucou</div>
{/if}

<style>

  .table-row {
      display: flex;
      flex-direction: row;
      border-top: 1px solid #d0dde9;
      cursor: pointer;
  }

  .table-cell {
      display: flex;
      align-items: center;
      padding: 10px;
  }
  .table-cell:nth-child(1) {
      width: 300px;
  }
  .table-cell:nth-child(2) {
      width: 200px;
  }
  .table-cell:nth-child(4) {
      width: 200px;
  }

  .app-service.status::before {
      content: '';
      border-radius: 50%;
      width: 10px;
      height: 10px;
      background: #f0f0f0;
      margin-right: 8px;
      display: block;
  }

  .app-service.status.new::before {
      background: dodgerblue;
  }

  .app-service.status.running::before {
      /*background: #00c5a4;*/
      background: limegreen;
  }

  .app-service.status.crashed::before {
      /*background: #00c5a4;*/
      background: #ff3e00;
  }

  .app-name {
      margin-right: 8px;
  }

  .app-provider a {
      display: flex;
      flex-direction: row;
      align-items: center;
  }

  .app-provider img {
      width: 32px;
      height: 32px;
  }

  .app-action {
      margin-right: 5px;
  }
  .app-action:last-child {
      margin-right: 0;
  }

</style>
