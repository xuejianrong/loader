<template>
  <div id="app">
    <h1 style="font-size: 30px; text-align: center">\{{msg}}</h1>
    <h1 style="font-size: 30px; text-align: center">\{{getterMsg}}</h1>
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
    computed: {
      ...Vuex.mapState([
        'msg',
      ]),
      ...Vuex.mapGetters([
        'getterMsg',
        'getDemoDesc'
      ])
    },
    mounted() {
      console.log(this.getDemoDesc(1));
    }
  };
</script>

<style lang="scss">
  @import "assets/css/base.scss";
  @import "assets/css/init.scss";
</style>
