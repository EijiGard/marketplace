import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'
import { isNewAsset } from 'shared/asset'
import { estateType } from 'components/types'
import './EstateSelectActions.css'

export default class EstateSelectActions extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    canContinue: PropTypes.bool.isRequired,
    canEditMetadata: PropTypes.bool.isRequired
  }

  render() {
    const {
      onSubmit,
      onCancel,
      onContinue,
      canContinue,
      canEditMetadata,
      estate
    } = this.props

    return (
      <div className="EstateActions">
        <Button size="tiny" onClick={onCancel}>
          {t('global.cancel')}
        </Button>
        <Button
          size="tiny"
          disabled={
            isNewAsset(estate) ? !canContinue : !canContinue || canEditMetadata
          }
          onClick={isNewAsset(estate) ? onContinue : onSubmit}
        >
          {isNewAsset(estate) ? t('global.continue') : t('global.submit')}
        </Button>
        {!isNewAsset(estate) && (
          <Button size="tiny" disabled={!canEditMetadata} onClick={onContinue}>
            {t('parcel_detail.actions.edit')}
          </Button>
        )}
      </div>
    )
  }
}
