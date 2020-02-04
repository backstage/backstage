import { UserApi, User, UserProfile } from './types';

export const defaultMockUser: User = {
  id: 'mockuser',
  email: 'mockuser@spotify.com',
  groups: [
    {
      id: 'tech',
      type: '',
    },
    {
      id: 'mocksquad',
      type: 'squad',
    },
  ],
  isMocked: true,
};

export const defaultMockUserProfile: UserProfile = {
  fullName: 'Mocky McMockFace',
  givenName: 'Mocky',
  avatarUrl: 'my-avatar.jpeg',
};

export default class MockUserApi implements UserApi {
  constructor(
    private readonly user: User = defaultMockUser,
    private readonly profile: UserProfile = defaultMockUserProfile,
  ) {}

  async getUser(): Promise<User> {
    return this.user;
  }

  async getProfile(): Promise<UserProfile> {
    return this.profile;
  }
}
