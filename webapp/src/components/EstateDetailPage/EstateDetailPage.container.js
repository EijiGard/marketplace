import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getMatchParams } from 'modules/location/selectors'
import { createEstateRequest } from 'modules/estates/actions'
import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const { x, y, id } = getMatchParams(ownProps)
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    id
  }
}

const mapDispatch = dispatch => {
  return {
    createEstate: estate => dispatch(createEstateRequest(estate))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
