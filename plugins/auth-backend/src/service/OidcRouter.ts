/*
 * Copyright 2025 The Backstage Authors
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
import Router from 'express-promise-router';
import { OidcService } from './OidcService';
import { AuthenticationError } from '@backstage/errors';
import {
  AuthService,
  HttpAuthService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { TokenIssuer } from '../identity/types';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { OidcDatabase } from '../database/OidcDatabase';
import { offlineAccessServiceRef } from './OfflineAccessService';
import { json } from 'express';
import { readDcrTokenExpiration } from './readTokenExpiration';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { OidcError } from './OidcError';

const authorizeQuerySchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().url(),
  response_type: z.string().min(1),
  scope: z.string().optional(),
  state: z.string().optional(),
  nonce: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.string().optional(),
});

const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1),
});

const tokenRequestBodySchema = z.object({
  grant_type: z.string().min(1),
  code: z.string().optional(),
  redirect_uri: z.string().url().optional(),
  code_verifier: z.string().optional(),
  refresh_token: z.string().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

const registerRequestBodySchema = z.object({
  client_name: z.string().optional(),
  redirect_uris: z.array(z.string().url()).min(1),
  response_types: z.array(z.string()).optional(),
  grant_types: z.array(z.string()).optional(),
  scope: z.string().optional(),
});

const revokeRequestBodySchema = z.object({
  token: z.string().min(1),
  token_type_hint: z.string().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    const errorMessage = fromZodError(parseResult.error).message;
    throw new OidcError('invalid_request', errorMessage, 400);
  }
  return parseResult.data;
}

function extractClientCredentials(
  req: { headers: { authorization?: string } },
  bodyClientId?: string,
  bodyClientSecret?: string,
): { clientId: string; clientSecret: string } | undefined {
  let clientId: string | undefined;
  let clientSecret: string | undefined;

  const basicAuth = req.headers.authorization?.match(/^Basic[ ]+([^\s]+)$/i);
  if (basicAuth) {
    try {
      const decoded = Buffer.from(basicAuth[1], 'base64').toString('utf8');
      const idx = decoded.indexOf(':');
      if (idx >= 0) {
        clientId = decoded.slice(0, idx);
        clientSecret = decoded.slice(idx + 1);
      }
    } catch {
      /* ignore */
    }
  }

  if (!clientId || !clientSecret) {
    if (bodyClientId && bodyClientSecret) {
      clientId = bodyClientId;
      clientSecret = bodyClientSecret;
    }
  }

  // Return undefined if no credentials provided
  // CIMD clients don't require credentials (token_endpoint_auth_method: none)
  if (!clientId || !clientSecret) {
    return undefined;
  }

  return { clientId, clientSecret };
}

export class OidcRouter {
  private readonly oidc: OidcService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly baseUrl: string;
  private readonly appUrl: string;
  private readonly httpAuth: HttpAuthService;
  private readonly config: RootConfigService;

  private constructor(
    oidc: OidcService,
    logger: LoggerService,
    auth: AuthService,
    baseUrl: string,
    appUrl: string,
    httpAuth: HttpAuthService,
    config: RootConfigService,
  ) {
    this.oidc = oidc;
    this.logger = logger;
    this.auth = auth;
    this.baseUrl = baseUrl;
    this.appUrl = appUrl;
    this.httpAuth = httpAuth;
    this.config = config;
  }

  static create(options: {
    auth: AuthService;
    tokenIssuer: TokenIssuer;
    baseUrl: string;
    appUrl: string;
    logger: LoggerService;
    userInfo: UserInfoDatabase;
    oidc: OidcDatabase;
    httpAuth: HttpAuthService;
    config: RootConfigService;
    offlineAccess?: typeof offlineAccessServiceRef.T;
  }) {
    return new OidcRouter(
      OidcService.create(options),
      options.logger,
      options.auth,
      options.baseUrl,
      options.appUrl,
      options.httpAuth,
      options.config,
    );
  }

  public getRouter() {
    const router = Router();

    router.use(json());

    // OpenID Provider Configuration endpoint
    // https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
    // Returns the OpenID Provider Configuration document containing metadata about the provider
    router.get('/.well-known/openid-configuration', (_req, res) => {
      res.json(this.oidc.getConfiguration());
    });

    // JSON Web Key Set endpoint
    // https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.10.1.1
    // Returns the public keys used to verify JWTs issued by this provider
    router.get('/.well-known/jwks.json', async (_req, res) => {
      const { keys } = await this.oidc.listPublicKeys();
      res.json({ keys });
    });

    // Client ID Metadata Document endpoint for CLI
    // https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/
    // Returns the CIMD metadata for the Backstage CLI client
    router.get('/.well-known/oauth-client/cli', (_req, res) => {
      const clientId = `${this.baseUrl}/.well-known/oauth-client/cli`;
      res.json({
        client_id: clientId,
        client_name: 'Backstage CLI',
        redirect_uris: ['http://127.0.0.1:*/callback'],
        response_types: ['code'],
        grant_types: ['authorization_code', 'refresh_token'],
        scope: 'openid offline_access',
        token_endpoint_auth_method: 'none',
      });
    });

    // UserInfo endpoint
    // https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
    // Returns claims about the authenticated user using an access token
    router.get('/v1/userinfo', async (req, res) => {
      const matches = req.headers.authorization?.match(/^Bearer[ ]+(\S+)$/i);
      const token = matches?.[1];
      if (!token) {
        throw new AuthenticationError('No token provided');
      }

      const userInfo = await this.oidc.getUserInfo({ token });

      if (!userInfo) {
        res.status(404).send('User info not found');
        return;
      }

      res.json(userInfo);
    });

    const dcrEnabled = this.config.getOptionalBoolean(
      'auth.experimentalDynamicClientRegistration.enabled',
    );
    const cimdEnabled = this.config.getOptionalBoolean(
      'auth.experimentalClientIdMetadataDocuments.enabled',
    );

    // Authorization routes are available when either DCR or CIMD is enabled
    if (dcrEnabled || cimdEnabled) {
      // Authorization endpoint
      // https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest
      // Handles the initial authorization request from the client, validates parameters,
      // and redirects to the Authorization Session page for user approval
      router.get('/v1/authorize', async (req, res) => {
        const {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: responseType,
          scope,
          state,
          nonce,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
        } = validateRequest(authorizeQuerySchema, req.query);

        try {
          const result = await this.oidc.createAuthorizationSession({
            clientId,
            redirectUri,
            responseType,
            scope,
            state,
            nonce,
            codeChallenge,
            codeChallengeMethod,
          });

          // todo(blam): maybe this URL could be overridable by config if
          // the plugin is mounted somewhere else?
          // support slashes in baseUrl?
          const authSessionRedirectUrl = new URL(
            `./oauth2/authorize/${result.id}`,
            ensureTrailingSlash(this.appUrl),
          );

          return res.redirect(authSessionRedirectUrl.toString());
        } catch (error: unknown) {
          const oidcError = OidcError.fromError(error);

          const errorParams = new URLSearchParams();
          errorParams.append('error', oidcError.error);
          errorParams.append('error_description', oidcError.errorDescription);
          if (state) {
            errorParams.append('state', state);
          }

          const redirectUrl = new URL(redirectUri);
          redirectUrl.search = errorParams.toString();
          return res.redirect(redirectUrl.toString());
        }
      });

      // Authorization Session request details endpoint
      // Returns Authorization Session request details for the frontend
      router.get('/v1/sessions/:sessionId', async (req, res) => {
        const { sessionId } = validateRequest(sessionIdParamSchema, req.params);

        const session = await this.oidc.getAuthorizationSession({
          sessionId,
        });

        return res.json({
          id: session.id,
          clientName: session.clientName,
          scope: session.scope,
          redirectUri: session.redirectUri,
        });
      });

      // Authorization Session approval endpoint
      // Handles user approval of Authorization Session requests and generates authorization codes
      router.post('/v1/sessions/:sessionId/approve', async (req, res) => {
        const { sessionId } = validateRequest(sessionIdParamSchema, req.params);

        const httpCredentials = await this.httpAuth.credentials(req);

        if (!this.auth.isPrincipal(httpCredentials, 'user')) {
          throw new OidcError(
            'access_denied',
            'User authentication required',
            403,
          );
        }

        const { userEntityRef } = httpCredentials.principal;

        const result = await this.oidc.approveAuthorizationSession({
          sessionId,
          userEntityRef,
        });

        return res.json({
          redirectUrl: result.redirectUrl,
        });
      });

      // Authorization Session rejection endpoint
      // Handles user rejection of Authorization Session requests and redirects with error
      router.post('/v1/sessions/:sessionId/reject', async (req, res) => {
        const { sessionId } = validateRequest(sessionIdParamSchema, req.params);

        const httpCredentials = await this.httpAuth.credentials(req);

        if (!this.auth.isPrincipal(httpCredentials, 'user')) {
          throw new OidcError(
            'access_denied',
            'User authentication required',
            403,
          );
        }

        const { userEntityRef } = httpCredentials.principal;

        const session = await this.oidc.getAuthorizationSession({
          sessionId,
        });

        await this.oidc.rejectAuthorizationSession({
          sessionId,
          userEntityRef,
        });

        const errorParams = new URLSearchParams();
        errorParams.append('error', 'access_denied');
        errorParams.append('error_description', 'User denied the request');
        if (session.state) {
          errorParams.append('state', session.state);
        }

        const redirectUrl = new URL(session.redirectUri);
        redirectUrl.search = errorParams.toString();

        return res.json({
          redirectUrl: redirectUrl.toString(),
        });
      });

      // Token endpoint
      // https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
      // Exchanges authorization codes for access tokens and ID tokens
      // Also handles refresh token grant type
      router.post('/v1/token', async (req, res) => {
        const {
          grant_type: grantType,
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
          refresh_token: refreshToken,
          client_id: bodyClientId,
          client_secret: bodyClientSecret,
        } = validateRequest(tokenRequestBodySchema, req.body);

        const expiresIn = readDcrTokenExpiration(this.config);

        // Handle authorization_code grant type
        if (grantType === 'authorization_code') {
          if (!code || !redirectUri) {
            throw new OidcError(
              'invalid_request',
              'Missing code or redirect_uri parameters for authorization_code grant',
              400,
            );
          }

          const result = await this.oidc.exchangeCodeForToken({
            code,
            redirectUri,
            codeVerifier,
            grantType,
            expiresIn,
            clientCredentials: extractClientCredentials(
              req,
              bodyClientId,
              bodyClientSecret,
            ),
          });

          return res.json({
            access_token: result.accessToken,
            token_type: result.tokenType,
            expires_in: result.expiresIn,
            id_token: result.idToken,
            scope: result.scope,
            ...(result.refreshToken && {
              refresh_token: result.refreshToken,
            }),
          });
        }

        // Handle refresh_token grant type
        if (grantType === 'refresh_token') {
          if (!refreshToken) {
            throw new OidcError(
              'invalid_request',
              'Missing refresh_token parameter for refresh_token grant',
              400,
            );
          }

          const result = await this.oidc.refreshAccessToken({
            refreshToken,
            clientCredentials: extractClientCredentials(
              req,
              bodyClientId,
              bodyClientSecret,
            ),
          });

          return res.json({
            access_token: result.accessToken,
            token_type: result.tokenType,
            expires_in: result.expiresIn,
            refresh_token: result.refreshToken,
          });
        }

        // Unsupported grant type
        throw new OidcError(
          'unsupported_grant_type',
          `Grant type ${grantType} is not supported`,
          400,
        );
      });
    }

    // Dynamic Client Registration endpoint - only available when DCR is enabled
    if (dcrEnabled) {
      // https://openid.net/specs/openid-connect-registration-1_0.html#ClientRegistration
      // Allows clients to register themselves dynamically with the provider
      router.post('/v1/register', async (req, res) => {
        const {
          client_name: clientName,
          redirect_uris: redirectUris,
          response_types: responseTypes,
          grant_types: grantTypes,
          scope,
        } = validateRequest(registerRequestBodySchema, req.body);

        const client = await this.oidc.registerClient({
          clientName: clientName ?? 'Backstage CLI',
          redirectUris,
          responseTypes,
          grantTypes,
          scope,
        });

        return res.status(201).json({
          client_id: client.clientId,
          redirect_uris: client.redirectUris,
          client_secret: client.clientSecret,
        });
      });

      // Token Revocation endpoint (RFC 7009-like)
      // Allows clients to revoke refresh tokens
      router.post('/v1/revoke', async (req, res) => {
        const {
          token,
          client_id: bodyClientId,
          client_secret: bodyClientSecret,
        } = validateRequest(revokeRequestBodySchema, req.body ?? {});

        await this.oidc
          .revokeRefreshToken({
            token,
            clientCredentials: extractClientCredentials(
              req,
              bodyClientId,
              bodyClientSecret,
            ),
          })
          .catch(e => {
            // RFC 7009: The authorization server responds with HTTP status code 200
            // even if the client submitted an invalid token
            this.logger.debug('Failed to revoke token', e);
          });

        // Successful (or no-op) revocation
        return res.status(200).send('');
      });
    }

    router.use(OidcError.middleware(this.logger));

    return router;
  }
}
function ensureTrailingSlash(appUrl: string): string | URL | undefined {
  if (appUrl.endsWith('/')) {
    return appUrl;
  }
  return `${appUrl}/`;
}
