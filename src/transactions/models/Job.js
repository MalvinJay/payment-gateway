import Utils from '../../utils/services'

// properties
let Job = function (obj, isDetailed) {

}

const getCreateView = (viewModel) => {
  let model = {}
  model = viewModel
  model.is_sub_user = false
  model.contacts = viewModel.contacts.map(el => el.name)
  return model
}

Job.getCreateView = getCreateView
export default Job
