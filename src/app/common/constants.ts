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
    organizations: 'organizations',
    topics:'topics',
    messages:'messages'
  }
  static Role = {
    SUPER_ADMIN: 'SUPER_ADMIN'
  }
  static EventName = {
    join: 'join',
    join_all:'join_all',
    message:'message'
  }
}
export class WS_EVENT_NAME {
  static create_topic = 'create_topic';
  static recipient_user = 'recipient_user';
  static receive_topic = 'receive_topic';
  static join_all = 'join_all';
  static join = 'join';
  static message = 'message';
  static typing = 'typing';
}