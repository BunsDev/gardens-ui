import { useMemo } from 'react'
import { useGardenState } from '@providers/GardenState'
import usePromise from '@hooks/usePromise'
import { getAppPresentationByAddress } from '@utils/app-utils'

interface ManagerProps {
  address: string,
  shortenedName: string,
}

interface PermissionProps {
  allowed: boolean,
  appAddress: string,
  granteeAddress: string,
  granteeName: string | undefined,
  params: Array<any>,
  roleHash: string
}

interface RoleProps {
  appAddress: string,
  appName: string,
  description: string | undefined, // TODO- check why this is happening proabably old ABI
  hash: string,
  manager: Array<ManagerProps>,
  name: string,
  params: Array<any>,
  permissions: Array<PermissionProps>
}

export function useRoles() {
  const { installedApps } = useGardenState()

  console.log('installed apps ', installedApps)

  const appsWithPermissions = useMemo(() => {
    return () => Promise.all(installedApps.map(async (app: any) => {
      return {
        ...app,
        roles: await app.roles()
      }
    }))
  }, [installedApps])

  const appsWithRolesResolved = usePromise(appsWithPermissions, [], [])

  const rolesWithEntitiesResolved: Array<RoleProps> = appsWithRolesResolved.map((app: any) => {
    return app.roles.map((role: any) => {
      return {
        ...role,
        appName: getAppPresentationByAddress(installedApps, app.address)?.shortenedName,
        manager: {
          address: role.manager,
          shortenedName: getAppPresentationByAddress(installedApps, role.manager)?.shortenedName
        },
        permissions: role.permissions.map((permission: any) => {
          return {
            ...permission,
            granteeName: getAppPresentationByAddress(installedApps, permission.granteeAddress)?.shortenedName
          }
        })
      }
    })
  })

  return rolesWithEntitiesResolved.flat()

}
