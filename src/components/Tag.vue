<template>
  <div :class="[{success: isSuccess}, 'tag-success', 'flex', 'justify-content-center']" :style="{width: width + 'px'}">
    <p class="p-0 m-0">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: ['title', 'status', 'icon', 'width'],
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
    align-items: center;
    padding: 3px 10px;
    font-weight: 500;
    line-height: 16px;
    font-size: 10px;
    border-radius: 20px;
    text-transform: capitalize;
    color: #4e566d;
    background-color: #e3e8ee;
    i {
        height: auto;
        margin-left: 5px;
        font-size: 10px;
    }
}
.success {
  background: #f8e5b9;
  color: #983705;
}

</style>
