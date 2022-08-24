import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, Checkbox, Field, useLayout, useTheme } from '@1hive/1hive-ui'
import ModalButton from '../ModalButton'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useGardenState } from '@providers/GardenState'
import { useAppTheme } from '@providers/AppTheme'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import signGraphicLight from '@assets/smart-contract.svg'
import signGraphicDark from '@assets/dark-mode/smart-contract.svg'

function SignOverview({ getTransactions }) {
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const connectedGarden = useConnectedGarden()
  const { mainToken } = useGardenState()
  const { layoutName } = useLayout()
  const { next } = useMultiModal()
  const theme = useTheme()
  const { appearance } = useAppTheme()

  const smallMode = layoutName === 'small'

  const handleSign = useCallback(() => {
    setLoading(true)

    // Proceed to the next screen after transactions have been received
    getTransactions(() => {
      next()
    })
  }, [getTransactions, next])

  const handleAcceptTerms = useCallback(
    (checked) => setAcceptedTerms(checked),
    []
  )

  return (
    <>
      <img
        src={appearance === 'light' ? signGraphicLight : signGraphicDark}
        css={`
          display: block;
          width: auto;
          height: ${smallMode ? 17 * GU : 20 * GU}px;

          margin: auto;
          margin-bottom: ${5 * GU}px;
        `}
      />
      <label
        css={`
          display: flex;
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div
          css={`
            margin-left: -${0.5 * GU}px;
            margin-right: ${1 * GU}px;
          `}
        >
          <Checkbox
            style={{ backgroundColor: `${theme.helpSurface}` }}
            checked={acceptedTerms}
            onChange={handleAcceptTerms}
            css={`
              border-color: ${theme.disabledContent};$
            `}
          />
        </div>
        {`By signing this Covenant, you agree to the ${connectedGarden.name} Community manifesto, by
        laws and community code of behavior.`}
      </label>
      <Field label="Covenant deposit manager">
        <p>
          {`In order to create or challenge proposals bound by this Covenant, you
          will need to add some funds (${mainToken.data.symbol}) to the deposit manager.`}
        </p>
      </Field>

      <ModalButton
        mode="strong"
        loading={loading}
        onClick={handleSign}
        disabled={!acceptedTerms}
      >
        Sign Covenant
      </ModalButton>
    </>
  )
}

SignOverview.propTypes = {
  getTransactions: PropTypes.func,
}

export default SignOverview
