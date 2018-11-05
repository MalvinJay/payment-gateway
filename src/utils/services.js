export default {
  createExportQuery (form) {
    var query = 'file_type=csv'
    if (this.present(form.from)) {
      query = query += `&start_date=${form.from}`
    }
    if (this.present(form.to)) {
      query = query += `&end_date=${form.to}`
    }
    if (this.present(form.fields)) {
      if (form.fields.length === 1) {
        query = query += `&fields[]=${form.fields}`
      } else {
        var q = form.fields.split(',')
        q.forEach(element => {
          query = query += `&fields[]=${element}`
        })
      }
    //   query = query += `&fields[]=${form.fields}`
    }
    if (this.present(form.payment_types)) {
      if (form.payment_types.length === 1) {
        query = query += `&payment_types[]=${form.payment_types}`
      } else {
        var w = form.payment_types
        w.forEach(element => {
          query = query += `&payment_types[]=${element}`
        })
      }

    //   query = query += `&payment_types[]=${form.payment_types.join(',')}`
    }
    return query
  },
  createQueryParams (filters, page = 1) {
    var query = `?page=${page}&limit=10`
    if (this.present(filters)) {
      if (this.present(filters.from) && this.present(filters.to)) {
        query = query + `&from=${filters.from}&to=${filters.to}`
      }
      if (this.present(filters.payment_types)) {
        query = query + `&payment_types[]=${filters.payment_types}`
      }
      if (this.present(filters.statuses)) {
        query = query + `&statuses[]=${filters.statuses}`
      }
      if (this.present(filters.search_value)) {
        query = query + `&search_value=${filters.search_value}`
      }
      if (this.present(filters.time_interval)) {
        query = query + `&time_interval=${filters.time_interval}`
      }
      if (this.present(filters.cash_flow)) {
        query = query + `&cash_flow=${filters.cash_flow}`
      }
      if (this.empty(filters.from) && this.empty(filters.to) && this.empty(filters.payment_types) && this.empty(filters.statuses)) {
        query = query + '&all=true'
      }
    } else {
      query = query + '&all=true'
    }
    return query
  },
  createPendingParams (filters, page = 1) {
    var query = `?page=${page}&limit=10`
    if (this.present(filters)) {
      if (this.present(filters.from) && this.present(filters.to)) {
        query = query + `&from=${filters.from}&to=${filters.to}`
      }
      if (this.present(filters.payment_types)) {
        query = query + `&payment_types[]=${filters.payment_types}`
      }
      if (this.present(filters.statuses)) {
        query = query + `&statuses[]=${filters.statuses}`
      }
      if (this.present(filters.search_value)) {
        query = query + `&search_value=${filters.search_value}`
      }
      if (this.present(filters.time_interval)) {
        query = query + `&time_interval=${filters.time_interval}`
      }
      if (this.present(filters.cash_flow)) {
        query = query + `&cash_flow=${filters.cash_flow}`
      }
    }
    return query
  },
  present (value) {
    if (!value) {
      return false
    }
    if (typeof value === 'object') {
      if (Object.keys(value).length > 0) {
        return true
      }
      return false
    }
    if (Array.isArray(value) || typeof value === 'string') {
      return value && value.length > 0
    } else {
      return !!value
    }
  },
  empty (value) {
    return !this.present(value)
  },
  sum (arr) {
    return arr.reduce((sum, x) => sum + x)
  },
  addContactToJobQuery (batch) {
    var query = `batch_details[Key]=${batch.Key}&batch_details[Bucket]=flopay-batchstore`
    return query
  },
  createJobQuery (schedule, job) {
    var newString = schedule
    switch (schedule) {
      case 'daily':
        newString = `${newString} at ${job.time}`
        break
      case 'weekly':
        newString = `${job.time} every ${job.date} `
        break
      case 'monthly':
        newString = `every month at ${job.date}`
        break
      case 'bimonthly':
        newString = `every 2 months at ${job.date}`
        break
      case 'quarterly':
        newString = `every 3 months at ${job.date}`
        break
      case 'yearly':
        newString = `every year at ${job.date}`
        break
      default:
        break
    }
    return newString
  },
  randomString2 (l) {
    let text = ''
    let charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < l; i++) {
      text += charList.charAt(Math.floor(Math.random() * charList.length))
    }
    return text
  }
}
