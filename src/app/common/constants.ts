export class Const {
  static StorageKey = {
    token: 'token',
    refresh_token: 'refresh_token',
    token_expired_at: 'token_expired_at',
    sig: 'sig',
  }
  static QueryKey = {
    staleTime: 3600 * 10 * 10,
    roles_auth: 'roles_auth',
    roles: 'roles',
    permissions: 'permissions',
    users: 'users',
    provinces: 'provinces',
    districts: 'districts',
    wards: 'wards',
    organizations: 'organizations'
  }
  static Role = {
    SUPER_ADMIN: 'SUPER_ADMIN'
  }
}