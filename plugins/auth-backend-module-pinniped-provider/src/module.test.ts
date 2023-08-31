import { setupRequestMockHandlers } from "@backstage/backend-test-utils"
import { authModulePinnipedProvider } from "./module"
import request from 'supertest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { Server } from "http";
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { AddressInfo } from 'net';
import { AuthProviderRouteHandlers, createOAuthRouteHandlers } from "@backstage/plugin-auth-node";
import Router from 'express-promise-router';
import { pinnipedAuthenticator } from "./authenticator";
import { ConfigReader } from "@backstage/config";

describe('authModulePinnipedProvider', () => {
  let app: express.Express;
  let backstageServer: Server;
  let appUrl: string;
  let providerRouteHandler: AuthProviderRouteHandlers

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

  beforeEach(async () => {
    // jest.clearAllMocks();

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

    const secret = 'secret';
    app = express()
      .use(cookieParser(secret))
      .use(
        session({
          secret,
          saveUninitialized: false,
          resave: false,
          cookie: { secure: false },
        }),
      )
      .use(passport.initialize())
      .use(passport.session());
    await new Promise(resolve => {
      backstageServer = app.listen(0, '0.0.0.0', () => {
        appUrl = `http://127.0.0.1:${
          (backstageServer.address() as AddressInfo).port
        }`;
        resolve(null);
      });
    });

    mswServer.use(rest.all(`${appUrl}/*`, req => req.passthrough()));

    providerRouteHandler = createOAuthRouteHandlers({
      authenticator: pinnipedAuthenticator,
      appUrl,
      baseUrl: `${appUrl}/api/auth`,
      isOriginAllowed: _ => true,
      providerId: 'pinniped',
      config: new ConfigReader({
        federationDomain: 'https://federationDomain.test',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      }),
      resolverContext: {
        issueToken: async _ => ({ token: '' }),
        findCatalogUser: async _ => ({
          entity: {
            apiVersion: '',
            kind: '',
            metadata: { name: '' },
          },
        }),
        signInWithCatalogUser: async _ => ({ token: '' }),
      },
    })

    const router = Router();
      router
        .use(
          '/api/auth/pinniped/start',
          providerRouteHandler.start.bind(providerRouteHandler),
        )
        .use(
          '/api/auth/pinniped/handler/frame',
          providerRouteHandler.frameHandler.bind(providerRouteHandler),
        );
      app.use(router);
  })

  afterEach(() => {
    backstageServer.close();
  });
  //TODO: are we actually testing the auth module here since our setup makes use of creating the Oauthfactory directly and not through the module, how can we attach it using the module instead????


  it('should start', async () => {

    const agent = request.agent(backstageServer)

    const startResponse = await agent.get(`/api/auth/pinniped/start?env=development&audience=test_cluster`);

    expect(startResponse.status).toBe(302)
  }, 70000)
})