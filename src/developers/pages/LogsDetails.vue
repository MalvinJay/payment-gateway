<template>
    <div v-loading="loadingPage">
        <el-card :class="[{'test-data': isTest}, 'flex', 'flex-column']">
            <h2 class="blue-text bold-500 m-0 pb-5">
              <span class="text-uppercase">{{filteredlog.Method}}</span> <span class="text-lowercase">{{filteredlog.URL}}</span>
            </h2>
            <p class="gray-text">{{filteredlog.Date}}</p>
        </el-card>

        <summary-card header="Summary" :data="filteredlog"></summary-card>

        <summary-card header="Request Query parameters" noData="No query parameters"></summary-card>

        <el-card class="mb-2">
            <div slot="header">
                <span class="blue-text bold-600">Request POST body</span>
            </div>
            <div>
                <pre class="m-0">
                  <code class="html hljs s-13" v-html="requestBody"></code>
                </pre>                
            </div>
        </el-card>

        <el-card>
            <div slot="header">
                <span class="blue-text bold-600">Response body</span>
            </div>
            <div>
                <pre class="m-0">
                  <code class="html hljs s-13" v-html="responseBody"></code>
                </pre>
            </div>
        </el-card>        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import moment from 'moment'
// import hightlight from ''

export default {
  name: 'LogDetails',
  data () {
    return {
      isTest: true,
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
    },

    fetchLog () {
      this.$store.dispatch('getCurrentLog', this.$route.params.id) 
    }  
  },

  mounted () {
    EventBus.$emit('sideNavClick', 'logs')
    this.$store.dispatch('getCurrentLog', this.$route.params.id)
  },

  updated() {
    hljs.initHighlightingOnLoad();
    $('code.hljs').each(function(i, block) {
      hljs.lineNumbersBlock(block);
    });      
  },

  computed: {
    ...mapGetters({
      log: 'currentLog',
      state: 'currentLogState'
    }),

    loadingPage () {
      return this.state === 'LOADING'
    },

    error () {
      return this.state === 'ERROR'
    },    

    data () {
      return this.log;
    },

    filteredlog (){
      var log = {
        ID: this.log.id,
        Date: moment(this.created_at).format("YYYY/MM/DD, HH:mm a"),
        Method: this.log.method? this.log.method.toUpperCase(): 'N/A',
        URL: `/${this.log.url? this.log.url: 'n/a'}`,
        Status: '200',
        IP: 'N/A',
        Version: '2018/2019',
        Source: 'Dashboard',
        // Related: 'product - ' + this.log.response == undefined ? 'N/A' : this.log.response.response.reference,
        Origin: 'https://dashboard.flopay.io'
      }
      return log;
    },

    requestBody () {  
      return this.syntaxHighlight(this.log.request) 
    },

    responseBody () {
      return this.syntaxHighlight(this.log.response.response)     
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
