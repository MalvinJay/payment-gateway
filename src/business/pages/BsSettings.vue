<template>
    <div>
        <el-card :class="['flex', 'flex-column', 'mb-2', 'custom']">
            <div slot="header">
                <span class="blue-text bold-600">Account settings</span>
            </div>
            <div>
                <div class="flex justify-content-start flex-column">
                    <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form py-20" :model="client" label-width="200px">
                        <el-form-item class="flex" label="Account Name">
                            <el-input v-model="client.client.full_name  || 'N/A'"></el-input>
                        </el-form-item>
                        <el-form-item class="flex" label="Country">
                            <el-input v-model="client.client.country || 'N/A'"></el-input>
                        </el-form-item>
                        <el-form-item class="flex" label="Timezone">
                            <el-input v-model="client.client.timezone || 'N/A'"></el-input>
                        </el-form-item>
                        <el-form-item class="flex" label="Phone verification">
                            <div class="flex justify-content-start w-100">
                                <the-tag status="failed" :title="form.Phone_verification" icon="detail check icon" class="flex justify-content w-50 bold-600 s-12 mr-2"></the-tag>
                                <el-popover
                                    placement="right"
                                    width="400"
                                    popper-class="no-padding-popover"
                                    trigger="hover">
                                    <div>
                                        <div class="flex justify-content-between p-10 border-bottom">
                                            <!-- <p class="blue-text bold-600 s-14 m-0 p-0">Role Type</p> -->
                                            <the-tag status="failed" :title="client.client.full_name" icon="reply icon"></the-tag>
                                        </div>
                                        <div class="p-10">
                                            <!-- <div v-for="(item, index) in scope.row.privileges" :key="index">
                                                <p class="s-12 py-5">{{item.action}}</p>
                                            </div> -->
                                            <p>
                                                The account owner can add a phone number to this account in order 
                                                to process payments and manage customer cards directly from the Dashboard.
                                            </p>
                                        </div>
                                    </div>
                                    <el-button icon="info circle icon" type="text" slot="reference"></el-button>
                                </el-popover>                                
                            </div>
                        </el-form-item>
                    </el-form>
                </div>  
            </div>
            <div class="el-card__footer flex justify-content-end">
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                    <el-button size="mini" @click="saveAccountChanges" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary">Save</el-button>
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
                            <div class="flex">
                                <el-input v-model="client.client.company_name  || 'N/A'" placeholder="Business Name" class="mr-2"></el-input>
                                
                                <el-popover
                                    placement="right"
                                    width="400"
                                    popper-class="no-padding-popover"
                                    trigger="hover">
                                    <div>
                                        <div class="flex flex-column justify-content-between p-10 s-12">
                                            <div class="root">
                                                <div class="statement p-5">
                                                    <div class="root mb-2">
                                                        <div class="flex justify-content-start">
                                                                <div class="svg ml-1">
                                                                    <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg Icon-svg Icon--bank-svg SVG--color-svg SVG--color--gray200-svg" style="width: 16px;height: 16px;" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M1.02 6A1 1 0 0 1 .5 4.134C.82 3.95 3.32 2.572 8 0c4.681 2.572 7.181 3.95 7.5 4.134A1 1 0 0 1 14.98 6zM11 14V7.5h3V14h1a1 1 0 0 1 1 1v1H0v-1a1 1 0 0 1 1-1h1V7.5h3V14h1.5V7.5h3V14z" fill-rule="evenodd"></path></svg>
                                                                </div>
                                                                <div class="ml-2">
                                                                    <span> ...1234 BANK STATEMENT </span>
                                                                </div>
                                                        </div>
                                                    </div>
                                                    <el-table empty-text="No account found" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" :data="accounts">
                                                        <el-table-column label="Amount">
                                                            <template slot-scope="scope">
                                                                
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Transaction">
                                                            <template slot-scope="scope">
                                                                
                                                            </template>
                                                        </el-table-column>                                                        
                                                    </el-table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <el-button icon="info circle icon" type="text" slot="reference"></el-button>
                                </el-popover>  
                            </div>
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
                            <el-input v-model="client.client.company_name||'N/A'" placeholder="Business Name"></el-input>
                        </el-form-item>
                        <el-form-item label="Business website" class="flex">
                            <el-input v-model="info.bs_website"></el-input>
                        </el-form-item>
                        <el-form-item label="Support website" class="flex">
                            <el-input v-model="client.client.sp_website||'N/A'"></el-input>
                        </el-form-item>
                        <el-form-item label="Email" class="flex">
                            <el-input v-model="client.client.email||'N/A'" placeholder="business@email.com"></el-input>
                        </el-form-item>
                        <el-form-item label="Address" class="flex">
                            <el-input v-model="client.client.address||'Accra'" placeholder="Business Address"></el-input>
                            <div class="mt-3">
                                <el-input v-model="client.client.address_1||'N/A'" placeholder="Address Line 1"></el-input>
                                <el-input v-model="client.client.address_2||'N/A'" class="mt-1" placeholder="Address Line 2"></el-input>
                            </div>
                            <el-input v-model="client.client.city||'N/A'" class="mt-1" placeholder="City"></el-input>
                            <el-input v-model="client.client.state||'N/A'" class="mt-1" placeholder="State"></el-input>
                            <el-input v-model="client.client.postal_code||'N/A'" class="mt-1" placeholder="ZIP"></el-input>
                        </el-form-item>                                                                                               
                    </el-form>
                </div>  
            </div>            
            <div class="el-card__footer flex justify-content-end">
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                    <el-button size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="save">Save</el-button>
                </span>
            </div>
        </el-card>        
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
    name: 'BsSettings',
    data () {
        return {
             styleObject: {
                fontSize: '10px'
            },
            isTest: true,
            createLoading: false,
            info: {
                Account_name: 'Client Name',
                Country: 'Ghana',
                Timezone: 'GMT - Accra',
                Phone_verification: 'Unverified'
            },
            form: {
                Account_name: '',
                Country: 'Ghana',
                Timezone: '',
                Phone_verification: 'Unverified'
            },      
            accounts: []
        }
    },
    methods: {
        fetchUser () {
            this.$store.dispatch('getClient', {cache: false})
        },
        save () {

        },
        saveAccountChanges () {
            
        }
    },

    mounted () {
        EventBus.$emit('sideNavClick', 'bs_account')
    },

    computed: {
        ...mapGetters({
            user: 'user',
            state: 'logIn',
            test: 'test',
            pageLoading: 'pageLoading'
        }),

        client () {
            return this.user
        }
    }
}
</script>

<style lang="scss" scoped>
    .statement {
        background: #f8f9fb;
    }
    .mb-2 {
        margin-bottom: 1em
    }
    pre {
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

    .SVG--color{
        fill: currentColor;
        color: #c1c9d2;
    }

</style>
