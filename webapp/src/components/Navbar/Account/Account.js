import React from 'react'
import AddressLink from 'components/AddressLink'
import { walletType } from 'components/types'
import { formatMana } from 'lib/utils'
import { locations } from 'locations'

import './Account.css'

export default class Account extends React.PureComponent {
  static propTypes = {
    wallet: walletType
  }
  render() {
    const { wallet } = this.props
    if (!wallet || !wallet.address || wallet.balance == null) {
      return null
    }

    const balance = formatMana(wallet.balance)
    return (
      <span className="Account">
        <span title={balance} className="balance">
          {balance}
        </span>
        <AddressLink
          scale={4}
          link={locations.settings}
          address={wallet.address}
          hasTooltip={false}
        />
      </span>
    )
  }
}
