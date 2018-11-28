<template>
  <div class="bsProperty s-13">
    <div class="flex justify-content-start">
      <p class="property">Status</p>
      <p class="definition">{{code}} {{status}}  (1 try)</p>
    </div>                                          
    <div class="flex justify-content-start">
      <p class="property">Retry history</p>
      <p class="definition">[ {{Retry_history}} ]: ({{code}}) OK</p>
    </div> 
    <div class="flex justify-content-start">
      <p class="property">Request</p>
      <div class="border w-75">
        <pre class="m-0">
          <code class="request hljs s-12" v-html="syntaxHighlight(request)"></code>
        </pre>
      </div>                                
    </div>                                                         
  </div>
</template>

<script>
export default {
  name: 'EventWebhook',
  props: {
      code: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      Retry_history: {
        type: String,
        required: true
      },
      request: {
        type: String,
        required: true
      }
  },

  mounted() {
    hljs.initHighlightingOnLoad();
    $('code.hljs').each(function(i, block) {
      hljs.lineNumbersBlock(block);
    });      
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
</style>
