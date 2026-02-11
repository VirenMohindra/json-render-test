import { useMemo } from 'react'

import { SpecScreen } from '@/lib/json-render/SpecScreen'
import { useAuth } from '@/lib/json-render/state/auth-context'
import { profileSpec } from '@/specs/profile'

export default function ProfileScreen() {
  const { user } = useAuth()

  const extraState = useMemo(
    () => ({
      profileName: user?.name ?? '',
      profileEmail: user?.email ?? '',
    }),
    [user?.name, user?.email],
  )

  return <SpecScreen spec={profileSpec} type="detail" extraState={extraState} />
}
