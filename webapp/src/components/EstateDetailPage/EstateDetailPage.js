import React from 'react'
import PropTypes from 'prop-types'

import EstateDetail from './EstateDetail'
import Estate from 'components/Estate'

export default class EstateDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    id: PropTypes.string,
    submitEstate: PropTypes.func.isRequired,
    editEstateMetadata: PropTypes.func.isRequired
  }

  render() {
    const { id, x, y, submitEstate, editEstateMetadata } = this.props
    return (
      <Estate id={id} x={x} y={y}>
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
