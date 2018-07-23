import React from 'react'
import PropTypes from 'prop-types'

import EstateDetail from './EstateDetail'
import Estate from 'components/Estate'

export default class EstateDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    id: PropTypes.string,
    createEstate: PropTypes.func.isRequired
  }

  render() {
    const { id, x, y, createEstate } = this.props
    return (
      <Estate id={id} x={x} y={y}>
        {(estate, isOwner, wallet) => (
          <EstateDetail
            estate={estate}
            isOwner={isOwner}
            wallet={wallet}
            createEstate={createEstate}
          />
        )}
      </Estate>
    )
  }
}
