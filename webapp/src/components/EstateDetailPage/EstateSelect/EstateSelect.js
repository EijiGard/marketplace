import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Container } from 'semantic-ui-react'

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import EstateSelectActions from './EstateSelectActions'
import { t } from 'modules/translation/utils'
import { coordsType } from 'components/types'
import { getCoordsMatcher, isEqualCoords, buildCoordinate } from 'shared/parcel'
import { isOwner } from 'shared/asset'
import './EstateSelect.css'

export default class EstateSelect extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    estate: PropTypes.object,
    parcels: PropTypes.arrayOf(coordsType).isRequired,
    error: PropTypes.string,
    wallet: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  // TODO move all this functions to an estate util file
  isNeighbour = (x, y) => coords => {
    return (
      (coords.x === x && (coords.y + 1 === y || coords.y - 1 === y)) ||
      (coords.y === y && (coords.x + 1 === x || coords.x - 1 === x))
    )
  }

  hasNeighbour = (x, y) => {
    const { parcels } = this.props
    return parcels.some(this.isNeighbour(x, y))
  }

  getNeighbours = (x, y, parcels = this.props.parcels) => {
    return parcels.filter(this.isNeighbour(x, y))
  }

  areConnected = (parcels, alreadyTraveled = [], remaining = [...parcels]) => {
    if (alreadyTraveled.length === parcels.length) {
      return true
    }

    if (remaining.length === 0) {
      return false
    }

    let actual = remaining.pop()

    const neighbours = this.getNeighbours(actual.x, actual.y, parcels).filter(
      coords => {
        return (
          parcels.some(getCoordsMatcher(coords)) &&
          !alreadyTraveled.some(getCoordsMatcher(coords))
        )
      }
    )

    return this.areConnected(
      parcels,
      [...alreadyTraveled, ...neighbours],
      remaining
    )
  }

  handleParcelClick = wallet => (estate, { x, y }) => {
    if (!isOwner(wallet, buildCoordinate(x, y))) {
      return
    }

    if (!this.hasNeighbour(x, y)) {
      return
    }

    const { parcels, onChange } = this.props
    const isSelected = parcels.some(getCoordsMatcher({ x, y }))

    if (isSelected) {
      const newParcels = parcels.filter(
        coords => !isEqualCoords(coords, { x, y })
      )

      if (!this.areConnected(newParcels) && newParcels.length > 1) {
        return
      }

      return onChange(newParcels)
    }

    onChange([...parcels, { x, y }])
  }

  render() {
    const {
      estate,
      x,
      y,
      error,
      onCancel,
      onContinue,
      parcels,
      wallet,
      allParcels
    } = this.props
    if (error) {
      return null
    }
    return (
      <div className="EstateSelect">
        <div className="parcel-preview" title={t('parcel_detail.view')}>
          <AssetDetailPage
            asset={estate}
            onAssetClick={this.handleParcelClick(wallet)}
          />
        </div>
        <Container>
          <Grid className="estate-selection">
            <Grid.Row>
              <Grid.Column width={8}>
                <h3>{t('estate_select.selection')}</h3>
                <p className="description">
                  {t('estate_select.description', { x, y })}
                </p>
              </Grid.Column>
              <Grid.Column className="parcel-actions-container" width={8}>
                <EstateSelectActions
                  onCancel={onCancel}
                  onContinue={onContinue}
                  disabled={parcels.length <= 1}
                />
              </Grid.Column>
              <Grid.Column width={16}>
                {parcels.map(({ x, y }) => {
                  const parcel = allParcels[`${x},${y}`]
                  return parcel ? (
                    <ParcelCard
                      key={parcel.id}
                      parcel={parcel}
                      withMap={false}
                    />
                  ) : null
                })}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
