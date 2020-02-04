import GoogleScopes from './GoogleScopes';
import MockAuthHelper, { mockIdToken, mockAccessToken } from './MockAuthHelper';

describe('MockAuthHelper', () => {
  it('should return mock tokens', async () => {
    const helper = new MockAuthHelper();
    await expect(helper.createSession()).resolves.toEqual({
      idToken: mockIdToken,
      accessToken: mockAccessToken,
      expiresAt: expect.any(Date),
      scopes: expect.any(GoogleScopes),
    });
    await expect(helper.refreshSession()).resolves.toEqual({
      idToken: mockIdToken,
      accessToken: mockAccessToken,
      expiresAt: expect.any(Date),
      scopes: expect.any(GoogleScopes),
    });
  });
});
