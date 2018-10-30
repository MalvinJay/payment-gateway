import Utils from '../../utils/utils'

// properties
let Dashboard = function (obj, isDetailed) {
  // Object.assign(this, getEditView())
//   // if is not detailed view populate only certain fields
//   // and return
//   if (isDetailed === false) {
//     Object.assign(this, obj)
//     this.name = `${this.first_name} ${this.surname} ${this.other_names}`
//     return
//   }
//   //   new detailed view for creating new object
//   if (!obj) {
//     Object.assign(this, getCreateView())
//     return
//   }

//   //   else create from json
//   //   obj = fakeAgent
//   let agent = Utils.cloneObject(obj)
//   Object.assign(this, agent)
//   this.phone_numbers = []
//   if (
//     !agent.other_phone_numbers &&
//     !agent.registered_phone &&
//     Object.keys(agent.registered_phone).length === 0
//   ) {
//     agent.other_phone_numbers = {
//       carrier: null,
//       primary: true,
//       ported: false,
//       number: ''
//     }
//     this.phone_numbers.push(agent.other_phone_numbers)
//   } else {
//     // add registered phone
//     // if (agent.registered_phone) {
//     //   this.phone_numbers.push(agent.registered_phone)
//     // }
//     // add other phone numbers
//     agent.other_phone_numbers.forEach(element => {
//       this.phone_numbers.push(element)
//     })
//     this.phone_numbers = this.phone_numbers.filter(
//       (thing, index, self) =>
//         index === self.findIndex(t => t.number === thing.number)
//     )
//     // check for empty phones
//     this.phone_numbers.forEach((element, index) => {
//       if (element.number == null) {
//         console.log('To be cut out', element)
//         this.phone_numbers.splice(index, 1)
//       }
//         element.is_mobile_money = element.number_type == 'mobile_money'
//         if (element.carrier == 'unknown' || Utils.empty(element.carrier)) {
//             element.carrier = null
//         }
//     })
//     console.log('phone after', this.phone_numbers)
//     this.phone = this.phone_numbers[0].number
//   }
//   this.addresses = agent.addresses || [
//     {
//       box_number: null,
//       city: null,
//       description: null,
//       post_code: null,
//       street: null,
//       suburb: null,
//       house_number: null
//     }
//   ]

//   this.store_address = {}
//   if (obj.store_coordinates) {
//     this.store_address.geo_coordinate = obj.store_coordinates
//     this.store_address.description = ''
//   }
//   this.societies = this.societies || []
//   //   settings
//   this.settings = this.settings || {}
//   this.quota = this.settings.quota
//   this.target = this.settings.target
//   this.isDetailed = true
}

const getEditView = (dashboard, type) => {
//   task.time_config.execution_time.by_periods.periods.map((rl) => {
//     rl.duration = !rl.days ? [] : rl.days.split('')
//     return rl
//   })
  if (type === 'day') {
    dashboard.map(el => {
      el.label = `${el.hour}:00`
      return el
    })
  } else if (type === 'week') {
    dashboard.map(el => {
      el.label = `${el.day}`
      return el
    })
  } else if (type === 'month') {
    dashboard.map(el => {
      el.label = `Day ${el.day}`
      return el
    })
  } else if (type === 'quarter') {
    var arr = []
    dashboard.map(el => {
      var count = Utils.sum(el.map(element => element.count))
      var deposit_count = Utils.sum(el.map(element => element.deposit_count))
      var withdrawal_count = Utils.sum(el.map(element => element.withdrawal_count))

      var month = {
        label: el[0].month,
        count,
        deposit_count,
        withdrawal_count
      }
      arr.push(month)
    })
    return arr
  } else {
    dashboard.map(el => {
      el.label = `${el.month}`
      return el
    })
  }
  return dashboard
}

Dashboard.getEditView = getEditView
export default Dashboard
