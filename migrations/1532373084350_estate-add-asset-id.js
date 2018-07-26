import { Estate } from '../src/Estate'
import { Parcel } from '../src/Parcel'
import { BlockchainEvent } from '../src/BlockchainEvent'

const estateTableName = Estate.tableName
const parcelTableName = Parcel.tableName
const blockchainTableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.addColumns(estateTableName, {
    asset_id: { type: 'TEXT', notNull: true }
  })

  pgm.addColumns(parcelTableName, {
    estate_id: { type: 'TEXT' }
  })

  pgm.addColumns(blockchainTableName, {
    address: { type: 'TEXT', notNull: true }
  })

  pgm.dropColumns(parcelTableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}

exports.down = pgm => {
  pgm.dropColumns(estateTableName, {
    asset_id: { type: 'TEXT' }
  })

  pgm.dropColumns(parcelTableName, {
    estate_id: { type: 'TEXT' }
  })

  pgm.dropColumns(blockchainTableName, {
    address: { type: 'TEXT', notNull: true }
  })

  pgm.addColumns(parcelTableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}
