import MockUserApi from './MockUserApi';
import { User, UserProfile } from './types';

describe('MockUserApi', () => {
  it('should return the user it was provided', async () => {
    const userInfo = ({} as unknown) as User;
    const userProfile = ({} as unknown) as UserProfile;
    const userApi = new MockUserApi(userInfo, userProfile);
    await expect(userApi.getUser()).resolves.toBe(userInfo);
    await expect(userApi.getProfile()).resolves.toBe(userProfile);
  });
});
