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
  }
}
