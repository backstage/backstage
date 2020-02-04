import GoogleScopes from './GoogleScopes';
import { GoogleSession } from './types';
import { AuthHelper } from './GoogleAuthHelper';

export const mockIdToken = 'mock-id-token';
export const mockAccessToken = 'mock-access-token';

const defaultMockSession: GoogleSession = {
  idToken: mockIdToken,
  accessToken: mockAccessToken,
  expiresAt: new Date(),
  scopes: GoogleScopes.default(),
};

export default class MockAuthHelper implements AuthHelper {
  constructor(private readonly mockSession: GoogleSession = defaultMockSession) {}

  async refreshSession() {
    return this.mockSession;
  }

  async removeSession() {}

  async createSession() {
    return this.mockSession;
  }

  async showPopup(scope: string) {
    return {
      scopes: GoogleScopes.from(scope),
      idToken: 'i',
      accessToken: 'a',
      expiresAt: new Date(),
    };
  }
}
