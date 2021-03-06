import { expect } from 'chai'

import { Parcel } from '../Parcel'
import { Estate } from '../Estate'
import { Publication } from './Publication.model'
import { PublicationService } from './Publication.service'
import { PublicationRequestFilters } from './PublicationRequestFilters'
import { ASSET_TYPE } from '../shared/asset'
import { PUBLICATION_STATUS } from '../shared/publication'

describe('Publication', function() {
  describe('.primaryKey', function() {
    it('should set the primary key to `tx_hash`', function() {
      expect(Publication.primaryKey).to.equal('tx_hash')
    })
  })
})

describe('PublicationRequestFilters', function() {
  const buildRequest = request => ({
    headers: {},
    ...request
  })

  describe('.sanitize', function() {
    it('should return an object obtaining the data from the request', function() {
      const request = buildRequest({
        query: {
          status: PUBLICATION_STATUS.sold,
          type: ASSET_TYPE.estate,
          sort_by: 'price',
          sort_order: 'desc',
          limit: 33,
          offset: 10
        }
      })

      const filters = new PublicationRequestFilters(request)
      expect(filters.sanitize()).to.deep.equal({
        status: PUBLICATION_STATUS.sold,
        type: ASSET_TYPE.estate,
        sort: {
          by: 'price',
          order: 'ASC'
        },
        pagination: {
          limit: 33,
          offset: 10
        }
      })
    })

    it('should only allow pre-determined values', function() {
      const request = buildRequest({
        query: {
          status: '--SELECT * FROM publications;',
          type: '--UPDATE parcels set x = 9999;--',
          sort_by: ';/**/DELETE * FROM publications;',
          sort_order: ';/**/;',
          limit: 10000,
          offset: -100
        }
      })

      const filters = new PublicationRequestFilters(request)
      expect(filters.sanitize()).to.deep.equal({
        status: PUBLICATION_STATUS.open,
        type: ASSET_TYPE.parcel,
        sort: {
          by: 'created_at',
          order: 'DESC'
        },
        pagination: {
          limit: 100,
          offset: 0
        }
      })
    })
  })
})

describe('PublicationService', function() {
  describe('#getModelByType', function() {
    it('should return the model class for the supplied type', function() {
      const service = new PublicationService()
      expect(service.getModelFromType(ASSET_TYPE.parcel)).to.be.equal(Parcel)
      expect(service.getModelFromType(ASSET_TYPE.estate)).to.be.equal(Estate)
    })

    it('should throw if the type is invalid', function() {
      expect(() =>
        new PublicationService().getModelFromType('Nonsense')
      ).to.throw('Invalid publication type "Nonsense"')
    })
  })
})
