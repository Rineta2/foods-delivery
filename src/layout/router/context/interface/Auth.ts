export enum Role {
  SUPER_ADMIN = "super-admins",
  SELLER = "seller",
  USER = "user",
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  logout: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
  getDashboardUrl: () => string;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
}
