<template>
  <div v-loading="loadingPage">
    <el-card :class="[{'test-data': isTest}, 'flex', 'flex-column']">
        <h2 class="blue-text bold-500 m-0 pb-5">
          <span class="text-lowercase">{{eventName}}</span>
        </h2>
        <p class="gray-text">{{filteredevent.Date}}</p>
    </el-card>

    <summary-card header="Event details" :data="filteredevent"></summary-card>

    <el-card class="mb-2">
        <div slot="header">
            <span class="blue-text bold-600">Event data</span>
        </div>
        <div>
          <pre class="m-0">
            <code class="html hljs s-13" v-html="requestBody"></code>
          </pre>
        </div>
    </el-card>

    <el-card class="mb-2">
        <div slot="header">
            <span class="blue-text bold-600">Event Response</span>
        </div>
        <div>
          <pre class="m-0">
            <code class="html hljs s-13" v-html="responseBody"></code>
          </pre>
        </div>
    </el-card>

    <el-card class="events-hooks">
        <div slot="header">
          <div class="flex justify-content-between align-items-center">
            <div class="blue-text bold-600">Webhooks</div>
            <el-button :disabled="error" @click="retryHooks" :loading="loading" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="redo icon"></i> Resend webhook </el-button>
          </div>
        </div>
        <div class="flex justify-content-center">
          <div class="callbacks w-100 s-13">
            <el-table ref="events" @row-click="clickRow" empty-text="No retried webhooks available" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="events_reposted">
                <el-table-column prop="message" type="expand">
                    <template slot-scope="scope">   
                      <event-webhook :code="scope.row.statusCode" :status="scope.row.status" :Retry_history="scope.row.Retry_history" :request="scope.row.request"></event-webhook>
                    </template>                            
                </el-table-column>
                <el-table-column prop="method" label="" width="120">
                    <template slot-scope="scope">
                        <div class="flex">
                          <the-tag status="success" v-if="scope.row.status === 'success'" :title="scope.row.status" icon="detail check icon"></the-tag>
                          <the-tag status="pending" v-else-if="scope.row.status === 'pending'" :title="scope.row.status" icon="detail check icon"></the-tag>
                          <the-tag status="failed" v-else :title="scope.row.status" icon="detail check icon"></the-tag>
                        </div>
                    </template>
                </el-table-column>                    
                <el-table-column prop="url">
                    <template slot-scope="props">
                      {{props.row.url || 'N/A'}}
                    </template>                            
                </el-table-column>                                        
            </el-table>   
          </div>
        </div>
    </el-card>        
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import moment from 'moment'
import Utils from '../../utils/services'

export default {
  name: 'EventsDetails',
  data () {
    return {
      isTest: true,
      eventName: 'N/A',
      styleObject: {
        fontSize: '12px'
      },
      loading: false,
    }
  },

  methods: {
    syntaxHighlight (json) {
      if(json) {
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

    retryHooks(){
      this.loading = true
      this.$store.dispatch('retryHook', this.event.id)
      .then((response) => {
          if (response.data.success) {
              this.$message({
                  type: 'success',
                  message: 'Hooks Resent',
              })
          } else {
              this.$message({
                  type: 'error',
                  message: response.data.response.message
              })
          }
          this.loading = false
      }).catch((error) => {
          this.loading = false
          this.$message({
              message: 'Webhook being sent...',
              type: 'error'
          })
      })            
    },
    
    fetchEvent () {
      this.$store.dispatch('getCurrentEvent', this.$route.params.id) 
    },

    clickRow(row, event, column){
      this.$refs.events.toggleRowExpansion(row)
    }
  },

  mounted () {  
    EventBus.$emit('sideNavClick', 'events')
    this.$store.dispatch('getCurrentEvent', this.$route.params.id)
  },

  updated() {
    hljs.initHighlightingOnLoad();
    $('code.hljs').each(function(i, block) {
      hljs.lineNumbersBlock(block);
    });
  },

  computed: {
    ...mapGetters({
      event: 'currentEvent',
      state: 'currentEventState'
    }),

    loadingPage () {
      return this.state === 'LOADING'
    },

    error () {
      return this.state === 'ERROR'
    },

    filteredevent (){
      var event = {
        ID: this.event.id,
        Date: moment(this.event.created_at).format("YYYY/MM/DD, hh:mm a"),
        URL: `${this.event.url? this.event.url: 'n/a'}`,
        Version: '2018/2019',
        Source: 'Dashboard'
      }
      this.eventName = this.event.request.event_name
      return event;
    },

    events_reposted() {
      var reposted = []
      var array = this.event.events_reposted
      var record;

      for (let i = 0; i < array.length; i++) {
        record = {
          url: array[i].url,
          status: array[i].request.transaction.status == "paid"? "success": "failed",
          Retry_history: `${moment(array[i].created_at).format("YYYY/MM/DD, hh:mm a")} to ${array[i].url}`,
          statusCode: array[i].request.transaction.status == "paid"? 200: 401,
          request: array[i].request
        }      

        reposted.push(record)
      }
      return reposted
    },

    requestBody (){     
      if(this.event.request){
        var eventData = this.event.request
        
        if (Utils.present(eventData)){
          return this.syntaxHighlight(eventData) 
        }
        else {
          return this.syntaxHighlight('No Request body')
        }      
      }
    },

    responseBody () {   
      if(this.event.data.RESPONSE){
        var eventData = this.event.data.RESPONSE

        if (Utils.present(eventData)){
          return this.syntaxHighlight(eventData) 
        }
        else {
          return this.syntaxHighlight('No Response body')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bsProperty {

  .property {
    flex: 0 0 180px;
    color: #697386;
    line-height: 1.6;
  }

  .definition {
    flex: 1 1 auto;
    line-height: 1.6;
  }
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
.icon {
  font-size: 0.75em;
}
</style>
