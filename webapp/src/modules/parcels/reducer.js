import {
  FETCH_PARCEL_REQUEST,
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCEL_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE,
  MANAGE_PARCEL_REQUEST,
  MANAGE_PARCEL_SUCCESS,
  MANAGE_PARCEL_FAILURE,
  TRANSFER_PARCEL_REQUEST,
  TRANSFER_PARCEL_SUCCESS,
  TRANSFER_PARCEL_FAILURE
} from './actions'
import {
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS,
  PUBLISH_SUCCESS
} from 'modules/publication/actions'
import { FETCH_ADDRESS_PARCELS_SUCCESS } from 'modules/address/actions'
import {
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_PARCEL_PUBLICATIONS_SUCCESS
} from 'modules/publication/actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { FETCH_MAP_SUCCESS } from 'modules/map/actions'
import { loadingReducer } from 'modules/loading/reducer'
import { CREATE_ESTATE_SUCCESS } from 'modules/estates/actions'
import { buildCoordinate, normalizeParcel, toParcelObject } from 'shared/parcel'

import {
  FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS,
  FETCH_MORTGAGED_PARCELS_SUCCESS
} from '../mortgage/actions'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function parcelsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCEL_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PARCEL_SUCCESS: {
      const parcelId = action.parcel.id
      const parcel = state.data[parcelId]
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [parcelId]: normalizeParcel(action.parcel, parcel)
        }
      }
    }
    case FETCH_MAP_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: { ...state.data, ...action.assets.parcels }
      }
    }
    case FETCH_PUBLICATIONS_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    case FETCH_PARCEL_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_ADDRESS_PARCELS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.parcels
        }
      }
    }
    case EDIT_PARCEL_REQUEST:
    case EDIT_PARCEL_FAILURE:
    case EDIT_PARCEL_SUCCESS:
    case MANAGE_PARCEL_REQUEST:
    case MANAGE_PARCEL_SUCCESS:
    case MANAGE_PARCEL_FAILURE:
    case TRANSFER_PARCEL_REQUEST:
    case TRANSFER_PARCEL_SUCCESS:
    case TRANSFER_PARCEL_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PARCEL_PUBLICATIONS_SUCCESS: {
      const { x, y, publications } = action
      const parcelId = buildCoordinate(x, y)
      const parcel = state.data[parcelId]

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcelId]: {
            ...parcel,
            publication_tx_hash_history: publications.map(
              publication => publication.tx_hash
            )
          }
        }
      }
    }
    case FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS: {
      const { x, y, mortgages } = action
      const parcelId = buildCoordinate(x, y)
      const parcel = state.data[parcelId]

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcelId]: {
            ...parcel,
            mortgages_tx_hashes: mortgages.map(mortgage => mortgage.tx_hash)
          }
        }
      }
    }
    case FETCH_MORTGAGED_PARCELS_SUCCESS: {
      return {
        ...state,
        data: action.parcels.reduce(
          (parcels, parcel) => ({
            ...parcels,
            [buildCoordinate(parcel.x, parcel.y)]: Object.assign(
              {},
              parcels[buildCoordinate(parcel.x, parcel.y)],
              parcel
            )
          }),
          state.data
        )
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case EDIT_PARCEL_SUCCESS: {
          const { x, y, data } = transaction.payload
          const parcelId = buildCoordinate(x, y)
          return {
            ...state,
            data: {
              ...state.data,
              [parcelId]: {
                ...state.data[parcelId],
                data
              }
            }
          }
        }
        case TRANSFER_PARCEL_SUCCESS: {
          const { x, y, newOwner } = transaction.payload
          const parcelId = buildCoordinate(x, y)
          return {
            ...state,
            data: {
              ...state.data,
              [parcelId]: {
                ...state.data[parcelId],
                owner: newOwner.toLowerCase()
              }
            }
          }
        }
        case BUY_SUCCESS: {
          const owner = transaction.from
          const tx_hash = transaction.payload.tx_hash
          // unset publication_tx_hash and update owner
          return {
            ...state,
            data: Object.values(state.data).reduce((newParcels, parcel) => {
              if (parcel.publication_tx_hash === tx_hash) {
                newParcels[parcel.id] = {
                  ...parcel,
                  publication_tx_hash: null,
                  owner
                }
              } else {
                newParcels[parcel.id] = { ...parcel }
              }
              return newParcels
            }, {})
          }
        }
        case CANCEL_SALE_SUCCESS: {
          const tx_hash = transaction.payload.tx_hash
          // unset publication_tx_hash
          return {
            ...state,
            data: Object.values(state.data).reduce((newParcels, parcel) => {
              if (parcel.publication_tx_hash === tx_hash) {
                newParcels[parcel.id] = {
                  ...parcel,
                  publication_tx_hash: null
                }
              } else {
                newParcels[parcel.id] = parcel
              }
              return newParcels
            }, {})
          }
        }
        case PUBLISH_SUCCESS: {
          // set publication_tx_hash
          const { x, y, tx_hash } = transaction.payload
          const parcelId = buildCoordinate(x, y)

          if (parcelId in state.data) {
            const parcel = state.data[parcelId]
            return {
              ...state,
              data: {
                ...state.data,
                [parcelId]: {
                  ...parcel,
                  publication_tx_hash: tx_hash,
                  publication_tx_hash_history: [
                    tx_hash,
                    ...(parcel.publication_tx_hash_history || [])
                  ]
                }
              }
            }
          }
          return state
        }
        default:
          return state
      }
    }
    case CREATE_ESTATE_SUCCESS: {
      const { data, id: owner } = action.estate
      const newData = {}
      data.parcels.forEach(({ x, y }) => {
        const parcelId = buildCoordinate(x, y)
        newData[parcelId] = {
          ...state.data[parcelId],
          owner,
          is_estate: true
        }
      })
      return {
        ...state,
        data: {
          ...state.data,
          ...newData
        }
      }
    }
    default:
      return state
  }
}
