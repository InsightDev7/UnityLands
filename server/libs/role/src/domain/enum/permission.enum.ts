export enum Permission {
  CREATE_APPLICATION = 'create_application',
  BAN_PLAYER = 'ban_player',
}

export const PERMISSION_LEVEL: Record<Permission, number> = {
  [Permission.CREATE_APPLICATION]: 1,
  [Permission.BAN_PLAYER]: 10,
};
