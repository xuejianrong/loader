<template>
  <div id="app">
    <img src="./assets/logo.png">
    {{#router}}
    <router-view/>
    {{else}}
    <HelloWorld/>
    {{/router}}
  </div>
</template>

<script>
{{#unless router}}
import HelloWorld from './components/HelloWorld';

{{/unless}}
export default {
  name: 'app'{{#router}}{{else}},
  components: {
    HelloWorld,
  }{{/router}},
};
</script>

<style lang="scss">
  @import "assets/css/base.scss";
  @import "assets/css/init.scss";
</style>
