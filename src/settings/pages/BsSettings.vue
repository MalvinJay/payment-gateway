<template>
    <div>
        <el-card :class="['flex', 'flex-column', 'mb-2', 'custom']">
            <div slot="header">
                <span class="blue-text bold-600">Account settings</span>
            </div>
            <div>
                <div class="flex justify-content-start flex-column">
                    <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form py-20" :model="form" label-width="200px">
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
        <el-card :class="['flex', 'flex-column', 'custom']">
            <div slot="header">
                <h4 class="mb-1 bold-600">Public information</h4>
                <p class="font-lighter">This information helps customers recognize your business and may be visible in many places including card statements, invoices, and receipts</p>
            </div>
            <div>
                <div class="flex justify-content-start flex-column">
                    <div class="p-10 border-bottom">
                        <h4>
                            <span class="">Credit card statement details</span>
                        </h4>
                    </div>                    
                    <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form py-20" :model="info" label-width="200px">
                        <el-form-item label="Statement descriptor" class="flex">
                            <el-input v-model="info.Account_name" placeholder="Business Name"></el-input>
                            <p class="my-1">
                                <span class="info">This is the business name your customers see on their transactions. Use a recognizable name to prevent unintended chargebacks.</span>
                            </p>                            
                        </el-form-item>
                        <el-form-item label="Customer support contact" class="flex">
                            <el-input v-model="info.Country"></el-input>
                        </el-form-item>
                    </el-form>
                </div>  
            </div>

            <div>
                <div class="flex justify-content-start flex-column">
                    <div class="pb-20 border-bottom">
                        <h4>
                            <span class="">Other contact information</span>
                        </h4>
                    </div>                    
                    <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form py-20" :model="info" label-width="200px">
                        <el-form-item label="Legal Business name" class="flex">
                            <el-input v-model="info.buniness_name" placeholder="Business Name"></el-input>
                        </el-form-item>
                        <el-form-item label="Business website" class="flex">
                            <el-input v-model="info.bs_website"></el-input>
                        </el-form-item>
                        <el-form-item label="Support website" class="flex">
                            <el-input v-model="info.sp_website"></el-input>
                        </el-form-item>
                        <el-form-item label="Email" class="flex">
                            <el-input v-model="info.email" placeholder="business@email.com"></el-input>
                        </el-form-item>
                        <el-form-item label="Address" class="flex">
                            <el-input v-model="info.country" placeholder="Country"></el-input>
                            <div class="mt-3">
                                <el-input v-model="info.country" placeholder="Address Line 1"></el-input>
                                <el-input v-model="info.country" class="mt-1" placeholder="Address Line 2"></el-input>
                            </div>
                            <el-input v-model="info.country" class="mt-1" placeholder="City"></el-input>
                            <el-input v-model="info.country" class="mt-1" placeholder="State"></el-input>
                            <el-input v-model="info.country" class="mt-1" placeholder="ZIP"></el-input>
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

    .info {
        font-weight: 400;
        font-size: 12px;
        line-height: 1.6;
        color: #697386;
    }

    .el-card__body {
        background-color: #f7fafc;
    }
</style>
