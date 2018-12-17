export default {
  methods: {
    retryTransactions (row, type) {
      var form = {
        amount: row.receiver_amount,
        currency: 'GHS',
        customer_no: row.receiver_no,
        country_code: 'GH',
        reference: 'FLPCO' + Math.floor(Math.random() * 99999999999),
        customer_name: row.receiver_name,
        provider: row.provider,
        remarks: row.remarks,
        retry: true
      }
      form.live = !this.test
      form.dummy = this.test
      form.service_code = 'cashout'

      console.log('retry', form)

      this.$store.dispatch('createTransactions', form)
        .then((response) => {
          if (response.data.success) {
            this.$message({
              message: 'Retry successful',
              type: 'success'
            })
            this.fetchTransactions()
            this.dialogVisible = false
          } else {
            this.$message({
              type: 'error',
              message: response.data.response.message.message
            })
          }
        }).catch((error) => {
          const response = error.response
          this.$message({
            message: response.data.error,
            type: 'error'
          })
        })
    }
  }
}
