import { Estate, Parcel } from '../src/Estate'

const estateTableName = Estate.tableName
const parcelTableName = Parcel.tableName

exports.up = pgm => {
  pgm.addColumns(estateTableName, {
    asset_id: { type: 'TEXT', notNull: true }
  })

  pgm.addColumns(parcelTableName, {
    estate_id: { type: 'TEXT', notNull: true }
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
    estate_id: { type: 'TEXT', notNull: true }
  })

  pgm.addColumns(parcelTableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}
