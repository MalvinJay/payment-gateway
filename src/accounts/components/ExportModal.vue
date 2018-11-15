<template>
    <el-dialog custom-class="export-dialog"
        title="Export"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-export-bg">
            <el-form size="mini" class="my-2" style="width: 90%" ref="form" :model="form" label-position="top">
                <el-form-item label="Type of Transaction">
                    <div class="flex justify-content-between align-items-center">
                        <!-- <el-checkbox-group class="flex justify-content" > -->
                            <el-checkbox v-model="form.payment_types" @change="handleCheckedTypesChange" v-for="payment in types" :label="payment.value" :key="payment.value">{{payment.label}}</el-checkbox>
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all</el-checkbox>
                        <!-- </el-checkbox-group> -->
                    </div>
                </el-form-item>
                <el-form-item label="Date Range">
                    <el-date-picker
                    v-model="form.daterange"
                    type="daterange"
                    :unlink-panels="true"
                    start-placeholder="Start date"
                    end-placeholder="End date">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
export default {
    name: 'ExportModal',
    props: ['modalVisible'],
    data() {
      return {
        checkAll: false,
        types: [
            {label: 'Bank Account', value: 'bank'},
            {label: 'Card', value: 'card'},
            {label: 'Mobile Wallet', value: 'wallet'}
        ],
        isIndeterminate: false,
        form: {
            payment_types: []
        }
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.form.payment_types = val ? this.types.map(el => el.value) : []
        this.isIndeterminate = false
      },
      handleCheckedTypesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.types.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length
      },
      close () {
        EventBus.$emit('exportModal', false)
      }
    }
}
</script>

<style lang="scss" scoped>
.export-dialog{
    .el-dialog__header{
        color: #2b2d50;
    }
    .el-dialog__body{
        padding: 0px !important
    }
}
.new-export-bg{
    background: #F7FAFC;
}
</style>
