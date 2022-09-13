export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}

export enum UserType {
  DEVICE = "device",
  WEB = "web",
}

export interface UserContext {
  uid: number | null;
  token: string | null;
  roles: UserRoles[] | null;
  type: UserType | null;
}
