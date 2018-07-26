import React from 'react'
import PropTypes from 'prop-types'

import EstateDetail from './EstateDetail'
import Estate from 'components/Estate'

export default class EstateDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    assetId: PropTypes.string,
    submitEstate: PropTypes.func.isRequired,
    editEstateMetadata: PropTypes.func.isRequired
  }

  render() {
    const { assetId, x, y, submitEstate, editEstateMetadata } = this.props
    return (
      <Estate assetId={assetId} x={x} y={y}>
        {(estate, isOwner, wallet) => (
          <EstateDetail
            estate={estate}
            isOwner={isOwner}
            wallet={wallet}
            submitEstate={submitEstate}
            editEstateMetadata={editEstateMetadata}
          />
        )}
      </Estate>
    )
  }
}
