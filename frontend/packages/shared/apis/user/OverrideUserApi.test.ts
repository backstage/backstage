import OverrideUserApi from './OverrideUserApi';
import { withLogCollector } from 'testUtils';

jest.mock('shared/apis/backstage/graphqlClient', () => {
  return {
    graphqlClient: {
      async query({ variables: { username } }: any): Promise<any> {
        if (username === 'bad') {
          return {
            errors: [new Error('NOPE')],
          };
        } else if (username === 'reallybad') {
          return {
            errors: [new Error('NOPE'), new Error('NEIN')],
          };
        } else {
          return {
            data: {
              user: {
                fullName: 'Mocky Override',
                email: 'mover@spotify.com',
                squads: [{ id: 'tools' }],
                ldapGroups: ['tech'],
              },
            },
          };
        }
      },
    },
  };
});

describe('OverrideUserApi', () => {
  it('should fetch information about mocked user from graphql', async () => {
    const userApi = new OverrideUserApi('mocky');
    await expect(userApi.getUser()).resolves.toEqual({
      id: 'mocky',
      email: 'mover@spotify.com',
      groups: [
        {
          id: 'tools',
          type: 'squad',
        },
        {
          id: 'tech',
          type: '',
        },
      ],
      isMocked: true,
    });

    await expect(userApi.getProfile()).resolves.toEqual({
      fullName: 'Mocky Override',
      givenName: 'mocky',
    });
  });

  it('should fail on error to fetch information', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const userApi = new OverrideUserApi('bad');
      await expect(userApi.getUser()).rejects.toThrowError('NOPE');
    });
    expect(error.length).toBe(0);
  });

  it('should log additional errors', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const userApi = new OverrideUserApi('reallybad');
      await expect(userApi.getUser()).rejects.toThrowError('NOPE');
    });
    expect(error).toEqual(['Additional error when loading override user data, NEIN']);
  });
});
