import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Container } from 'semantic-ui-react'

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import EstateSelectActions from './EstateSelectActions'
import { t } from 'modules/translation/utils'
import { coordsType, parcelType, estateType } from 'components/types'
import { getCoordsMatcher, isEqualCoords, buildCoordinate } from 'shared/parcel'
import { isOwner } from 'shared/asset'
import { hasNeighbour, areConnected } from 'shared/estate'
import { getParcelsNotIncluded } from 'shared/utils'
import './EstateSelect.css'

export default class EstateSelect extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    estate: estateType.isRequired,
    estatePristine: estateType,
    parcels: PropTypes.arrayOf(coordsType).isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    error: PropTypes.string,
    wallet: PropTypes.object.isRequired,
    isCreation: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onViewAssetClick: PropTypes.func.isRequired
  }

  handleParcelClick = wallet => (estate, { x, y }) => {
    if (
      !isOwner(wallet, buildCoordinate(x, y)) &&
      !isOwner(wallet, estate.asset_id)
    ) {
      return
    }

    const { parcels, onChange } = this.props
    if (!hasNeighbour(x, y, parcels)) {
      //@nacho TODO: revisit this
      // return
    }

    const isSelected = parcels.some(getCoordsMatcher({ x, y }))
    if (isSelected) {
      const newParcels = parcels.filter(
        coords => !isEqualCoords(coords, { x, y })
      )

      if (
        (!areConnected(newParcels, parcels) && newParcels.length > 1) ||
        !newParcels.length
      ) {
        return
      }

      return onChange(newParcels)
    }

    onChange([...parcels, { x, y }])
  }

  canContinue = parcels => {
    if (parcels.length > 1) {
      return true
    }

    if (this.props.estatePristine) {
      return !this.hasParcelsChanged(parcels)
    }

    return false
  }

  hasParcelsChanged = parcels => {
    const { estatePristine } = this.props
    if (!estatePristine) {
      return false
    }

    const pristineParcels = estatePristine.data.parcels

    if (pristineParcels.length != parcels.length) {
      return true
    }

    if (
      getParcelsNotIncluded(parcels, pristineParcels).length ||
      getParcelsNotIncluded(pristineParcels, parcels).length
    ) {
      return true
    }

    return false
  }

  render() {
    const {
      estate,
      x,
      y,
      error,
      onCancel,
      onContinue,
      onSubmit,
      parcels,
      wallet,
      allParcels,
      onViewAssetClick,
      isCreation
    } = this.props
    if (error) {
      return null
    }

    const canEdit = isCreation || isOwner(wallet, estate.asset_id)

    return (
      <div className="EstateSelect">
        <div className="parcel-preview" title={t('parcel_detail.view')}>
          <AssetDetailPage
            asset={estate}
            onAssetClick={
              canEdit ? this.handleParcelClick(wallet) : onViewAssetClick
            }
          />
        </div>
        <Container>
          <Grid className="estate-selection">
            <Grid.Row>
              <Grid.Column width={8}>
                <h3>
                  {isCreation
                    ? t('estate_select.selection')
                    : t('estate_select.detail')}
                </h3>
                <p className="description">
                  {isCreation
                    ? t('estate_select.description', { x, y })
                    : t('global.parcels', { x, y })}
                </p>
              </Grid.Column>
              {canEdit && (
                <Grid.Column className="parcel-actions-container" width={8}>
                  <EstateSelectActions
                    isCreation={isCreation}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onContinue={onContinue}
                    canContinue={this.canContinue(parcels)}
                    canEditMetadata={!this.hasParcelsChanged(parcels)}
                  />
                </Grid.Column>
              )}
              <Grid.Column width={16} className={'selected-parcels'}>
                {allParcels &&
                  parcels.map(({ x, y }) => {
                    const parcel = allParcels[buildCoordinate(x, y)]
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
