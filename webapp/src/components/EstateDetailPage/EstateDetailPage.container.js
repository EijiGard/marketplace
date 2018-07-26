import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getMatchParams } from 'modules/location/selectors'
import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest
} from 'modules/estates/actions'
import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const { x, y, assetId } = getMatchParams(ownProps)
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    assetId
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { assetId } = getMatchParams(ownProps)
  return {
    submitEstate: estate =>
      assetId
        ? dispatch(editEstateParcelsRequest(estate))
        : dispatch(createEstateRequest(estate)),
    editEstateMetadata: estate => dispatch(editEstateMetadataRequest(estate))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
