import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchEstateRequest } from 'modules/estates/actions'
import { getData as getEstates, getLoading } from 'modules/estates/selectors'
import { isNewAsset } from 'shared/asset'

import Estate from './Estate'

const mapState = (state, { id }) => {
  const estates = getEstates(state)
  const isLoading = isNewAsset(id)
    ? false
    : getLoading(state).some(estate => estate.id === id)
  const estate = isNewAsset(id) ? null : estates[id]
  return {
    isLoading,
    estate
  }
}

const mapDispatch = (dispatch, { id }) => ({
  onLoaded: () => dispatch(fetchEstateRequest(id)),
  onAccessDenied: () => dispatch(push(locations.estateDetail(id)))
})

export default connect(mapState, mapDispatch)(Estate)
