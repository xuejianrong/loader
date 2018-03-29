<template>
  <div class="wx-share-component">
  </div>
</template>

<script>
export default {
  name: 'wxShare',
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('wxInit');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
