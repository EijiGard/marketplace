import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'
import './EstateSelectActions.css'

export default class EstateSelectActions extends React.PureComponent {
  static propTypes = {
    isCreation: PropTypes.bool.isRequired,
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
      isCreation
    } = this.props

    return (
      <div className="EstateActions">
        <Button size="tiny" onClick={onCancel}>
          {t('global.cancel')}
        </Button>
        <Button
          size="tiny"
          disabled={isCreation ? !canContinue : !canContinue || canEditMetadata}
          onClick={isCreation ? onContinue : onSubmit}
        >
          {isCreation ? t('global.continue') : t('global.submit')}
        </Button>
        {!isCreation && (
          <Button size="tiny" disabled={!canEditMetadata} onClick={onContinue}>
            {t('parcel_detail.actions.edit')}
          </Button>
        )}
      </div>
    )
  }
}
