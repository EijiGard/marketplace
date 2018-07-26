import { takeEvery, put, select, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { getParcelsNotIncluded } from 'shared/utils'

import {
  CREATE_ESTATE_REQUEST,
  createEstateSuccess,
  createEstateFailure,
  FETCH_ESTATE_REQUEST,
  fetchEstateSuccess,
  fetchEstateFailure,
  EDIT_ESTATE_PARCELS_REQUEST,
  editEstateParcelsSuccess,
  editEstateParcelsFailure
} from './actions'
import { validateCoords } from './utils'
import { getEstates } from './selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { locations } from 'locations'
import { api } from 'lib/api'
import { buildCoordinate } from 'shared/parcel'

export function* estateSaga() {
  yield takeEvery(CREATE_ESTATE_REQUEST, handleCreateEstateRequest)
  yield takeEvery(EDIT_ESTATE_PARCELS_REQUEST, handleEditEstateParcelsRequest)
  yield takeEvery(FETCH_ESTATE_REQUEST, handleEstateRequest)
}

// TODO delete when estate contract returns an address
function randomString(length) {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1)
}

function* handleCreateEstateRequest(action) {
  const { estate } = action
  try {
    estate.data.parcels.forEach(({ x, y }) => validateCoords(x, y))
    // call estate contract
    const contractAddress = randomString(42)
    const txHash = randomString(42)
    const allParcels = yield select(getParcels)
    const [parcel] = estate.data.parcels
    const { owner } = allParcels[buildCoordinate(parcel.x, parcel.y)]

    yield put(
      createEstateSuccess(txHash, {
        ...estate,
        id: contractAddress,
        owner
      })
    )
    yield put(push(locations.activity))
  } catch (error) {
    yield put(createEstateFailure(estate, error.message))
  }
}

function* handleEditEstateParcelsRequest(action) {
  const { estate } = action
  const newParcels = estate.data.parcels
  try {
    newParcels.forEach(({ x, y }) => validateCoords(x, y))

    const pristineEstate = (yield select(getEstates))[estate.asset_id]
    const pristineParcels = pristineEstate.data.parcels

    const parcelsToAdd = getParcelsNotIncluded(newParcels, pristineParcels)

    const parcelsToDelete = getParcelsNotIncluded(pristineParcels, newParcels)

    yield put(editEstateParcelsSuccess(parcelsToAdd, parcelsToDelete))
    // yield put(push(locations.activity))
  } catch (error) {
    yield put(editEstateParcelsFailure(estate, error.message))
  }
}

function* handleEstateRequest(action) {
  const { assetId } = action
  try {
    const estate = yield call(() => api.fetchEstate(assetId))
    yield put(fetchEstateSuccess(assetId, estate))
  } catch (error) {
    yield put(fetchEstateFailure(assetId, error.message))
  }
}
