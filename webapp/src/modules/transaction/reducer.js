import { txUtils } from 'decentraland-commons'
import {
  FETCH_TRANSACTION_REQUEST,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILURE
} from './actions'
import { loadingReducer } from 'modules/loading/reducer'
import { getTransactionFromAction, omitTransactionFromAction } from './utils'

const { TRANSACTION_STATUS } = txUtils

const INITIAL_STATE = {
  data: [],
  loading: [],
  error: null
}

export function transactionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TRANSACTION_REQUEST: {
      const transaction = getTransactionFromAction(action.actionRef)
      const actionRef = omitTransactionFromAction(action.actionRef) // Slimmer state
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: [
          ...state.data,
          {
            ...transaction,
            timestamp: Date.now(),
            action: actionRef,
            status: TRANSACTION_STATUS.pending
          }
        ]
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: state.data.map(
          transaction =>
            action.transaction.hash === transaction.hash
              ? {
                  ...transaction,
                  ...action.transaction,
                  status: TRANSACTION_STATUS.confirmed
                }
              : transaction
        )
      }
    }
    case FETCH_TRANSACTION_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error,
        data: state.data.map(
          transaction =>
            action.transaction.hash === transaction.hash
              ? {
                  ...transaction,
                  ...action.transaction,
                  status: TRANSACTION_STATUS.failed,
                  error: action.error
                }
              : transaction
        )
      }
    }
    default:
      return state
  }
}
