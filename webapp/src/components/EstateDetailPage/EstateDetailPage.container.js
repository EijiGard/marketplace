import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getMatchParams } from 'modules/location/selectors'
import { createEstateRequest } from 'modules/estates/actions'
import { getEstateByIdFactory } from 'modules/estates/selectors'
import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const { x, y, id } = getMatchParams(ownProps)
  console.log(x, y, id)
  if (id) {
    const getEstateById = getEstateByIdFactory(id)
    return state => ({
      estate: getEstateById(state)
    })
  }
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    createEstate: estate => dispatch(createEstateRequest(estate))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
