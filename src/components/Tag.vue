<template>
  <div :class="[{success: isSuccess}, 'tag-success', 'flex']">
    <p class="p-0 m-0">{{title}}</p>
    <!-- <i :class="icon"></i> -->
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: ['title', 'status', 'icon'],
  data () {
    return {
    }
  },
  computed: {
    isSuccess () {
      return this.status.toLowerCase() === 'success'
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-success{
    // color: white;
    // background: #2185d0;
    // font-size: 75%;
    // padding: 3px 8px;
    align-items: center;
    // justify-content: center;
    // border-radius: 15px;
    // line-height: 1;
    // text-transform: uppercase;
    // border: 0;
    // font-weight: 400;
    // border-radius: 0.2em;
    // margin: 0 6px;
    // color: #484bad;
    padding: 3px 10px;
    font-weight: 500;
    line-height: 16px;
    font-size: 10px;
    border-radius: 20px;
    text-transform: capitalize;
    color: #4e566d;
    background-color: #e3e8ee;
    i{
        height: auto;
        margin-left: 5px;
        font-size: 10px;
    }
}
.success{
    background: #d6ecff;
    color: #484bad;

    i{
        color: #6f8eef;
    }
}
</style>
