import React from 'react'
import PropTypes from 'prop-types'

import { t } from 'modules/translation/utils'
import EstateModal from './EstateModal'
import EditEstateForm from './EditEstateForm'
import { estateType, coordsType, parcelType } from 'components/types'
import './EditEstate.css'

export default class EditEstate extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    parcels: PropTypes.arrayOf(coordsType).isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const {
      onSubmit,
      onChange,
      onCancel,
      estate,
      allParcels,
      parcels
    } = this.props

    return (
      <div className="EditEstate">
        <EstateModal
          parcels={estate.data.parcels}
          title={t('estate_edit.edit_estate')}
          subtitle={t('estate_edit.subtitle')}
          hasCustomFooter
        >
          <EditEstateForm
            estate={estate}
            parcels={parcels}
            allParcels={allParcels}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onChange={onChange}
          />
        </EstateModal>
      </div>
    )
  }
}
