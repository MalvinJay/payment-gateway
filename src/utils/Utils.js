export default {
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
    let char_list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < l; i++) {
      text += char_list.charAt(Math.floor(Math.random() * char_list.length))
    }
    return text
  }
}
