import { WS_URL } from './constants'
import store from '../store/store'

var ActionCable = require('actioncable')
let actionCable = null

let Cable = function () {

}

Cable.open = function () {
  if (!actionCable) {
    actionCable = ActionCable.createConsumer(
      `ws://d24046cf.ngrok.io/websocket?client_code=${store.getters.user.client.code}`
      // `${WS_URL}`
    )
  }
  return actionCable
}

export default Cable
