import { call, takeLatest, put } from 'redux-saga/effects'
import { replace } from 'react-router-redux'

import locations from '../../locations'

import {
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_WALLET_FAILURE
} from './actions'
import { FETCH_DISTRICTS_REQUEST } from 'modules/districts/actions'

import { connectEthereumWallet } from './utils'

export default function* saga() {
  yield takeLatest(FETCH_WALLET_REQUEST, handleWalletRequest)
  yield takeLatest(FETCH_WALLET_SUCCESS, handleWalletSuccess)
}

// Defined on `connectEthereumWallet`
let wallet = null

function* handleWalletRequest(action = {}) {
  try {
    wallet = yield call(() => connectEthereumWallet())

    const address = yield call(() => wallet.getAddress())

    yield put({
      type: FETCH_WALLET_SUCCESS,
      address: address
    })
  } catch (error) {
    yield put(replace(locations.walletError))
    yield put({ type: FETCH_WALLET_FAILURE, message: error.message })
  }
}

function* handleWalletSuccess(action) {
  yield put({ type: FETCH_DISTRICTS_REQUEST })
}
