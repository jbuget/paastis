<script>

  import AppRow from "./AppRow.svelte";

  export let apps;

</script>

<div class="table">
  <div class="table-headers">
    <div class="table-header">Application</div>
    <div class="table-header">Provider</div>
    <div class="table-header">Last deployment</div>
    <!--<div class="table-header"></div>-->
  </div>
  <div class="table-rows">
    {#each apps as app (app.id)}
      <AppRow {app}/>
    {/each}
  </div>
</div>

<style>
    .table {
        border-radius: 8px;
        border: 1px solid #d0dde9;
    }

    .table-headers {
        background: #F8F9FC;
        display: flex;
        flex-direction: row;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .table-header {
        text-transform: uppercase;
        color: #a0a0a0;
        padding: 10px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .table-header:nth-child(1) {
        width: 300px;
    }

    .table-header:nth-child(2) {
        width: 200px;
    }

    .table-header:last-child {
        flex: 1;
    }

    .table-rows {
        display: flex;
        flex-direction: column;
    }


</style>
