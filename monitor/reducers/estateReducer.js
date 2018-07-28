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
    case BlockchainEvent.EVENTS.estateCreate: {
      const { owner, estateId, metadata } = event.args

      const exists = await Estate.count({ asset_id: estateId })
      if (exists) {
        log.info(`[${name}] Estate ${estateId} already exists`)
        return
      }

      const data = decodeMetadata(metadata)

      log.info(`[${name}] Creating Estate "${estateId}" with owner "${owner}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      await Estate.insert({
        owner: owner.toLowerCase(),
        data: { name: data.name, description: data.description },
        asset_id: estateId,
        last_transferred_at
      })
      break
    }
    case BlockchainEvent.EVENTS.addLand: {
      if (parcelId) {
        const { estateId } = event.args
        const estate = (await Estate.findByAssetId({
          asset_id: estateId
        }))[0]
        const [x, y] = Parcel.splitId(parcelId)
        log.info(
          `[${name}] Update Estate "${estateId}" add land owner (${x},${y})`
        )
        await Estate.update({
          data: { ...estate.data, parcels: [...estate.data.parcels, { x, y }] }
        })
      }
      break
    }
    case BlockchainEvent.EVENTS.removeLand: {
      if (parcelId) {
        const { estateId } = event.args
        const estate = (await Estate.findByAssetId({
          asset_id: estateId
        }))[0]

        log.info(
          `[${name}] Update Estate "${estateId}" add land owner (${x},${y})`
        )
        const [x, y] = Parcel.splitId(parcelId)
        await Estate.update({
          data: {
            ...estate.data,
            parcels: estate.data.parcels.filter(p => (p.x === x) & (p.y === y))
          }
        })
      }
      break
    }
    case BlockchainEvent.EVENTS.estateTransfer: {
      const { to, estateId } = event.args

      log.info(`[${name}] Transfering "${estateId}" owner to "${to}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Estate.update(
        { owner: to.toLowerCase(), last_transferred_at },
        { asset_id: estateId }
      )
      break
    }
    default:
      break
  }
}
