import FirestoreDocFactory from './FirestoreDocFactory';
import { withLogCollector } from 'testUtils';
import appAuth from 'core/app/auth';

jest.mock('core/app/auth', () => ({
  auth: jest.fn(),
}));

const successAuthMock = async () => ({
  firebaseAuth: {
    customToken: 'my-token',
  },
});

const missingUserAuthMock = async () => ({
  firebaseAuth: {
    customToken: 'missing-user',
  },
});

const errorAuthMock = async () => {
  throw new Error('NOPE');
};

jest.mock('firebase/app', () => ({
  initializeApp: () => ({
    auth: () => ({
      signOut: () => {},
      signInWithCredential: async ({ id, access }) => ({ user: { uid: `uid:${id}:${access}` } }),
      signInWithCustomToken: async token => ({
        user: token === 'missing-user' ? undefined : { uid: `token:${token}` },
      }),
    }),
    firestore: () => ({
      enablePersistence() {},
      collection: collectionId => ({
        doc: docId => `doc:${collectionId}/${docId}`,
      }),
    }),
  }),
  auth: {
    GoogleAuthProvider: {
      credential: (id, access) => ({ id, access }),
    },
  },
}));

const config = {
  apiKey: '123',
  projectId: 'abc',
};

describe('FirestoreDocFactory', () => {
  it('should use either google token or custom token for auth', async () => {
    appAuth.auth.mockResolvedValueOnce({ firebaseAuth: { googleAccessToken: 'google-token' } });
    await FirestoreDocFactory.createWithAppAuth(appAuth, config, 'test1-1').getDoc();

    appAuth.auth.mockResolvedValueOnce({ firebaseAuth: { customToken: 'my-token' } });
    await FirestoreDocFactory.createWithAppAuth(appAuth, config, 'test1-2').getDoc();

    appAuth.auth.mockResolvedValueOnce({ firebaseAuth: { noToken: 'nope' } });
    const logs = await withLogCollector(async () => {
      await expect(FirestoreDocFactory.createWithAppAuth(appAuth, config, 'test1-3').getDoc()).rejects.toThrow(
        'no token available',
      );
    });

    expect(logs.error).toEqual(['Firebase auth failed, Error: no token available']);
  });

  it('should get doc', async () => {
    appAuth.auth.mockImplementation(successAuthMock);

    const factory = FirestoreDocFactory.createWithAppAuth(appAuth, config, 'test2');
    expect(factory.getDoc()).resolves.toBe('doc:users/token:my-token');
  });

  it('should not provide a doc if auth fails', async () => {
    appAuth.auth.mockImplementation(errorAuthMock);

    const factory = FirestoreDocFactory.createWithAppAuth(appAuth, config, 'test4');

    const logs = await withLogCollector(['error'], async () => {
      await expect(factory.getDoc()).rejects.toThrow('NOPE');
    });
    expect(logs.error).toEqual(['Firebase auth failed, Error: NOPE']);
  });

  it('should not provide a doc if user is missing from session', async () => {
    appAuth.auth.mockImplementation(missingUserAuthMock);

    const factory = FirestoreDocFactory.createWithAppAuth(appAuth, config, 'test5');

    const logs = await withLogCollector(['error'], async () => {
      await expect(factory.getDoc()).rejects.toThrow('received null user from signIn');
    });
    expect(logs.error).toEqual(['Firebase auth failed, Error: received null user from signIn']);
  });
});
