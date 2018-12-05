<template>
    <div class="no-padding">
        <el-card :class="['flex', 'flex-column', 'custom', 'transactions']">
            <div class="flex justify-content-between align-items-center px-20 py-16">
                <div slot="header">
                    <h4 class="header-text pb-5">User roles</h4>
                    <p class="s-13">Roles define what permissions are granted to team members in your Flopay account.</p>
                </div>
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New role</el-button>
                </div>                
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchRoles" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else class=""> 
                    <el-table :show-header="false" class="no-header" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" :data="roles">
                        <el-table-column v-for="(column, index) in columns" :key="index" :prop="column" :formatter="formatter" width="300"></el-table-column>
                        <el-table-column align="right">
                            <template slot-scope="scope">
                                <el-popover
                                    placement="left"
                                    width="400"
                                    popper-class="no-padding-popover"
                                    trigger="hover">
                                    <div>
                                        <div class="flex justify-content-between p-10 border-bottom">
                                            <p class="blue-text bold-600 s-14 m-0 p-0">Role Type</p>
                                            <the-tag status="failed" :title="scope.row.name" icon="reply icon"></the-tag>
                                        </div>
                                        <div class="p-10">
                                            <div v-for="(item, index) in scope.row.privileges" :key="index">
                                                <p class="s-12 py-5">{{item.action}}</p>
                                            </div>
                                        </div>
                                        <!-- <el-table row-class-name="roles-table-body" header-row-class-name="no-header-table" :data="scope.row.privileges">
                                            <el-table-column prop="action" label="action"></el-table-column>
                                        </el-table> -->
                                    </div>
                                    <el-button icon="info circle icon" type="text" slot="reference"></el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>

        <!-- <add-group :modalVisible.sync="dialogVisible" title="Add Group" :form="form" mode="new"></add-group> -->
        <!-- Add A Role -->
        
        <!-- <el-dialog custom-class="invite-user" :visible.sync="dialogVisible" width="30%">
            <div class="head flex flex-column justify-content-start px-20 py-16">
                <div class="ContentHeader flex justify-content-center flex-column black-text">
                    <span class="black-text bold-600 text-lineHeight--30">
                        <span>Add a new role</span>
                    </span>
                </div>

                <div class="flex justify-content-center new-transaction-bg">
                    <el-form size="mini" hide-required-asterisk class="transaction-form" :model="form" label-width="100px">
                        <el-form-item label="Name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="Description">
                            <el-input v-model="form.description"></el-input>
                        </el-form-item>
                        <el-form-item label="Approval Limit">
                            <el-input v-model="form.approval_limit"></el-input>
                        </el-form-item>

                        <el-form-item label="Privileges">
                            <el-select placeholder="" v-model="column">
                                <el-option label="All" value="all"></el-option>
                                <el-option label="Custom" value="custom"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="column == 'custom'" class="my-2">
                            <el-checkbox-group v-model="fieldColumns">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-checkbox class="no-margin-checkbox m-0" v-for="(field, index) in fieldSet.slice(0, 10)" :key="index" :label="field.key">{{field.value}}</el-checkbox>
                                </el-col>
                                <el-col class="flex flex-column" :span="12">
                                    <el-checkbox class="no-margin-checkbox m-0" v-for="(field, index) in fieldSet.slice(11, 20)" :key="index" :label="field.key">{{field.value}}</el-checkbox>
                                </el-col>
                            </el-row>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>                                    
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="mini" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="goForward(true)">Add Role</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Roles',
    data () {
        return {
            isTest: true,
            dialogVisible: false,
            exportVisible: false,
            form: {
                name: '',
                description: '',
                approval_limit: '',
                privileges: '',
                test: 'test'
            },
            isIndeterminate: false,
            styleObject: {
                fontSize: '12px'
            },
            columns: ['name', 'description'],
            column: 'all',    
        }
    },

    mounted () {
        EventBus.$emit('sideNavClick', 'roles')
        EventBus.$on('exportModal', (val) => {
            this.exportVisible = false
        })
        this.$store.dispatch('getRoles')
        this.$store.dispatch('fetchPrivileges')
    },
    
    methods: {
        fetchRoles () {
            this.$store.dispatch('getRoles', {cache: false})
        },
        fetchPrivileges (){
            this.$store.dispatch('fetchPrivileges', {cache: false})
        },
        formatter(row, column) {
            var value = row[column.property] ? row[column.property] : '-'
            return value
        }
    },
    computed: {
        ...mapGetters({
            roles: 'roles',
            state: 'rolesState',
            privileges: 'privileges'
        }),  
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },              
        total () {
            return this.roles.length
        },    
        loading () {
            return this.state === 'LOADING'
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

    .py-5{
        padding-bottom: 5px;
        padding-top: 5px;
    }

    .mini-button {
        line-height: 1em;
        padding: 7px 10px !important;
        color: rgba(0,0,0,.6);

    &:hover{
        color: rgba(0,0,0,.8);
    }

    span{
        font-weight: 600
    }
    i{
        margin-right: 5px;
    }
}

    .ContentHeader{
        flex: 1 1;
    }

    
</style>
