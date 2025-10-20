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
import { AuthenticationError, isError } from '@backstage/errors';
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

export class OidcRouter {
  private readonly oidc: OidcService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly appUrl: string;
  private readonly httpAuth: HttpAuthService;
  private readonly config: RootConfigService;

  private constructor(
    oidc: OidcService,
    logger: LoggerService,
    auth: AuthService,
    appUrl: string,
    httpAuth: HttpAuthService,
    config: RootConfigService,
  ) {
    this.oidc = oidc;
    this.logger = logger;
    this.auth = auth;
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
      OidcService.create({
        ...options,
        offlineAccess: options.offlineAccess,
      }),
      options.logger,
      options.auth,
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
        // todo(blam): maybe add zod types for validating input
        const {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: responseType,
          scope,
          state,
          nonce,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
        } = req.query;

        if (!clientId || !redirectUri || !responseType) {
          this.logger.error(`Failed to authorize: Missing required parameters`);
          return res.status(400).json({
            error: 'invalid_request',
            error_description:
              'Missing required parameters: client_id, redirect_uri, response_type',
          });
        }

        try {
          const result = await this.oidc.createAuthorizationSession({
            clientId: clientId as string,
            redirectUri: redirectUri as string,
            responseType: responseType as string,
            scope: scope as string | undefined,
            state: state as string | undefined,
            nonce: nonce as string | undefined,
            codeChallenge: codeChallenge as string | undefined,
            codeChallengeMethod: codeChallengeMethod as string | undefined,
          });

          // todo(blam): maybe this URL could be overridable by config if
          // the plugin is mounted somewhere else?
          // support slashes in baseUrl?
          const authSessionRedirectUrl = new URL(
            `./oauth2/authorize/${result.id}`,
            ensureTrailingSlash(this.appUrl),
          );

          return res.redirect(authSessionRedirectUrl.toString());
        } catch (error) {
          const errorParams = new URLSearchParams();
          errorParams.append(
            'error',
            isError(error) ? error.name : 'server_error',
          );
          errorParams.append(
            'error_description',
            isError(error) ? error.message : 'Unknown error',
          );
          if (state) {
            errorParams.append('state', state as string);
          }

          const redirectUrl = new URL(redirectUri as string);
          redirectUrl.search = errorParams.toString();
          return res.redirect(redirectUrl.toString());
        }
      });

      // Authorization Session request details endpoint
      // Returns Authorization Session request details for the frontend
      router.get('/v1/sessions/:sessionId', async (req, res) => {
        const { sessionId } = req.params;

        if (!sessionId) {
          return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Missing Authorization Session ID',
          });
        }

        try {
          const session = await this.oidc.getAuthorizationSession({
            sessionId,
          });

          return res.json({
            id: session.id,
            clientName: session.clientName,
            scope: session.scope,
            redirectUri: session.redirectUri,
          });
        } catch (error) {
          const description = isError(error) ? error.message : 'Unknown error';
          this.logger.error(
            `Failed to get authorization session: ${description}`,
            error,
          );
          return res.status(404).json({
            error: 'not_found',
            error_description: description,
          });
        }
      });

      // Authorization Session approval endpoint
      // Handles user approval of Authorization Session requests and generates authorization codes
      router.post('/v1/sessions/:sessionId/approve', async (req, res) => {
        const { sessionId } = req.params;

        if (!sessionId) {
          return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Missing authorization session ID',
          });
        }

        try {
          const httpCredentials = await this.httpAuth.credentials(req);

          if (!this.auth.isPrincipal(httpCredentials, 'user')) {
            return res.status(401).json({
              error: 'unauthorized',
              error_description: 'Authentication required',
            });
          }

          const { userEntityRef } = httpCredentials.principal;

          const result = await this.oidc.approveAuthorizationSession({
            sessionId,
            userEntityRef,
          });

          return res.json({
            redirectUrl: result.redirectUrl,
          });
        } catch (error) {
          const description = isError(error) ? error.message : 'Unknown error';
          this.logger.error(
            `Failed to approve authorization session: ${description}`,
            error,
          );
          return res.status(400).json({
            error: 'invalid_request',
            error_description: description,
          });
        }
      });

      // Authorization Session rejection endpoint
      // Handles user rejection of Authorization Session requests and redirects with error
      router.post('/v1/sessions/:sessionId/reject', async (req, res) => {
        const { sessionId } = req.params;

        if (!sessionId) {
          return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Missing authorization session ID',
          });
        }

        const httpCredentials = await this.httpAuth.credentials(req);

        if (!this.auth.isPrincipal(httpCredentials, 'user')) {
          return res.status(401).json({
            error: 'unauthorized',
            error_description: 'Authentication required',
          });
        }

        const { userEntityRef } = httpCredentials.principal;
        try {
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
        } catch (error) {
          const description = isError(error) ? error.message : 'Unknown error';
          this.logger.error(
            `Failed to reject authorization session: ${description}`,
            error,
          );

          return res.status(400).json({
            error: 'invalid_request',
            error_description: description,
          });
        }
      });

      // Token endpoint
      // https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
      // Exchanges authorization codes for access tokens and ID tokens
      // Also handles refresh token grant type
      router.post('/v1/token', async (req, res) => {
        // todo(blam): maybe add zod types for validating input
        const {
          grant_type: grantType,
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
          refresh_token: refreshToken,
        } = req.body;

        if (!grantType) {
          this.logger.error(
            `Failed to process token request: Missing grant_type`,
          );
          return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Missing grant_type parameter',
          });
        }

        const expiresIn = readDcrTokenExpiration(this.config);

        try {
          // Handle authorization_code grant type
          if (grantType === 'authorization_code') {
            if (!code || !redirectUri) {
              this.logger.error(
                `Failed to exchange code for token: Missing required parameters`,
              );
              return res.status(400).json({
                error: 'invalid_request',
                error_description:
                  'Missing code or redirect_uri parameters for authorization_code grant',
              });
            }

            const result = await this.oidc.exchangeCodeForToken({
              code,
              redirectUri,
              codeVerifier,
              grantType,
              expiresIn,
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
              this.logger.error(
                `Failed to refresh token: Missing refresh_token parameter`,
              );
              return res.status(400).json({
                error: 'invalid_request',
                error_description:
                  'Missing refresh_token parameter for refresh_token grant',
              });
            }

            const result = await this.oidc.refreshAccessToken({
              refreshToken,
            });

            return res.json({
              access_token: result.accessToken,
              token_type: result.tokenType,
              expires_in: result.expiresIn,
              refresh_token: result.refreshToken,
            });
          }

          // Unsupported grant type
          this.logger.error(`Unsupported grant type: ${grantType}`);
          return res.status(400).json({
            error: 'unsupported_grant_type',
            error_description: `Grant type ${grantType} is not supported`,
          });
        } catch (error) {
          const description = isError(error) ? error.message : 'Unknown error';
          this.logger.error(
            `Failed to process token request: ${description}`,
            error,
          );

          if (isError(error)) {
            if (error.name === 'AuthenticationError') {
              return res.status(401).json({
                error: 'invalid_client',
                error_description: error.message,
              });
            }
            if (error.name === 'InputError') {
              return res.status(400).json({
                error: 'invalid_request',
                error_description: error.message,
              });
            }
          }

          return res.status(500).json({
            error: 'server_error',
            error_description: description,
          });
        }
      });
    }

    // Dynamic Client Registration endpoint - only available when DCR is enabled
    if (dcrEnabled) {
      // https://openid.net/specs/openid-connect-registration-1_0.html#ClientRegistration
      // Allows clients to register themselves dynamically with the provider
      router.post('/v1/register', async (req, res) => {
        // todo(blam): maybe add zod types for validating input
        const {
          client_name: clientName,
          redirect_uris: redirectUris,
          response_types: responseTypes,
          grant_types: grantTypes,
          scope,
        } = req.body;

        if (!redirectUris?.length) {
          res.status(400).json({
            error: 'invalid_request',
            error_description: 'redirect_uris is required',
          });
          return;
        }

        try {
          const client = await this.oidc.registerClient({
            clientName,
            redirectUris,
            responseTypes,
            grantTypes,
            scope,
          });

          res.status(201).json({
            client_id: client.clientId,
            redirect_uris: client.redirectUris,
            client_secret: client.clientSecret,
          });
        } catch (e) {
          const description = isError(e) ? e.message : 'Unknown error';
          this.logger.error(`Failed to register client: ${description}`, e);

          res.status(500).json({
            error: 'server_error',
            error_description: `Failed to register client: ${description}`,
          });
        }
      });

      // Token Revocation endpoint (RFC 7009-like)
      // Allows clients to revoke refresh tokens
      router.post('/v1/revoke', async (req, res) => {
        try {
          // Parse token from request body (application/x-www-form-urlencoded or JSON)
          const { token, token_type_hint: tokenTypeHint } = (req.body ??
            {}) as Record<string, unknown>;

          if (!token || typeof token !== 'string') {
            return res.status(400).json({
              error: 'invalid_request',
              error_description: 'Missing token',
            });
          }

          // Only refresh_token revocation is supported currently
          if (
            tokenTypeHint &&
            typeof tokenTypeHint === 'string' &&
            tokenTypeHint !== 'refresh_token'
          ) {
            // Hint is optional; ignore unsupported hints per RFC 7009
          }

          // Client authentication: client_secret_basic or client_secret_post
          let clientId: string | undefined;
          let clientSecret: string | undefined;

          // Basic auth
          const basicAuth =
            req.headers.authorization?.match(/^Basic[ ]+([^\s]+)$/i);
          if (basicAuth) {
            try {
              const decoded = Buffer.from(basicAuth[1], 'base64').toString(
                'utf8',
              );
              const idx = decoded.indexOf(':');
              if (idx >= 0) {
                clientId = decoded.slice(0, idx);
                clientSecret = decoded.slice(idx + 1);
              }
            } catch {
              // fall through
            }
          }

          // client_secret_post
          if (!clientId || !clientSecret) {
            const { client_id, client_secret } = (req.body ?? {}) as Record<
              string,
              unknown
            >;
            if (
              typeof client_id === 'string' &&
              typeof client_secret === 'string'
            ) {
              clientId = client_id;
              clientSecret = client_secret;
            }
          }

          if (!clientId || !clientSecret) {
            return res.status(401).json({
              error: 'invalid_client',
              error_description: 'Client authentication required',
            });
          }

          // Verify client credentials
          try {
            const ok = await this.oidc.verifyClientCredentials({
              clientId,
              clientSecret,
            });
            if (!ok) {
              return res.status(401).json({
                error: 'invalid_client',
                error_description: 'Invalid client credentials',
              });
            }
          } catch (e) {
            this.logger.error('Failed to authenticate client for revoke', e);
            return res.status(500).json({
              error: 'server_error',
              error_description: 'Failed to authenticate client',
            });
          }

          // Revoke refresh token if offline access is enabled
          try {
            await this.oidc.revokeRefreshToken(token);
          } catch (e) {
            // RFC 7009: The authorization server responds with HTTP status code 200
            // even if the client submitted an invalid token
            this.logger.debug('Failed to revoke token', e);
          }

          // Successful (or no-op) revocation
          return res.status(200).send('');
        } catch (e) {
          const description = isError(e) ? e.message : 'Unknown error';
          this.logger.error(`Failed to revoke token: ${description}`, e);
          return res.status(500).json({
            error: 'server_error',
            error_description: `Failed to revoke token: ${description}`,
          });
        }
      });
    }

    return router;
  }
}
function ensureTrailingSlash(appUrl: string): string | URL | undefined {
  if (appUrl.endsWith('/')) {
    return appUrl;
  }
  return `${appUrl}/`;
}
