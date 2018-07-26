// import { contracts } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Estate } from '../../src/Estate'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { getParcelIdFromEvent, decodeMetadata } from './utils'
import { Parcel } from '../../src/Parcel'

const log = new Log('estateReducer')

export async function estateReducer(event) {
  const { block_number, name, normalizedName } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (normalizedName) {
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
      const { to, estateId, metadata } = event.args
      const asset_id = estateId.toNumber()

      const exists = await Estate.count({ asset_id })
      if (exists) {
        log.info(`[${name}] Estate ${asset_id} already exists`)
        return
      }

      const data = decodeMetadata(metadata)

      log.info(`[${name}] Creating Estate "${asset_id}" with owner "${to}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      await Estate.insert({
        owner: to.toLowerCase(),
        data: { name: data.name, description: data.description },
        asset_id,
        last_transferred_at
      })
      break
    }
    case BlockchainEvent.EVENTS.addLand: {
      const { estateId } = event.args
      const estate = (await Estate.findById({
        asset_id: estateId.toNumber()
      }))[0]

      log.info(
        `[${name}] Update Estate "${estateId.toNumber()}" add land owner (${x},${y})`
      )
      const [x, y] = Parcel.splitId(parcelId)
      await Estate.update({
        data: { ...estate.data, parcels: [...estate.data.parcels, { x, y }] }
      })
      break
    }
    case BlockchainEvent.EVENTS.removeLand: {
      const { estateId } = event.args
      const estate = (await Estate.findById({
        asset_id: estateId.toNumber()
      }))[0]

      log.info(
        `[${name}] Update Estate "${estateId.toNumber()}" add land owner (${x},${y})`
      )
      const [x, y] = Parcel.splitId(parcelId)
      await Estate.update({
        data: {
          ...estate.data,
          parcels: estate.data.parcels.filter(p => (p.x === x) & (p.y === y))
        }
      })
      break
    }
    case BlockchainEvent.EVENTS.estateTransfer: {
      const { to, estateId } = event.args

      log.info(
        `[${name}] Transfering "${estateId.toNumber()}" owner to "${to}"`
      )

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Estate.update(
        { owner: to.toLowerCase(), last_transferred_at },
        { asset_id: estateId.toNumber() }
      )
      break
    }
    default:
      break
  }
}
