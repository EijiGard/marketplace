import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { locations } from 'locations'

import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getError } from 'modules/estates/selectors'
import EstateSelect from './EstateSelect'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    allParcels: getParcels(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  return {
    onError: error => dispatch(navigateTo(locations.root)),
    onCancel: () => dispatch(navigateTo(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateSelect))
