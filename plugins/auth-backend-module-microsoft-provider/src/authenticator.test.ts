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
  encodeOAuthState,
  OAuthAuthenticatorAuthenticateInput,
  OAuthAuthenticatorRefreshInput,
  OAuthAuthenticatorStartInput,
  OAuthState,
  PassportOAuthAuthenticatorHelper,
} from '@backstage/plugin-auth-node';
import express from 'express';
import { decodeProtectedHeader, jwtVerify } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { createHash, X509Certificate } from 'node:crypto';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate } from 'selfsigned';
import { FakeMicrosoftAPI } from './__testUtils__/fake';
import { microsoftAuthenticator } from './authenticator';

describe('microsoftAuthenticator', () => {
  const oauthState: OAuthState = {
    nonce: 'AAAAAAAAAAAAAAAAAAAAAA==',
    env: 'development',
  };
  const scope = 'email openid profile User.Read';
  const state = encodeOAuthState(oauthState);

  const photo = 'data:image/jpeg;base64,aG93ZHk=';

  const microsoftApi = new FakeMicrosoftAPI();

  const server = setupServer();
  registerMswTestHooks(server);

  let implementation: {
    domainHint: string | undefined;
    helper: PassportOAuthAuthenticatorHelper;
    skipUserProfile: boolean;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    server.use(
      http.post(
        'https://login.microsoftonline.com/tenantId/oauth2/v2.0/token',
        async ({ request }) => {
          return HttpResponse.json({
            ...microsoftApi.token(new URLSearchParams(await request.text())),
            token_type: 'Bearer',
            expires_in: 123,
            ext_expires_in: 123,
          });
        },
      ),
      http.get('https://graph.microsoft.com/v1.0/me/', ({ request }) => {
        if (
          !microsoftApi.tokenHasScope(
            request.headers.get('authorization')!.replace(/^Bearer /, ''),
            'User.Read',
          )
        ) {
          return new HttpResponse(null, { status: 403 });
        }
        return HttpResponse.json({
          id: 'conrad',
          displayName: 'Conrad',
          surname: 'Ribas',
          givenName: 'Francisco',
          mail: 'conrad@example.com',
        });
      }),
      http.get(
        'https://graph.microsoft.com/v1.0/me/photos/*',
        async ({ request }) => {
          if (
            !microsoftApi.tokenHasScope(
              request.headers.get('authorization')!.replace(/^Bearer /, ''),
              'User.Read',
            )
          ) {
            return new HttpResponse(null, { status: 403 });
          }
          const imageBuffer = new Uint8Array([104, 111, 119, 100, 121]);
          return new HttpResponse(imageBuffer, {
            headers: {
              'Content-Length': imageBuffer.byteLength.toString(),
              'Content-Type': 'image/jpeg',
            },
          });
        },
      ),
    );

    implementation = microsoftAuthenticator.initialize({
      callbackUrl: 'https://backstage.test/callback',
      config: new ConfigReader({
        tenantId: 'tenantId',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        additionalScopes: ['User.Read.All'],
      }),
    });
  });

  describe('#start', () => {
    it('redirects to authorize URL', async () => {
      const startRequest: OAuthAuthenticatorStartInput = {
        scope,
        state,
        req: {
          method: 'GET',
          url: 'test',
        } as unknown as express.Request,
      };
      const startResponse = await microsoftAuthenticator.start(
        startRequest,
        implementation,
      );

      expect(startResponse.url).toBe(
        'https://login.microsoftonline.com/tenantId/oauth2/v2.0/authorize' +
          '?response_type=code' +
          `&redirect_uri=${encodeURIComponent(
            'https://backstage.test/callback',
          )}` +
          `&scope=${encodeURIComponent(scope)}` +
          `&state=${state}` +
          '&client_id=clientId',
      );
    });
  });

  describe('#authenticate', () => {
    const createAuthenticateRequest = (
      scopeForRequest: string,
    ): OAuthAuthenticatorAuthenticateInput => {
      const authCode = microsoftApi.generateAuthCode(scopeForRequest);
      return {
        req: {
          method: 'GET',
          url: 'test',
          query: {
            code: authCode,
            state,
          },
          session: {},
          cookies: {
            'microsoft-nonce': oauthState.nonce,
          },
        } as unknown as express.Request,
      };
    };

    it('returns provider info and profile with photo data', async () => {
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(scope),
        implementation,
      );

      const profile = authenticateResponse.fullProfile;
      expect(profile.displayName).toBe('Conrad');
      expect(profile.emails).toStrictEqual([
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ]);
      expect(profile.photos).toStrictEqual([{ value: photo }]);
    });

    it('fetches profile via Graph when signing in with non-Graph scopes', async () => {
      const foreignScope = 'aks-audience/user.read offline_access';
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(foreignScope),
        implementation,
      );

      expect(authenticateResponse.fullProfile).toBeDefined();
      expect(authenticateResponse.fullProfile!.displayName).toBe('Conrad');
      expect(authenticateResponse.session.accessToken).toBe(
        microsoftApi.generateAccessToken(foreignScope),
      );
      expect(authenticateResponse.session.refreshToken).toBe(
        microsoftApi.generateRefreshToken(
          'openid email User.Read offline_access',
        ),
      );
    });

    it('returns no profile for non-Graph scopes when no refresh token is granted', async () => {
      const foreignScope = 'aks-audience/user.read';
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(foreignScope),
        implementation,
      );

      expect(authenticateResponse.fullProfile).toBeUndefined();
      expect(authenticateResponse.session.accessToken).toBe(
        microsoftApi.generateAccessToken(foreignScope),
      );
    });

    it('sets refresh token', async () => {
      const refreshScope = 'email offline_access openid profile User.Read';
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(refreshScope),
        implementation,
      );

      const session = authenticateResponse.session;
      expect(session.refreshToken).toBe(
        microsoftApi.generateRefreshToken(refreshScope),
      );
    });

    it('omits photo data when fetching it fails', async () => {
      server.use(
        http.get('https://graph.microsoft.com/v1.0/me/photos/*', () =>
          HttpResponse.error(),
        ),
      );

      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(scope),
        implementation,
      );

      const profile = authenticateResponse.fullProfile;
      expect(profile.displayName).toBe('Conrad');
      expect(profile.emails).toStrictEqual([
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ]);
      expect(profile.photos).toBeUndefined();
    });
  });

  describe('#refresh', () => {
    const createRefreshRequest = (
      scopeForRequest: string,
    ): OAuthAuthenticatorRefreshInput => {
      return {
        scope: scopeForRequest,
        refreshToken: microsoftApi.generateRefreshToken(scopeForRequest),
        req: {} as unknown as express.Request,
      };
    };

    it('returns provider info and profile with photo data', async () => {
      const refreshResponse = await microsoftAuthenticator.refresh(
        createRefreshRequest(scope),
        implementation,
      );

      const profile = refreshResponse.fullProfile;
      expect(profile.displayName).toBe('Conrad');
      expect(profile.emails).toStrictEqual([
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ]);
      expect(profile.photos).toStrictEqual([{ value: photo }]);
    });

    it('fetches profile via Graph when refreshing with non-Graph scopes', async () => {
      const foreignScope = 'aks-audience/user.read';
      const refreshResponse = await microsoftAuthenticator.refresh(
        createRefreshRequest(foreignScope),
        implementation,
      );

      expect(refreshResponse.fullProfile).toBeDefined();
      expect(refreshResponse.fullProfile!.displayName).toBe('Conrad');
      expect(refreshResponse.session.accessToken).toBe(
        microsoftApi.generateAccessToken(foreignScope),
      );
    });

    it('chains the rotated refresh token into the Graph profile call', async () => {
      const tokenRequests: URLSearchParams[] = [];
      server.use(
        http.post(
          'https://login.microsoftonline.com/tenantId/oauth2/v2.0/token',
          async ({ request }) => {
            const formData = new URLSearchParams(await request.text());
            tokenRequests.push(formData);
            return HttpResponse.json({
              ...microsoftApi.token(formData),
              token_type: 'Bearer',
              expires_in: 123,
              ext_expires_in: 123,
            });
          },
        ),
      );

      const foreignScope = 'aks-audience/user.read offline_access';
      const refreshResponse = await microsoftAuthenticator.refresh(
        {
          scope: foreignScope,
          // An old refresh token that the first refresh call will rotate
          refreshToken: microsoftApi.generateRefreshToken(
            'aks-audience/user.read',
          ),
          req: {} as unknown as express.Request,
        },
        implementation,
      );

      // The Graph profile call must use the rotated refresh token from the
      // first call, not the incoming one
      expect(tokenRequests).toHaveLength(2);
      expect(tokenRequests[1].get('refresh_token')).toBe(
        microsoftApi.generateRefreshToken(foreignScope),
      );
      expect(refreshResponse.fullProfile!.displayName).toBe('Conrad');
      expect(refreshResponse.session.refreshToken).toBe(
        microsoftApi.generateRefreshToken(
          'openid email User.Read offline_access',
        ),
      );
    });

    it('returns access token when skipping user profile load', async () => {
      // Replace implementation to set skipUserProfile config
      implementation = microsoftAuthenticator.initialize({
        callbackUrl: 'https://backstage.test/callback',
        config: new ConfigReader({
          tenantId: 'tenantId',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          additionalScopes: ['User.Read.All'],
          skipUserProfile: true,
        }),
      });

      const refreshResponse = await microsoftAuthenticator.refresh(
        createRefreshRequest(scope),
        implementation,
      );

      expect(refreshResponse.fullProfile).toBeUndefined();
      expect(refreshResponse.session.accessToken).toBe(
        microsoftApi.generateAccessToken(scope),
      );
    });
  });
  describe('client credential configuration', () => {
    let pem: string;
    beforeAll(async () => {
      const pems = await generate([{ name: 'commonName', value: 'test' }], {
        keySize: 2048,
      });
      pem = `${pems.cert}\n${pems.private}`;
    });

    const initialize = (credential: Record<string, string>) =>
      microsoftAuthenticator.initialize({
        callbackUrl: 'https://backstage.test/callback',
        config: new ConfigReader({
          tenantId: 'tenantId',
          clientId: 'clientId',
          ...credential,
        }),
      });

    it('rejects config without a client credential', () => {
      expect(() => initialize({})).toThrow(
        'The Microsoft auth provider requires exactly one of clientSecret, clientCertificate or clientCertificatePath to be configured',
      );
    });

    it('rejects config with more than one client credential', () => {
      expect(() =>
        initialize({ clientSecret: 'clientSecret', clientCertificate: pem }),
      ).toThrow(/requires exactly one of/);
      expect(() =>
        initialize({
          clientCertificate: pem,
          clientCertificatePath: '/path/to/cert.pem',
        }),
      ).toThrow(/requires exactly one of/);
    });

    it('rejects a client certificate without a private key', () => {
      expect(() =>
        initialize({
          clientCertificate: pem.replace(/-----BEGIN PRIVATE KEY[\s\S]*/, ''),
        }),
      ).toThrow(/does not contain an unencrypted PEM-encoded private key/);
    });

    it('rejects a client certificate without a certificate', () => {
      expect(() =>
        initialize({
          clientCertificate: pem.replace(
            /-----BEGIN CERTIFICATE[\s\S]*?-----END CERTIFICATE-----/,
            '',
          ),
        }),
      ).toThrow(/does not contain a PEM-encoded certificate/);
    });

    it('rejects a private key that does not match the certificate', async () => {
      const other = await generate([{ name: 'commonName', value: 'other' }], {
        keySize: 2048,
      });
      expect(() =>
        initialize({
          clientCertificate: `${
            pem.match(
              /-----BEGIN CERTIFICATE[\s\S]*?-----END CERTIFICATE-----/,
            )![0]
          }\n${other.private}`,
        }),
      ).toThrow(/does not match the certificate/);
    });

    it('reads the client certificate from a file', () => {
      const dir = mkdtempSync(join(tmpdir(), 'microsoft-auth-'));
      const path = join(dir, 'cert.pem');
      writeFileSync(path, pem);
      expect(() => initialize({ clientCertificatePath: path })).not.toThrow();
    });
  });

  describe('with a client certificate', () => {
    const tokenUrl =
      'https://login.microsoftonline.com/tenantId/oauth2/v2.0/token';
    let pem: string;
    let certificate: X509Certificate;
    let tokenRequests: URLSearchParams[];

    beforeAll(async () => {
      const pems = await generate([{ name: 'commonName', value: 'test' }], {
        keySize: 2048,
      });
      pem = `${pems.private}\n${pems.cert}`;
      certificate = new X509Certificate(pems.cert);
    });

    beforeEach(() => {
      tokenRequests = [];
      server.use(
        http.post(tokenUrl, async ({ request }) => {
          const formData = new URLSearchParams(await request.text());
          tokenRequests.push(formData);
          return HttpResponse.json({
            ...microsoftApi.token(formData),
            token_type: 'Bearer',
            expires_in: 123,
            ext_expires_in: 123,
          });
        }),
      );
      implementation = microsoftAuthenticator.initialize({
        callbackUrl: 'https://backstage.test/callback',
        config: new ConfigReader({
          tenantId: 'tenantId',
          clientId: 'clientId',
          clientCertificate: pem,
        }),
      });
    });

    async function expectClientAssertion(formData: URLSearchParams) {
      expect(formData.has('client_secret')).toBe(false);
      expect(formData.get('client_id')).toBe('clientId');
      expect(formData.get('client_assertion_type')).toBe(
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      );

      const assertion = formData.get('client_assertion')!;
      expect(decodeProtectedHeader(assertion)).toEqual({
        alg: 'PS256',
        typ: 'JWT',
        'x5t#S256': createHash('sha256')
          .update(certificate.raw)
          .digest('base64url'),
      });

      const { payload } = await jwtVerify(assertion, certificate.publicKey, {
        algorithms: ['PS256'],
        issuer: 'clientId',
        subject: 'clientId',
        audience: tokenUrl,
      });
      expect(payload.jti).toEqual(expect.any(String));
      expect(payload.nbf).toEqual(payload.iat);
      expect(payload.exp! - payload.iat!).toBe(600);
    }

    it('sends a client assertion when exchanging the authorization code', async () => {
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        {
          req: {
            method: 'GET',
            url: 'test',
            query: { code: microsoftApi.generateAuthCode(scope), state },
            session: {},
            cookies: { 'microsoft-nonce': oauthState.nonce },
          } as unknown as express.Request,
        },
        implementation,
      );

      expect(authenticateResponse.fullProfile.displayName).toBe('Conrad');
      expect(tokenRequests).toHaveLength(1);
      expect(tokenRequests[0].get('grant_type')).toBe('authorization_code');
      await expectClientAssertion(tokenRequests[0]);
    });

    it('sends a client assertion when refreshing a token', async () => {
      const refreshResponse = await microsoftAuthenticator.refresh(
        {
          scope,
          refreshToken: microsoftApi.generateRefreshToken(scope),
          req: {} as unknown as express.Request,
        },
        implementation,
      );

      expect(refreshResponse.fullProfile.displayName).toBe('Conrad');
      expect(tokenRequests).toHaveLength(1);
      expect(tokenRequests[0].get('grant_type')).toBe('refresh_token');
      await expectClientAssertion(tokenRequests[0]);
    });

    it('signs a new client assertion for every token request', async () => {
      const refresh = () =>
        microsoftAuthenticator.refresh(
          {
            scope,
            refreshToken: microsoftApi.generateRefreshToken(scope),
            req: {} as unknown as express.Request,
          },
          implementation,
        );
      await refresh();
      await refresh();

      expect(tokenRequests).toHaveLength(2);
      const [first, second] = tokenRequests.map(
        r => r.get('client_assertion')!,
      );
      expect(first).not.toBe(second);
    });
  });
});
