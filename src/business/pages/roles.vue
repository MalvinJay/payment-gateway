<template>
    <div class="no-padding">
        <el-card :class="['flex', 'flex-column', 'custom']">
            <div slot="header">
                <h4 class="header-text mb-1">User roles</h4>
                <p class="s-13">Roles define what permissions are granted to team members in your Flopay account.</p>
            </div>
            <div>
                <el-table :show-header="false" class="no-header" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" :data="roles">
                    <el-table-column v-for="(column, index) in columns" :key="index" :prop="column" :formatter="formatter" width="300"></el-table-column>
                    <el-table-column align="right">
                        <template slot-scope="scope">
                            <el-popover
                                placement="left"
                                width="400"
                                popper-class="no-padding-popover"
                                trigger="click">
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
        </el-card>        
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
            styleObject: {
                fontSize: '12px'
            },
            columns: ['name', 'description']       
        }
    },

    mounted () {
        EventBus.$on('exportModal', (val) => {
            this.exportVisible = false
        })
        this.$store.dispatch('getRoles')
    },
    
    methods: {
        fetchRoles () {
            this.$store.dispatch('getRoles', {cache: false})
        },
        formatter(row, column) {
            var value = row[column.property] ? row[column.property] : '-'
            return value
        }
    },
    computed: {
        ...mapGetters({
            roles: 'roles',
            state: 'rolesState'
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
    
</style>
