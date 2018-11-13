<template>
    <div>
        <el-card :class="['flex', 'flex-column', 'mb-2', 'custom']">
            <div slot="header">
                <!-- <span class="blue-text bold-600">Account settings</span> -->
                <div class="search_n_roles">
                    <el-input size="medium" @keyup.enter.native="searchButton" v-model="search" class="is-shadow border-rounded search-div" :prefix-icon="loading" placeholder="Filter by name or email"></el-input>
                    <el-select v-model="value" placeholder="Select">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>                    
                </div>
            </div>
            <div>
                <div class="flex justify-content-start flex-column">
                    <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :model="form" label-width="200px">
                        <el-form-item class="flex" label="Account Name">
                            <el-input v-model="form.Account_name"></el-input>
                        </el-form-item>
                        <el-form-item class="flex" label="Country">
                            <el-input v-model="form.Country"></el-input>
                        </el-form-item>
                        <el-form-item class="flex" label="Timezone">
                            <el-input v-model="form.Country"></el-input>
                        </el-form-item>
                        <el-form-item class="flex" label="Phone verification">
                            <el-input v-model="form.Phone_verification"></el-input>
                        </el-form-item>
                    </el-form>
                </div>  
            </div>
            <div class="el-card__footer flex justify-content-end">
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                    <el-button size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="submitForm('form')">Save</el-button>
                </span>
            </div>
        </el-card>    
    </div>
</template>

<script>
export default {
    name: 'Account',
data () {
    return {
      isTest: true,
      search: '',
      summary: {
        ID: 'req_f9iKDOZvjkyakV',
        Time: '2018/10/13 10:33:38',
        Method: 'POST',
        URL: '/v1/subscriptions/sub_DmJ2N7WjyCfpcm'
      },
      info: {
          Account_name: 'Client Name',
          Country: 'Ghana',
          Timezone: 'GMT - Accra',
          Phone_verification: 'Unvefified'
      },
      form: {
        Account_name: '',
        Country: 'Ghana',
        Timezone: '',
        Phone_verification: 'Unvefified'
      },  
        options: [{
            value: 'Option1',
            label: 'Option1'
        }, {
            value: 'Option2',
            label: 'Option2'
        }, {
            value: 'Option3',
            label: 'Option3'
        }, {
            value: 'Option4',
            label: 'Option4'
        }, {
            value: 'Option5',
            label: 'Option5'
        }],
        value: ''          
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
    searchButton() {

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
.search_n_roles {
    .el-input{
        width: 30%;
        border-radius: 30px;
    }
}
</style>
