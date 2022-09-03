<script>
  import { restartApp } from "./scalingo.js";

  export let apps;
</script>

<div class="table">
  <div class="table-headers">
    <div class="table-header">Application</div>
    <div class="table-header">Provider</div>
    <div class="table-header">Last deployed at</div>
    <div class="table-header"></div>
  </div>
  <div class="table-rows">
    {#each apps as app (app.id)}
      <div class="table-row">
        <div class="table-cell app-service">{app.name} ({app.status})</div>
        <div class="table-cell app-provider"><img src="/platforms/logo_scalingo.png" alt="">Scalingo</div>
        <div class="table-cell app-last-deployed">{app.last_deployed_at}</div>
        <div class="table-cell app-actions"><button on:click={restartApp(app.id)}>restart</button></div>
      </div>
    {/each}
  </div>
</div>

<style>
    .table {

    }
    .table-headers {
        background: #F8F9FC;
        display: flex;
        flex-direction: row;
    }

    .table-header {
        text-transform: uppercase;
        color: #a0a0a0;
        padding: 10px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .table-cell {
        padding: 10px;
    }

    .table-header:nth-child(1),
    .table-cell:nth-child(1) {
        width: 400px;
    }

    .table-header:nth-child(2),
    .table-cell:nth-child(2)  {
        width: 140px;
    }

    .table-header:nth-child(3),
    .table-cell:nth-child(3)  {
        width: 200px;
    }
    .table-rows {
        display: flex;
        flex-direction: column;
    }
    .table-row {
        display: flex;
        flex-direction: row;
    }
    .table-cell {
        display: flex;
        align-items: center;
        
    }
    .app-provider img {
        width: 32px;
        height: 32px;
    }
</style>
