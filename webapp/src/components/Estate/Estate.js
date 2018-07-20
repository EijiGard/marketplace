import React from 'react'
import PropTypes from 'prop-types'

import { estateType } from 'components/types'
import Asset from 'components/Asset'
import { isNewAsset } from 'shared/asset'

export default class Estate extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    onAccessDenied: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    onEstateFetched: PropTypes.func
  }

  static defaultProps = {
    estate: null
  }

  componentDidMount() {
    const { id, onEstateFetched, x, y, estate } = this.props

    if (isNewAsset(id)) {
      return onEstateFetched({
        data: {
          name: '',
          description: '',
          parcels: [{ x, y }]
        }
      })
    } else if (estate && typeof onEstateFetched === 'function') {
      return onEstateFetched(estate)
    }
  }

  componentDidUpdate(prevProps) {
    const { id, onEstateFetched, estate } = this.props
    if (
      !isNewAsset(id) &&
      !prevProps.estate &&
      estate &&
      typeof onEstateFetched === 'function'
    ) {
      return onEstateFetched(estate)
    }
  }

  isConnected = address => {
    return address.estate_ids && address.estate_ids.length > 0
  }

  render() {
    const { id, estate } = this.props
    return (
      <Asset
        value={isNewAsset(id) ? {} : estate}
        isConnected={this.isConnected}
        {...this.props}
      />
    )
  }
}
