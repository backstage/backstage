import {
  OAuthAuthenticator,
  OAuthAuthenticatorStartInput,
  OAuthState,
  PassportOAuthAuthenticatorHelper,
  PassportProfile,
  decodeOAuthState,
  encodeOAuthState,
} from '@backstage/plugin-auth-node';
import { pinnipedAuthenticator } from './authenticator';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';
import { rest } from 'msw';
import express from 'express';

describe('pinnipedAuthenticator', () => {
  let implementation: any;
  let oauthState: OAuthState;
  let idToken: string;
  let publicKey: JWK;

  const mswServer = setupServer();
  setupRequestMockHandlers(mswServer);

  const issuerMetadata = {
    issuer: 'https://pinniped.test',
    authorization_endpoint: 'https://pinniped.test/oauth2/authorize',
    token_endpoint: 'https://pinniped.test/oauth2/token',
    revocation_endpoint: 'https://pinniped.test/oauth2/revoke_token',
    userinfo_endpoint: 'https://pinniped.test/idp/userinfo.openid',
    introspection_endpoint: 'https://pinniped.test/introspect.oauth2',
    jwks_uri: 'https://pinniped.test/jwks.json',
    scopes_supported: [
      'openid',
      'offline_access',
      'pinniped:request-audience',
      'username',
      'groups',
    ],
    claims_supported: ['email', 'username', 'groups', 'additionalClaims'],
    response_types_supported: ['code'],
    id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
    token_endpoint_auth_signing_alg_values_supported: [
      'RS256',
      'RS512',
      'HS256',
    ],
    request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  };

  const clusterScopedIdToken = 'dummy-token';

  beforeAll(async () => {
    const keyPair = await generateKeyPair('RS256');
    const privateKey = await exportJWK(keyPair.privateKey);
    publicKey = await exportJWK(keyPair.publicKey);
    publicKey.alg = privateKey.alg = 'RS256';

    idToken = await new SignJWT({
      sub: 'test',
      iss: 'https://pinniped.test',
      iat: Date.now(),
      aud: 'clientId',
      exp: Date.now() + 10000,
    })
      .setProtectedHeader({ alg: privateKey.alg, kid: privateKey.kid })
      .sign(keyPair.privateKey);
  });



  beforeEach(() => {
    jest.clearAllMocks();

    mswServer.use(
      rest.get(
        'https://federationDomain.test/.well-known/openid-configuration',
        (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(issuerMetadata),
          ),
      ),
    )
    implementation = pinnipedAuthenticator.initialize({ 
      callbackUrl: 'https://backstage.test/callback',
      config: new ConfigReader({
        federationDomain: 'https://federationDomain.test',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      })
    })

    oauthState = {
      nonce: 'nonce',
      env: 'env',
    }
  });

  describe('#start', () => {
    let fakeSession: Record<string, any>;
    let startRequest: OAuthAuthenticatorStartInput;

    beforeEach(() => {
      fakeSession = {};
      startRequest = {
        state: encodeOAuthState(oauthState),
        req: { 
          method: 'GET',
          url: 'test',
          session: fakeSession,
        },
      } as unknown as OAuthAuthenticatorStartInput;
    });

    it('redirects to authorization endpoint returned from OIDC metadata endpoint', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const url = new URL(startResponse.url);
  
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('pinniped.test');
      expect(url.pathname).toBe('/oauth2/authorize');
    });

    it('initiates authorization code grant', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('response_type')).toBe('code');
    });

    it('persists audience parameter in oauth state', async () => {
      startRequest.req.query = { audience: 'test-cluster' };
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = decodeOAuthState(stateParam!);

      expect(decodedState).toMatchObject({
        nonce: 'nonce',
        env: 'env',
        audience: 'test-cluster',
      });
    });

    it('passes client ID from config', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('clientId');
    });

    it('passes callback URL from config', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe(
        'https://backstage.test/callback',
      );
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await pinnipedAuthenticator.start(startRequest, implementation);
      expect(fakeSession['oidc:pinniped.test'].code_verifier).toBeDefined();
    });

    it('requests sufficient scopes for token exchange by default', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);
      const scopes = searchParams.get('scope')?.split(' ') ?? [];

      expect(scopes).toEqual(
        expect.arrayContaining([
          'openid',
          'pinniped:request-audience',
          'username',
          'offline_access',
        ]),
      );
    });

    it('encodes OAuth state in query param', async () => {
      const startResponse = await pinnipedAuthenticator.start(startRequest, implementation);
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = decodeOAuthState(stateParam!);

      expect(decodedState).toMatchObject(oauthState);
    });

    it('fails when request has no session', async () => {
      return expect(
        pinnipedAuthenticator.start({state: encodeOAuthState(oauthState),req: { 
          method: 'GET',
          url: 'test',
        }} as unknown as OAuthAuthenticatorStartInput, 
        implementation)
      ).rejects.toThrow('authentication requires session support');
    });

  });

  // describe('#authenticate', () => {
  //   let handlerRequest: express.Request;

  //   beforeEach(() => {
  //     handlerRequest = {
  //       method: 'GET',
  //       url: `https://test?code=authorization_code&state=${encodeOAuthState(
  //         oauthState,
  //       )}`,
  //       session: {
  //         'oidc:pinniped.test': {
  //           state: encodeOAuthState(oauthState),
  //         },
  //       },
  //     } as unknown as express.Request;
  //   });

  // })
})
