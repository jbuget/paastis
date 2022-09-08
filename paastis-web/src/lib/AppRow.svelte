<script>

  import { getAppDetails } from "./scalingo.js";

  export let app;

  let isOpen = false;
  let appDetails;

  async function toggleApp() {
    if (!isOpen) {
      appDetails = await getAppDetails(app.id, app.region)
    }
    isOpen = !isOpen;
  }

</script>

<div class="app" class:isOpen>
  <div class="table-row">
    <div class="table-cell app-service status {app.status}" on:click|self={toggleApp}>
      <a href="{app.url}" target="{app.name}"><span class="app-name">{app.name}</span></a>
    </div>
    <div class="table-cell app-provider" on:click|self={toggleApp}>
      <a href="https://dashboard.scalingo.com/apps/{app.region}/{app.name}" target="{app.region}_{app.name}"><img
          src="/platforms/logo_scalingo.png" alt="">{app.region}</a>
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
  <div class="app-details">
    <div class="app-panel">
      <span class="app-panel-title">Containers</span>
      {#each appDetails.containers as container (container.id)}
        <div class="container">
          <span class="container-name">{container.name}</span><span class="container-formation">({container.amount}
          :{container.size})</span>
          <p><span class="container-command">{container.command}</span></p>
        </div>
      {/each}
    </div>
    <div class="app-panel">
      <span class="app-panel-title">Addons</span>
      {#each appDetails.addons as addon (addon.id)}
        <img class="addon-provider-logo" src="{addon.addon_provider.logo_url}" alt="">
        <span class="addon-provider-name">{addon.addon_provider.name}</span>
        <span class="addon-plan-name">{addon.plan.display_name}</span>
      {/each}
    </div>
    <div class="app-panel">
      <span class="app-panel-title">Misc</span>

    </div>
  </div>
{/if}

<style>
    .app.isOpen {
        background: #F8F9FC;
    }

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

    .table-cell:last-child {
        flex: 1;
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

    .app-details {
        padding: 10px;
        background: #F8F9FC;
        display: flex;
        flex-direction: row;
    }

    .app-panel {
        border-radius: 5px;
        background: #ffffff;
        min-height: 100px;
        flex: 1;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
    }

    .app-panel:last-child {
        margin-right: 0;
    }

    .app-panel-title {
        font-weight: 600;
        padding: 10px;
    }

    .container {
        padding: 10px;
    }

    .container-name {
        font-weight: 600;
        margin-right: 8px;
    }

    .container-formation {
        color: darkgray;
    }

    .container-command {
        color: #b9c6d2;
    }
    .addon-provider-logo {
        width: 32px;
        height: 32px;
    }

</style>
