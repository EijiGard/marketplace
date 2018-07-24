// import { contracts } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Estate } from '../../src/Estate'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { getParcelIdFromEvent } from './utils'

const log = new Log('parcelReducer')

export async function parcelReducer(event) {
  const { block_number, name } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (name) {
    //case BlockchainEvent.EVENTS.estateUpdate: {
    //  try {
    //    const { data } = event.args
    //    const attributes = {
    //      data: contracts.LANDRegistry.decodeLandData(data)
    //    }
    //    const attrsStr = JSON.stringify(attributes)
    //
    //    log.info(`[${name}] Updating "${parcelId}" with ${attrsStr}`)
    //    await Parcel.update(attributes, { id: parcelId })
    //  } catch (error) {
    //    log.info(`[${name}] Skipping badly formed data for "${parcelId}"`)
    //  }
    //  break
    //}
    case BlockchainEvent.EVENTS.estateCreate: {
      const { to, metadata } = event.args

      log.info(`[${name}] Transfering "${parcelId}" owner to "${to}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      await Estate.insert({
        owner: to.toLowerCase(),
        data: { name: metadata },
        last_transferred_at
      })
      break
    }
    default:
      break
  }
}
