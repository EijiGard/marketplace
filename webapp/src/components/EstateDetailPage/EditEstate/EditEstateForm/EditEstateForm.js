import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'
import { isValidName, isValidDescription } from 'shared/asset'
import { buildCoordinate } from 'shared/parcel'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'
import { estateType, coordsType, parcelType } from 'components/types'
import ParcelCard from 'components/ParcelCard'
import './EditEstateForm.css'

export default class EditEstateForm extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    parcels: PropTypes.arrayOf(coordsType).isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const { estate } = this.props
    this.state = {
      initialEstate: estate
    }
  }

  handleNameChange = event => {
    const { estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        name: event.target.value
      }
    })
  }

  handleDescriptionChange = event => {
    const { estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        description: event.target.value
      }
    })
  }

  hasChanged() {
    const { data } = this.props.estate
    const { name, description } = this.state.initialEstate

    return name !== data.name || description !== data.description
  }

  render() {
    const { onCancel, onSubmit, estate, allParcels, parcels } = this.props
    const { name, description } = estate.data

    return (
      <Form className="EditEstateForm" onSubmit={preventDefault(onSubmit)}>
        <Form.Field>
          <label>{t('estate_edit.name')}</label>
          <Input
            type="text"
            value={name}
            onChange={this.handleNameChange}
            error={!isValidName}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('estate_edit.description')}</label>
          <Input
            type="text"
            value={description}
            onChange={this.handleDescriptionChange}
            error={!isValidDescription}
          />
        </Form.Field>
        <br />
        <div>
          {parcels.map(({ x, y }) => {
            const parcel = allParcels[buildCoordinate(x, y)]
            return parcel ? (
              <ParcelCard key={parcel.id} parcel={parcel} withMap={false} />
            ) : null
          })}
        </div>
        <div>
          <Button type="button" onClick={onCancel}>
            {t('global.cancel')}
          </Button>
          <Button type="submit" primary={true} disabled={!this.hasChanged()}>
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
