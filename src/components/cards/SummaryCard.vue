<template>
    <el-card class="my-2">
        <div slot="header">
            <span class="blue-text bold-600">{{header}}</span>
        </div>
        <div>
            <div v-if="hasNoData" class="center h-80">
                {{noData}}
            </div>
            <div v-if="!hasNoData" v-for="(value, key, index) in data" :key="index">
                <div class="flex align-items-center mb-1">
                    <p class="s-13 m-0 mr-2 w-150">{{key}}</p>
                    <p class="s-13 mono">{{value}}</p>
                </div>
            </div>
        </div>

    </el-card>
</template>

<script>
export default {
  name: 'SummaryCard',
  props: {
    header: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: false
    },
    noData: {
      type: String,
      required: false
    }
  },
  computed: {
    hasNoData () {
      return typeof this.data === 'undefined'
    }
  }
}
</script>

<style lang="scss" scoped>
.w-100{
    width: 100px;
    color: #697386;
}
.w-150{
    width: 150px;
}
.mb-2{
    margin-bottom: 1em
}
.h-80{
    min-height: 100px
}
</style>
