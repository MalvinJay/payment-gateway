<template>
    <div>
        <el-card :class="[{'test-data': isTest}, 'flex', 'flex-column']">
            <h2 class="blue-text bold-500 m-0 pb-5">POST /v1/subscriptions/sub_DmJ2N7WjyCfpcm</h2>
            <p class="gray-text">2018/10/13 10:33:38</p>
        </el-card>
        <summary-card header="Summary" :data="summary"></summary-card>
        <summary-card header="Request query parameters" noData="No query parameters"></summary-card>
        <el-card>
            <div slot="header">
                <span class="blue-text bold-600">Some Text</span>
            </div>
            <div>
                <pre v-html="data"></pre>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Logs',
  data () {
    return {
      isTest: true,
      summary: {
        ID: 'req_f9iKDOZvjkyakV',
        Time: '2018/10/13 10:33:38',
        Method: 'POST',
        URL: '/v1/subscriptions/sub_DmJ2N7WjyCfpcm'
      }
    }
  },
  methods: {
    syntaxHighlight (json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
      }
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    }
  },
  computed: {
    data () {
      return this.syntaxHighlight(this.summary)
    }
  }
}
</script>

<style lang="scss" scoped>
.w-100{
    width: 100px
}
.mb-2{
    margin-bottom: 1em
}
pre{
    &:nth-child(2){
        &::before{
            content: '1'
        }
    }
}
</style>
