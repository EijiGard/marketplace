import React from 'react'
import PropTypes from 'prop-types'

import EstateSelect from './EstateSelect'
import EditEstate from './EditEstate'
import Estate from 'components/Estate'
import { parcelType } from 'components/types'

export default class EstateDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    id: PropTypes.string,
    allParcels: PropTypes.objectOf(parcelType),
    createEstate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      isSelecting: true
    }
  }

  updateState = estate => {
    this.setState({ estate })
  }

  handleSwitch = () => {
    this.setState({ isSelecting: !this.state.isSelecting })
  }

  handleChangeParcels = parcels => {
    const { estate } = this.state
    this.setState({
      estate: {
        ...estate,
        data: {
          ...estate.data,
          parcels
        },
        parcels
      }
    })
  }

  handleChange = estate => {
    this.setState({ ...this.state, estate })
  }

  handleSubmit = () => {
    this.props.createEstate(this.state.estate)
  }

  render() {
    const { isSelecting, estate } = this.state
    const { id, x, y } = this.props
    return (
      <Estate id={id} x={x} y={y} onEstateFetched={this.updateState}>
        {(asset, isOwner, wallet) => {
          if (!estate) {
            return null
          }
          return (
            <React.Fragment>
              {isSelecting ? (
                <EstateSelect
                  estate={estate}
                  parcels={estate.data.parcels}
                  onContinue={this.handleSwitch}
                  onChange={this.handleChangeParcels}
                  wallet={wallet}
                />
              ) : (
                <EditEstate
                  estate={estate}
                  parcels={estate.data.parcels}
                  onCancel={this.handleSwitch}
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                />
              )}
            </React.Fragment>
          )
        }}
      </Estate>
    )
  }
}
