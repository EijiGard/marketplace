import { takeEvery, put, select, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import {
  CREATE_ESTATE_REQUEST,
  createEstateSuccess,
  createEstateFailure,
  FETCH_ESTATE_REQUEST,
  fetchEstateSuccess,
  fetchEstateFailure,
  EDIT_ESTATE_REQUEST,
  editEstateSuccess,
  editEstateFailure
} from './actions'
import { validateCoords } from './utils'
import { getEstates } from './selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { locations } from 'locations'
import { api } from 'lib/api'
import { buildCoordinate } from 'shared/parcel'

export function* estateSaga() {
  yield takeEvery(CREATE_ESTATE_REQUEST, handleCreateEstateRequest)
  yield takeEvery(EDIT_ESTATE_REQUEST, handleEditEstateRequest)
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

function* handleEditEstateRequest(action) {
  const { estate } = action
  const newParcels = estate.data.parcels
  try {
    newParcels.forEach(({ x, y }) => validateCoords(x, y))

    const pristineEstate = (yield select(getEstates))[estate.id]
    const pristineParcels = pristineEstate.data.parcels

    const parcelsToAdd = newParcels.filter(
      newParcel =>
        !pristineParcels.find(
          pristineParcel =>
            pristineParcel.x === newParcel.x && pristineParcel.y === newParcel.y
        )
    )

    const parcelsToDelete = pristineParcels.filter(
      pristineParcel =>
        !newParcels.find(
          newParcel =>
            pristineParcel.x === newParcel.x && pristineParcel.y === newParcel.y
        )
    )
    yield put(editEstateSuccess(parcelsToAdd, parcelsToDelete))
    // yield put(push(locations.activity))
  } catch (error) {
    yield put(editEstateFailure(estate, error.message))
  }
}

function* handleEstateRequest(action) {
  const { id } = action
  try {
    const { estates } = yield call(() => api.fetchEstates())
    const estate = estates.find(e => e.id === id)
    yield put(fetchEstateSuccess(id, estate))
  } catch (error) {
    yield put(fetchEstateFailure(id, error.message))
  }
}
