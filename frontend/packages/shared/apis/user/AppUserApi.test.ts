import AppUserApi from './AppUserApi';
import AppAuth, { AuthInfo } from 'core/app/auth';

describe('AppUserApi', () => {
  it('should fail if auth init fails', async () => {
    const userApi = new AppUserApi({
      auth: async (): Promise<AuthInfo> => {
        throw new Error('NOPE');
      },
    } as typeof AppAuth);
    await expect(userApi.getUser()).rejects.toThrow('NOPE');
  });

  it('should forward user info', async () => {
    const userApi = new AppUserApi({
      auth: async () => ({
        userInfo: {
          id: 'my-id',
          email: 'my@mail.com',
          groups: [{ type: 'squad', id: 'my-group' }],
        },
      }),
      profile: async () => ({
        fullName: 'Full Name',
        givenName: 'Given',
        avatarData: 'a-b_c',
      }),
    } as typeof AppAuth);
    await expect(userApi.getUser()).resolves.toEqual({
      id: 'my-id',
      email: 'my@mail.com',
      groups: [{ type: 'squad', id: 'my-group' }],
      isMocked: false,
    });
    await expect(userApi.getProfile()).resolves.toEqual({
      fullName: 'Full Name',
      givenName: 'Given',
      avatarUrl: 'data:image/jpeg;base64,a+b/c',
    });
  });

  it('should return the same object for multiple calls', async () => {
    const userApi = new AppUserApi({
      auth: async () => ({ userInfo: {} }),
    } as typeof AppAuth);

    const user = await userApi.getUser();
    await expect(userApi.getUser()).resolves.toBe(user);
  });

  it('should derive given name from full name', async () => {
    const userApi = new AppUserApi({
      auth: async () => ({ userInfo: { id: 'unused' } }),
      profile: async () => ({ fullName: 'Mocky McMockface' }),
    } as typeof AppAuth);
    await expect(userApi.getProfile()).resolves.toEqual({
      fullName: 'Mocky McMockface',
      givenName: 'Mocky',
    });
  });

  it('should ignore complicated full names', async () => {
    const userApi = new AppUserApi({
      auth: async () => ({ userInfo: { id: 'mocky-id' } }),
      profile: async () => ({ fullName: 'Dr. Mocky McMockface' }),
    } as typeof AppAuth);
    await expect(userApi.getProfile()).resolves.toEqual({
      fullName: 'Dr. Mocky McMockface',
      givenName: 'mocky-id',
    });
  });

  it('should derive given name from id', async () => {
    const userApi = new AppUserApi({
      auth: async () => ({ userInfo: { id: 'mocky' } }),
      profile: async () => ({}),
    } as typeof AppAuth);
    await expect(userApi.getProfile()).resolves.toEqual({ givenName: 'mocky' });
  });
});
