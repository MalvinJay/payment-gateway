import axios from 'axios'

var axiosCall = (data) => {
  let param = {
    method: data.method === undefined ? 'POST' : data.method,
    url: data.url,
    headers: {
      Authorization: 'Bearer ' + data.token,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    data: data.data,
    params: data.parameters
  }
  return axios(param)
}

var apiCall = (call) => {
  let url = call.url
  let method = call.method
  let parameters = call.parameters
  let data = call.data
  let token = call.token

  if (parameters) {
    Object.keys(parameters).map((param) => {
      let regEx = new RegExp('/:' + param + '/')
      if (regEx.test(url)) {
        let newUrl = url.replace('/:' + param + '/', '/' + parameters[param] + '/')
        url = newUrl
        delete parameters[param]
      }
    })
  }
  return axiosCall({
    token,
    url,
    data,
    method,
    parameters
  })
}

export { apiCall }
