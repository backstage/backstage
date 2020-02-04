import Api from 'shared/pluginApi/Api';

export type Group = {
  id: string;
  type: string;
};

export type User = {
  id: string;
  email: string;
  groups: Group[];
  isMocked: boolean;
};

export type UserProfile = {
  fullName: string;
  givenName: string;
  avatarUrl?: string;
};

export type UserApi = {
  getUser(): Promise<User>;
  getProfile(): Promise<UserProfile>;
};

export const userApi = new Api<UserApi>({
  id: 'user',
  title: 'User',
  description: 'API for getting information about the logged in user',
});
