import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  GU,
  Link,
  LoadingRing,
  textStyle,
  useTheme,
  EthIdenticon,
} from '@1hive/1hive-ui'
import IdentityBadge from '@components/IdentityBadge'
import useProfile from '@hooks/useProfile'
import { useSupporterSubscription } from '@hooks/useSubscriptions'
import { useWallet } from '@providers/Wallet'

type DelegationProps = {
  onRemoveDelegate: () => void
  onSetDelegate: () => void
}

function Delegation({ onRemoveDelegate, onSetDelegate }: DelegationProps) {
  const { account } = useWallet()
  const theme = useTheme()
  const { supporter, loading } = useSupporterSubscription(account)

  return (
    <Box>
      {loading ? (
        <LoadingRing />
      ) : (
        <div
          css={`
            text-align: center;
          `}
        >
          <div
            css={`
              ${textStyle('title4')};
            `}
          >
            Your delegate
          </div>
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            {supporter?.representative ? (
              <Representative
                onRemoveDelegate={onRemoveDelegate}
                onSetDelegate={onSetDelegate}
                representative={supporter.representative}
              />
            ) : (
              <div
                css={`
                  text-align: center;
                `}
              >
                <div
                  css={`
                    ${textStyle('body1')};
                  `}
                >
                  None
                </div>
                <span
                  css={`
                    ${textStyle('body3')};
                    color: ${theme.contentSecondary};
                  `}
                >
                  (You vote for yourself)
                </span>
                <Button
                  mode="strong"
                  label="Delegate voting"
                  wide
                  onClick={onSetDelegate}
                  css={`
                    margin-top: ${3 * GU}px;
                  `}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Box>
  )
}

type RepresentativeProps = {
  onRemoveDelegate: () => void
  onSetDelegate: () => void
  representative: {
    address: string
  }
}

function Representative({
  onRemoveDelegate,
  onSetDelegate,
  representative,
}: RepresentativeProps) {
  const theme = useTheme()
  const router = useRouter()
  // const profile = useProfile(representative.address)
  const profile: any = useProfile(representative.address)

  const handleViewProfile = useCallback(() => {
    router.push(`/profile?account=${representative.address}`)
  }, [router, representative])

  return (
    <div>
      <div
        onClick={handleViewProfile}
        css={`
          margin-bottom: ${1 * GU}px;
          cursor: pointer;
        `}
      >
        {profile?.image ? (
          <img
            src={profile.image}
            height="72"
            width="72"
            alt=""
            css={`
              border-radius: 50%;
              display: block;
              object-fit: cover;
              margin: 0 auto;
            `}
          />
        ) : (
          <EthIdenticon
            address={representative.address}
            radius={50}
            scale={3}
          />
        )}
      </div>
      {profile?.name && (
        <div
          css={`
            ${textStyle('body1')};
          `}
        >
          {profile.name}
        </div>
      )}
      <IdentityBadge entity={representative.address} withProfile={false} />
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <Link onClick={onSetDelegate}>Change</Link>
        <Link
          onClick={onRemoveDelegate}
          css={`
            color: ${theme.negative};
          `}
        >
          Remove
        </Link>
      </div>
    </div>
  )
}

export default Delegation
