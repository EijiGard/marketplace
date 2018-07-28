import React from 'react'
import PropTypes from 'prop-types'

import { estateType, walletType } from 'components/types'
import EstateSelect from './EstateSelect'
import EditEstate from './EditEstate'
import { isNewAsset } from 'shared/asset'

export default class EstateDetail extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    wallet: walletType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    submitEstate: PropTypes.func.isRequired,
    editEstateMetadata: PropTypes.func.isRequired,
    isCreation: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      isSelecting: true,
      estate: this.props.estate
    }
  }

  componentDidUpdate(prevProps) {
    const { estate, isCreation } = this.props
    const prevEstate = prevProps.estate
    if (
      (!isCreation && !prevProps.estate && estate) ||
      (prevEstate && prevEstate.asset_id != estate.asset_id)
    ) {
      this.setState({ estate })
    }
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
    const { estate, isSelecting } = this.state
    if (isNewAsset(estate) || isSelecting) {
      this.props.submitEstate(estate)
    } else {
      this.props.editEstateMetadata(estate)
    }
  }

  componentDidMount() {}

  render() {
    const { isSelecting, estate } = this.state
    const { wallet, isCreation } = this.props

    return (
      <React.Fragment>
        {isSelecting ? (
          <EstateSelect
            estate={estate}
            parcels={estate.data.parcels}
            onContinue={this.handleSwitch}
            onChange={this.handleChangeParcels}
            onSubmit={this.handleSubmit}
            wallet={wallet}
            isCreation={isCreation}
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
  }
}
