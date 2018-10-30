<template>
    <el-dialog
        title="Create New Payment - Mobile Money"
        :visible.sync="modalVisible"
        width="30%">

    </el-dialog>
</template>

<script>
export default {
    name: 'ExportModal',
    props: {
        modalVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dialogVisible: this.modalVisible
        }
    }
}
</script>
