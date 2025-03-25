import dataJson from './permissions.json'
export const permissions = dataJson
export const permissionArray = Object.keys(permissions).filter(i => !i.includes('auth'));
export type PermissionType = keyof typeof permissions