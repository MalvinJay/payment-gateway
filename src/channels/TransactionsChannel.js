import Cable from '@/utils/Cable'
import EventBus from '../event-bus'
import store from '../store/store'
// import i18n from '@/i18n'

let TransactionsChannel = function () {

}

let channel

TransactionsChannel.open = function () {
  if (!channel) {
    let cable = Cable.open()
    window.cable = cable
    let client_code = store.getters.user.client_code
    channel = cable.subscriptions.create({ channel: 'TransactionsChannel' }, {
      received (data) {
        // console.log('received the websocket steeze', data)
        // let message, action
        // switch (data.action) {
        //   case 'create':
        //     // message = i18n.t('notifications.newCreated', {model: i18n.tc('agent', 1)})
        //     action = 'TRANSACTION_CREATED'
        //     break
        //   case 'update':
        //     action = 'TRANSACTION_UPDATED'
        //     break
        // }
        // if (message) {
        // //   notify.info(message)
        // }
        // console.log('received the websocket steeze', action)
        // if (action) {
        //   EventBus.$emit(`WS_${action}`, data.data)
        // }
      }
    })
  }
}

export default TransactionsChannel
