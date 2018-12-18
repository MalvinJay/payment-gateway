<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app{
    width: 90%;
    margin: 0 auto;
}
@media only screen and (max-width: 1200px) {
  #app{
    width: 98%
  }
}
</style>
