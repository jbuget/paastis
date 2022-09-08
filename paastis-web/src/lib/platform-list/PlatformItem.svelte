<script>
  export let platform;
</script>

<div class="platform">
  <p>{platform.name}</p>
  <p>{platform.description}</p>
  <p>{platform.provider}</p>
</div>

<style>
  .platform {
      width: 300px;
      height: 300px;
      border: 1px solid grey;
      border-radius: 5px;
  }
</style>
