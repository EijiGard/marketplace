import { connect } from 'react-redux'

import EditState from './EditEstate'
import { getData as getParcels } from 'modules/parcels/selectors'

const mapState = state => ({
  allParcels: getParcels(state)
})

export default connect(mapState)(EditState)
