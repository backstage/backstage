/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  AuthResolverContext,
  encodeOAuthState,
  OAuthAuthenticatorAuthenticateInput,
  OAuthAuthenticatorRefreshInput,
  OAuthAuthenticatorStartInput,
  OAuthState,
} from '@backstage/plugin-auth-node';
import { SignJWT } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import {
  vmwareCloudAuthenticator,
  VMwareCloudAuthenticatorContext,
} from './authenticator';

jest.mock('uid2', () => jest.fn().mockReturnValue('sessionid'));

describe('vmwareCloudAuthenticator', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  let oAuthState: OAuthState = {
    nonce: 'nonce',
    env: 'env',
  };

  const signInInfo: Record<string, string> = {
    given_name: 'Givenname',
    family_name: 'Familyname',
    context_name: 'orgId',
    email: 'user@example.com',
  };

  let idToken: string;

  let authResponse: {
    access_token: string;
    refresh_token: string;
    id_token: typeof idToken;
  };

  let fakeSession: Record<string, any>;
  let authenticatorCtx: VMwareCloudAuthenticatorContext;

  beforeAll(async () => {
    idToken = await new SignJWT(signInInfo)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(Buffer.from('signing key'));

    authResponse = {
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
      id_token: idToken,
    };
  });

  beforeEach(() => {
    server.use(
      http.post(
        'https://console.cloud.vmware.com/csp/gateway/am/api/auth/token',
        ({ request }) =>
          request.headers.get('Authorization')
            ? HttpResponse.json(authResponse)
            : HttpResponse.json(null, { status: 500 }),
      ),
    );

    authenticatorCtx = vmwareCloudAuthenticator.initialize({
      callbackUrl: 'http://callbackUrl',
      config: new ConfigReader({
        clientId: 'placeholderClientId',
        organizationId: 'orgId',
      }),
    });
  });

  describe('#initialize', () => {
    it('fails when organizationId is not configured', () => {
      return expect(() =>
        vmwareCloudAuthenticator.initialize({
          callbackUrl: 'http://callbackUrl',
          config: new ConfigReader({
            clientId: 'placeholderClientId',
          }),
        }),
      ).toThrow(`Missing required config value at 'organizationId'`);
    });
  });

  describe('#start', () => {
    let startRequest: OAuthAuthenticatorStartInput;

    beforeEach(() => {
      fakeSession = {};
      startRequest = {
        state: encodeOAuthState(oAuthState),
        req: {
          query: {},
          session: fakeSession,
        },
      } as OAuthAuthenticatorStartInput;
    });

    it('redirects to the Cloud Services Console consent page', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        startRequest,
        authenticatorCtx,
      );
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('console.cloud.vmware.com');
      expect(url.pathname).toBe('/csp/gateway/discovery');
    });

    it('passes client ID from config', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        startRequest,
        authenticatorCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('placeholderClientId');
    });

    it('passes organizationId from config', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        startRequest,
        authenticatorCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('orgId')).toBe('orgId');
    });

    it('passes callback URL', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        startRequest,
        authenticatorCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe('http://callbackUrl');
    });

    it('forwards scopes for ID and refresh token', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        { ...startRequest, scope: 'openid offline_access' },
        authenticatorCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('scope')).toBe('openid offline_access');
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        startRequest,
        authenticatorCtx,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await vmwareCloudAuthenticator.start(startRequest, authenticatorCtx);

      expect(
        fakeSession['oauth2:console.cloud.vmware.com'].state.code_verifier,
      ).toBeDefined();
    });

    it('fails when request has no session', () => {
      return expect(
        vmwareCloudAuthenticator.start(
          {
            state: encodeOAuthState(oAuthState),
            req: {
              query: {},
            },
          } as OAuthAuthenticatorStartInput,
          authenticatorCtx,
        ),
      ).rejects.toThrow('requires session support');
    });

    it('adds session ID handle to state param', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        startRequest,
        authenticatorCtx,
      );
      const stateParam = new URL(startResponse.url).searchParams.get('state');

      const state = Object.fromEntries(
        new URLSearchParams(Buffer.from(stateParam!, 'hex').toString('utf-8')),
      );

      const { handle } = fakeSession['oauth2:console.cloud.vmware.com'].state;
      expect(state.handle).toBe(handle);
    });
  });

  describe('#authenticate', () => {
    let resolverContext: jest.Mocked<AuthResolverContext>;
    let authenticateRequest: OAuthAuthenticatorAuthenticateInput;

    beforeEach(() => {
      resolverContext = {
        issueToken: jest.fn().mockResolvedValue({
          token: 'defaultBackstageToken',
        }),
        findCatalogUser: jest.fn(),
        signInWithCatalogUser: jest.fn().mockResolvedValue({
          token: 'backstageToken',
        }),
        resolveOwnershipEntityRefs: jest.fn(),
      };

      oAuthState = {
        code_verifier: 'foo',
        handle: 'sessionid',
        nonce: 'nonce',
        env: 'development',
      } as OAuthState;

      fakeSession = {
        ['oauth2:console.cloud.vmware.com']: {
          state: oAuthState,
        },
      };

      authenticateRequest = {
        req: {
          query: {
            code: 'foo',
            state: encodeOAuthState(oAuthState),
          } as unknown,
          session: fakeSession,
        },
      } as OAuthAuthenticatorAuthenticateInput;
    });

    it('stores refresh token in cookie', async () => {
      const {
        session: { refreshToken },
      } = await vmwareCloudAuthenticator.authenticate(
        authenticateRequest,
        authenticatorCtx,
      );

      expect(refreshToken).toBe('refreshToken');
    });

    it('responds with ID token', async () => {
      const { session } = await vmwareCloudAuthenticator.authenticate(
        authenticateRequest,
        authenticatorCtx,
      );

      expect(session.idToken).toBe(idToken);
    });

    it('default transform decodes ID token', async () => {
      const result = await vmwareCloudAuthenticator.authenticate(
        authenticateRequest,
        authenticatorCtx,
      );

      const { profile } =
        await vmwareCloudAuthenticator.defaultProfileTransform(
          result,
          resolverContext,
        );

      expect(profile).toStrictEqual({
        email: signInInfo.email,
        displayName: `${signInInfo.given_name} ${signInInfo.family_name}`,
      });
    });

    it('default transform fails if claims are missing', async () => {
      authenticatorCtx = vmwareCloudAuthenticator.initialize({
        callbackUrl: 'http://callbackUrl',
        config: new ConfigReader({
          clientId: 'placeholderClientId',
          organizationId: 'myOrgId',
        }),
      });

      const result = await vmwareCloudAuthenticator.authenticate(
        authenticateRequest,
        authenticatorCtx,
      );

      return expect(
        vmwareCloudAuthenticator.defaultProfileTransform(
          result,
          resolverContext,
        ),
      ).rejects.toThrow('ID token organizationId mismatch');
    });

    it('default transform fails if organizationId mismatch', async () => {
      const inadequateIdToken: string = await new SignJWT({ sub: 'unusual' })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(Buffer.from('signing key'));

      server.use(
        http.post(
          'https://console.cloud.vmware.com/csp/gateway/am/api/auth/token',
          () =>
            HttpResponse.json({
              access_token: 'accessToken',
              id_token: inadequateIdToken,
            }),
        ),
      );

      const result = await vmwareCloudAuthenticator.authenticate(
        authenticateRequest,
        authenticatorCtx,
      );

      return expect(
        vmwareCloudAuthenticator.defaultProfileTransform(
          result,
          resolverContext,
        ),
      ).rejects.toThrow(
        'ID token missing required claims: email, given_name, family_name',
      );
    });

    it('fails when request has no session', () => {
      return expect(
        vmwareCloudAuthenticator.authenticate(
          {
            req: {
              query: {},
            },
          } as OAuthAuthenticatorStartInput,
          authenticatorCtx,
        ),
      ).rejects.toThrow('requires session support');
    });

    it('fails when request has no authorization code', () => {
      return expect(
        vmwareCloudAuthenticator.authenticate(
          {
            req: {
              query: {},
              session: fakeSession,
            },
          } as OAuthAuthenticatorStartInput,
          authenticatorCtx,
        ),
      ).rejects.toThrow('Unexpected redirect');
    });
  });

  describe('integration between #start and #authenticate', () => {
    beforeEach(() => {
      fakeSession = {
        ['oauth2:console.cloud.vmware.com']: {
          state: oAuthState,
        },
      };
    });

    it('state param is compatible', async () => {
      const startResponse = await vmwareCloudAuthenticator.start(
        {
          req: {
            query: {},
            session: {},
          },
          state: encodeOAuthState(oAuthState),
        } as OAuthAuthenticatorStartInput,
        authenticatorCtx,
      );
      const { searchParams } = new URL(startResponse.url);
      const { session } = await vmwareCloudAuthenticator.authenticate(
        {
          req: {
            query: {
              code: 'authorization_code',
              state: searchParams.get('state'),
            } as unknown,
            session: fakeSession,
          },
        } as OAuthAuthenticatorAuthenticateInput,
        authenticatorCtx,
      );

      expect(session).toBeDefined();
      expect(session.idToken).toBe(idToken);
    });
  });

  describe('#refresh', () => {
    let refreshRequest: OAuthAuthenticatorRefreshInput;
    let resolverContext: jest.Mocked<AuthResolverContext>;

    beforeEach(() => {
      resolverContext = {
        issueToken: jest.fn().mockResolvedValue({
          token: 'defaultBackstageToken',
        }),
        findCatalogUser: jest.fn(),
        signInWithCatalogUser: jest.fn().mockResolvedValue({
          token: 'backstageToken',
        }),
        resolveOwnershipEntityRefs: jest.fn(),
      };

      refreshRequest = {
        req: {
          query: {
            code: 'foo',
            state: 'sessionid',
          } as unknown,
          session: fakeSession,
        },
      } as OAuthAuthenticatorRefreshInput;
    });

    it('gets new refresh token', async () => {
      const {
        session: { refreshToken },
      } = await vmwareCloudAuthenticator.refresh(
        refreshRequest,
        authenticatorCtx,
      );

      expect(refreshToken).toBe('refreshToken');
    });

    it('default transform decodes ID token', async () => {
      const result = await vmwareCloudAuthenticator.refresh(
        refreshRequest,
        authenticatorCtx,
      );

      const { profile } =
        await vmwareCloudAuthenticator.defaultProfileTransform(
          result,
          resolverContext,
        );

      expect(profile).toStrictEqual({
        email: signInInfo.email,
        displayName: `${signInInfo.given_name} ${signInInfo.family_name}`,
      });
    });
  });
});
