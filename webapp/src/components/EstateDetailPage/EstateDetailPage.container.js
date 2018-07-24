import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getMatchParams } from 'modules/location/selectors'
import { isNewAsset } from 'shared/asset'
import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest
} from 'modules/estates/actions'
import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const { x, y, id } = getMatchParams(ownProps)
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    id
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)
  return {
    submitEstate: estate =>
      isNewAsset(id)
        ? dispatch(createEstateRequest(estate))
        : dispatch(editEstateParcelsRequest(estate)),
    editEstateMetadata: estate => dispatch(editEstateMetadataRequest(estate))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
