<template>
    <div class="no-padding">
        <el-card :class="['flex', 'flex-column', 'custom']">
            <div slot="header">
                <h4 class="mb-1 bold-600">User roles</h4>
                <p class="font-lighter">Roles define what permissions are granted to team members in your Flopay account.</p>
            </div>
            <div>
                <div class="flex justify-content-start flex-column no-header">
                    <el-table empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredRoles">
                        <el-table-column width="300">
                            <template slot-scope="scope">
                                {{scope.row.name || 'N/A'}}
                            </template>                            
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.description || 'N/A'}}
                            </template>                            
                        </el-table-column>                       
                    </el-table>                                      
                </div>  
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
        }
    },

    mounted () {
        EventBus.$on('exportModal', (val) => {
            this.exportVisible = false
        })
        this.$store.dispatch('getRoles');
    },
    
    methods: {
        fetchTeams () {
            this.$store.dispatch('getTeams', {cache: false})
        },
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
        },       
        filteredRoles () {
            console.log('Roles:', this.roles)
            return this.roles;
        },  
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
