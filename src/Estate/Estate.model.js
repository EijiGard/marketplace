import { Model } from 'decentraland-commons'

import { Asset } from '../Asset'

export class Estate extends Model {
  static tableName = 'estates'
  static columnNames = ['id', 'owner', 'data', 'last_transferred_at']

  static async findByOwner(owner) {
    return new Asset(this).findByOwner(owner)
  }

  static async findByOwnerAndStatus(owner, status) {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }

  static async findById(id) {
    return new Asset(this).findById(id)
  }

  static findByAssetId(asset_id) {
    return Estate.find({ asset_id }, { created_at: 'DESC' })
  }

  static async findByAssetIds(assetIds) {
    return new Asset(this).findByAssetIds(assetIds)
  }
}
