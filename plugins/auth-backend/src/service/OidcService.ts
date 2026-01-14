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
import { AuthService, RootConfigService } from '@backstage/backend-plugin-api';
import { TokenIssuer } from '../identity/types';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import {
  AuthenticationError,
  InputError,
  NotFoundError,
} from '@backstage/errors';
import { decodeJwt } from 'jose';
import crypto from 'node:crypto';
import { OidcDatabase } from '../database/OidcDatabase';
import { DateTime } from 'luxon';
import matcher from 'matcher';
import { isCimdUrl, fetchCimdMetadata } from './CimdClient';
import { offlineAccessServiceRef } from './OfflineAccessService';
import { readDcrTokenExpiration } from './readTokenExpiration';

export class OidcService {
  private readonly auth: AuthService;
  private readonly tokenIssuer: TokenIssuer;
  private readonly baseUrl: string;
  private readonly userInfo: UserInfoDatabase;
  private readonly oidc: OidcDatabase;
  private readonly config: RootConfigService;
  private readonly offlineAccess?: typeof offlineAccessServiceRef.T;

  private constructor(
    auth: AuthService,
    tokenIssuer: TokenIssuer,
    baseUrl: string,
    userInfo: UserInfoDatabase,
    oidc: OidcDatabase,
    config: RootConfigService,
    offlineAccess?: typeof offlineAccessServiceRef.T,
  ) {
    this.auth = auth;
    this.tokenIssuer = tokenIssuer;
    this.baseUrl = baseUrl;
    this.userInfo = userInfo;
    this.oidc = oidc;
    this.config = config;
    this.offlineAccess = offlineAccess;
  }

  static create(options: {
    auth: AuthService;
    tokenIssuer: TokenIssuer;
    baseUrl: string;
    userInfo: UserInfoDatabase;
    oidc: OidcDatabase;
    config: RootConfigService;
    offlineAccess?: typeof offlineAccessServiceRef.T;
  }) {
    return new OidcService(
      options.auth,
      options.tokenIssuer,
      options.baseUrl,
      options.userInfo,
      options.oidc,
      options.config,
      options.offlineAccess,
    );
  }

  public getConfiguration() {
    const cimdEnabled = this.config.getOptionalBoolean(
      'auth.experimentalClientIdMetadataDocuments.enabled',
    );
    const dcrEnabled = this.config.getOptionalBoolean(
      'auth.experimentalDynamicClientRegistration.enabled',
    );

    return {
      issuer: this.baseUrl,
      token_endpoint: `${this.baseUrl}/v1/token`,
      userinfo_endpoint: `${this.baseUrl}/v1/userinfo`,
      jwks_uri: `${this.baseUrl}/.well-known/jwks.json`,
      response_types_supported: ['code', 'id_token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: [
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
        'PS256',
        'PS384',
        'PS512',
        'EdDSA',
      ],
      scopes_supported: ['openid', 'offline_access'],
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
      ],
      revocation_endpoint_auth_methods_supported: [
        'client_secret_post',
        'client_secret_basic',
      ],
      claims_supported: ['sub', 'ent'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      authorization_endpoint: `${this.baseUrl}/v1/authorize`,
      code_challenge_methods_supported: ['S256', 'plain'],
      ...(dcrEnabled && {
        registration_endpoint: `${this.baseUrl}/v1/register`,
      }),
      ...(cimdEnabled && { client_id_metadata_document_supported: true }),
    };
  }

  async listPublicKeys() {
    return await this.tokenIssuer.listPublicKeys();
  }

  async getUserInfo({ token }: { token: string }) {
    const credentials = await this.auth.authenticate(token, {
      allowLimitedAccess: true,
    });
    if (!this.auth.isPrincipal(credentials, 'user')) {
      throw new InputError(
        'Userinfo endpoint must be called with a token that represents a user principal',
      );
    }

    const { sub: userEntityRef } = decodeJwt(token);

    if (typeof userEntityRef !== 'string') {
      throw new Error('Invalid user token, user entity ref must be a string');
    }
    return await this.userInfo.getUserInfo(userEntityRef);
  }

  async registerClient(opts: {
    responseTypes?: string[];
    grantTypes?: string[];
    clientName: string;
    redirectUris?: string[];
    scope?: string;
  }) {
    const generatedClientId = crypto.randomUUID();
    const generatedClientSecret = crypto.randomUUID();

    const allowedRedirectUriPatterns = this.config.getOptionalStringArray(
      'auth.experimentalDynamicClientRegistration.allowedRedirectUriPatterns',
    ) ?? ['*'];

    for (const redirectUri of opts.redirectUris ?? []) {
      if (
        !allowedRedirectUriPatterns.some(pattern =>
          matcher.isMatch(redirectUri, pattern),
        )
      ) {
        throw new InputError('Invalid redirect_uri');
      }
    }

    return await this.oidc.createClient({
      clientId: generatedClientId,
      clientName: opts.clientName,
      clientSecret: generatedClientSecret,
      redirectUris: opts.redirectUris ?? [],
      responseTypes: opts.responseTypes ?? ['code'],
      grantTypes: opts.grantTypes ?? ['authorization_code'],
      scope: opts.scope,
    });
  }

  async createAuthorizationSession(opts: {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope?: string;
    state?: string;
    nonce?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
  }) {
    const {
      clientId,
      redirectUri,
      responseType,
      scope,
      state,
      nonce,
      codeChallenge,
      codeChallengeMethod,
    } = opts;

    if (responseType !== 'code') {
      throw new InputError('Only authorization code flow is supported');
    }

    // Determine if this is a CIMD client (URL-based client_id) or DCR client
    const client = await this.resolveClient(clientId, redirectUri);

    if (codeChallenge) {
      if (
        !codeChallengeMethod ||
        !['S256', 'plain'].includes(codeChallengeMethod)
      ) {
        throw new InputError('Invalid code_challenge_method');
      }
    }

    const sessionId = crypto.randomUUID();
    const sessionExpiresAt = DateTime.now().plus({ hours: 1 }).toJSDate();

    await this.oidc.createAuthorizationSession({
      id: sessionId,
      clientId,
      redirectUri,
      responseType,
      scope,
      state,
      codeChallenge,
      codeChallengeMethod,
      nonce,
      expiresAt: sessionExpiresAt,
    });

    return {
      id: sessionId,
      clientName: client.clientName,
      scope,
      redirectUri,
    };
  }

  /**
   * Resolves the client name for a given client ID.
   * For CIMD clients (URL-based), fetches metadata from the URL.
   * For DCR clients, looks up the client in the database.
   */
  private async getClientName(clientId: string): Promise<string> {
    if (isCimdUrl(clientId)) {
      const cimdClient = await fetchCimdMetadata(clientId);
      return cimdClient.clientName;
    }

    const client = await this.oidc.getClient({ clientId });
    if (!client) {
      throw new InputError('Invalid client_id');
    }
    return client.clientName;
  }

  private async resolveClient(
    clientId: string,
    redirectUri: string,
  ): Promise<{ clientName: string; redirectUris: string[] }> {
    const cimdEnabled = this.config.getOptionalBoolean(
      'auth.experimentalClientIdMetadataDocuments.enabled',
    );

    // Check if client_id is a CIMD URL
    if (isCimdUrl(clientId)) {
      if (!cimdEnabled) {
        throw new InputError('Client ID metadata documents not enabled');
      }

      // Validate client_id against allowedClientIdPatterns
      const allowedClientIdPatterns = this.config.getOptionalStringArray(
        'auth.experimentalClientIdMetadataDocuments.allowedClientIdPatterns',
      ) ?? ['*'];

      if (
        !allowedClientIdPatterns.some(pattern =>
          matcher.isMatch(clientId, pattern),
        )
      ) {
        throw new InputError('Invalid client_id');
      }

      const cimdClient = await fetchCimdMetadata(clientId);

      // Validate redirect_uri against CIMD allowedRedirectUriPatterns
      const allowedRedirectUriPatterns = this.config.getOptionalStringArray(
        'auth.experimentalClientIdMetadataDocuments.allowedRedirectUriPatterns',
      ) ?? ['*'];

      if (
        !allowedRedirectUriPatterns.some(pattern =>
          matcher.isMatch(redirectUri, pattern),
        )
      ) {
        throw new InputError('Invalid redirect_uri');
      }

      // Validate redirect_uri matches one of the client's registered URI patterns
      if (
        !cimdClient.redirectUris.some(pattern =>
          matcher.isMatch(redirectUri, pattern),
        )
      ) {
        throw new InputError('Redirect URI not registered');
      }

      return {
        clientName: cimdClient.clientName,
        redirectUris: cimdClient.redirectUris,
      };
    }

    // Fall back to database client lookup (DCR or pre-registered clients)
    const client = await this.oidc.getClient({ clientId });
    if (!client) {
      throw new InputError('Invalid client_id');
    }

    if (!client.redirectUris.includes(redirectUri)) {
      throw new InputError('Invalid redirect_uri');
    }

    return {
      clientName: client.clientName,
      redirectUris: client.redirectUris,
    };
  }

  async approveAuthorizationSession(opts: {
    sessionId: string;
    userEntityRef: string;
  }) {
    const { sessionId, userEntityRef } = opts;

    const session = await this.oidc.getAuthorizationSession({
      id: sessionId,
    });

    if (!session) {
      throw new NotFoundError('Invalid authorization session');
    }

    if (DateTime.fromJSDate(session.expiresAt) < DateTime.now()) {
      throw new InputError('Authorization session expired');
    }

    if (session.status !== 'pending') {
      throw new NotFoundError('Authorization session not found or expired');
    }

    await this.oidc.updateAuthorizationSession({
      id: session.id,
      userEntityRef,
      status: 'approved',
    });

    const authorizationCode = crypto.randomBytes(32).toString('base64url');
    const codeExpiresAt = DateTime.now().plus({ minutes: 10 }).toJSDate();

    await this.oidc.createAuthorizationCode({
      code: authorizationCode,
      sessionId: session.id,
      expiresAt: codeExpiresAt,
    });

    const redirectUrl = new URL(session.redirectUri);

    redirectUrl.searchParams.append('code', authorizationCode);
    if (session.state) {
      redirectUrl.searchParams.append('state', session.state);
    }

    return {
      redirectUrl: redirectUrl.toString(),
    };
  }

  async getAuthorizationSession(opts: { sessionId: string }) {
    const session = await this.oidc.getAuthorizationSession({
      id: opts.sessionId,
    });

    if (!session) {
      throw new NotFoundError('Invalid authorization session');
    }

    if (DateTime.fromJSDate(session.expiresAt) < DateTime.now()) {
      throw new InputError('Authorization session expired');
    }

    if (session.status !== 'pending') {
      throw new NotFoundError('Authorization session not found or expired');
    }

    const clientName = await this.getClientName(session.clientId);

    return {
      id: session.id,
      clientId: session.clientId,
      clientName,
      redirectUri: session.redirectUri,
      scope: session.scope,
      state: session.state,
      responseType: session.responseType,
      codeChallenge: session.codeChallenge,
      codeChallengeMethod: session.codeChallengeMethod,
      nonce: session.nonce,
      expiresAt: session.expiresAt,
      status: session.status,
    };
  }

  async rejectAuthorizationSession(opts: {
    sessionId: string;
    userEntityRef: string;
  }) {
    const { sessionId, userEntityRef } = opts;

    const session = await this.oidc.getAuthorizationSession({
      id: sessionId,
    });

    if (!session) {
      throw new NotFoundError('Invalid authorization session');
    }

    if (DateTime.fromJSDate(session.expiresAt) < DateTime.now()) {
      throw new InputError('Authorization session expired');
    }

    if (session.status !== 'pending') {
      throw new NotFoundError('Authorization session not found or expired');
    }

    await this.oidc.updateAuthorizationSession({
      id: session.id,
      status: 'rejected',
      userEntityRef,
    });
  }

  async exchangeCodeForToken(params: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
    grantType: string;
    expiresIn: number;
    clientCredentials?: { clientId: string; clientSecret: string };
  }) {
    const {
      code,
      redirectUri,
      codeVerifier,
      grantType,
      expiresIn,
      clientCredentials,
    } = params;

    if (grantType !== 'authorization_code') {
      throw new InputError('Unsupported grant type');
    }

    const authCode = await this.oidc.getAuthorizationCode({ code });
    if (!authCode) {
      throw new AuthenticationError('Invalid authorization code');
    }

    if (DateTime.fromJSDate(authCode.expiresAt) < DateTime.now()) {
      throw new AuthenticationError('Authorization code expired');
    }

    if (authCode.used) {
      throw new AuthenticationError('Authorization code already used');
    }

    const session = await this.oidc.getAuthorizationSession({
      id: authCode.sessionId,
    });

    if (!session) {
      throw new NotFoundError('Invalid authorization session');
    }

    if (session.redirectUri !== redirectUri) {
      throw new AuthenticationError('Redirect URI mismatch');
    }

    if (session.status !== 'approved') {
      throw new AuthenticationError('Authorization not approved');
    }

    if (!session.userEntityRef) {
      throw new AuthenticationError('No user associated with authorization');
    }

    // Verify client credentials for DCR clients (non-CIMD)
    // CIMD clients use token_endpoint_auth_method: none, so no credentials needed
    if (!isCimdUrl(session.clientId)) {
      if (!clientCredentials) {
        throw new AuthenticationError('Client credentials required');
      }
      const isValidClient = await this.#verifyClientCredentials(
        clientCredentials,
      );
      if (!isValidClient) {
        throw new AuthenticationError('Invalid client credentials');
      }
    }

    if (session.codeChallenge) {
      if (!codeVerifier) {
        throw new AuthenticationError('Code verifier required for PKCE');
      }

      if (
        !this.#verifyPkceChallenge(
          session.codeChallenge,
          codeVerifier,
          session.codeChallengeMethod,
        )
      ) {
        throw new AuthenticationError('Invalid code verifier');
      }
    }

    await this.oidc.updateAuthorizationCode({
      code,
      used: true,
    });

    const { token } = await this.tokenIssuer.issueToken({
      claims: {
        sub: session.userEntityRef,
      },
    });

    // Check if offline_access scope is requested
    let refreshToken: string | undefined;
    if (
      session.scope?.includes('offline_access') &&
      this.offlineAccess &&
      session.clientId
    ) {
      refreshToken = await this.offlineAccess.issueRefreshToken({
        userEntityRef: session.userEntityRef,
        oidcClientId: session.clientId,
      });
    }

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: expiresIn,
      idToken: token,
      scope: session.scope || 'openid',
      refreshToken,
    };
  }

  async refreshAccessToken(params: {
    refreshToken: string;
    clientCredentials?: { clientId: string; clientSecret: string };
  }): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
  }> {
    if (!this.offlineAccess) {
      throw new InputError('Refresh tokens are not enabled');
    }

    // Get the client_id from the refresh token metadata
    const tokenMetadata = await this.offlineAccess.getRefreshTokenMetadata(
      params.refreshToken,
    );
    if (!tokenMetadata) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // For CIMD clients (URL-based client_id), validate against allowedClientIdPatterns
    // For DCR clients, verify credentials
    const isCimdClient = this.#validateCimdClientId(tokenMetadata.clientId);
    if (!isCimdClient) {
      if (!params.clientCredentials) {
        throw new AuthenticationError('Client credentials required');
      }
      const isValidClient = await this.#verifyClientCredentials(
        params.clientCredentials,
      );
      if (!isValidClient) {
        throw new AuthenticationError('Invalid client credentials');
      }
      // Verify the credentials match the token's client
      if (params.clientCredentials.clientId !== tokenMetadata.clientId) {
        throw new AuthenticationError('Client ID mismatch');
      }
    }

    const { accessToken, refreshToken } =
      await this.offlineAccess.refreshAccessToken({
        refreshToken: params.refreshToken,
        clientId: tokenMetadata.clientId,
        tokenIssuer: this.tokenIssuer,
      });

    const expiresIn = readDcrTokenExpiration(this.config);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      refreshToken,
    };
  }

  /**
   * Revoke a refresh token if offline access is enabled
   */
  async revokeRefreshToken(options: {
    token: string;
    clientCredentials?: { clientId: string; clientSecret: string };
  }): Promise<void> {
    if (!this.offlineAccess) {
      return;
    }

    const { token, clientCredentials } = options;

    // Get the client_id from the refresh token metadata
    const tokenMetadata = await this.offlineAccess.getRefreshTokenMetadata(
      token,
    );
    if (!tokenMetadata) {
      // Token doesn't exist or already revoked - per RFC 7009, return success
      return;
    }

    // For CIMD clients (URL-based client_id), validate against allowedClientIdPatterns
    // For DCR clients, verify credentials
    const isCimdClient = this.#validateCimdClientId(tokenMetadata.clientId);
    if (!isCimdClient) {
      if (!clientCredentials) {
        throw new AuthenticationError('Client credentials required');
      }
      const isValidClient = await this.#verifyClientCredentials(
        clientCredentials,
      );
      if (!isValidClient) {
        throw new AuthenticationError('Invalid client credentials');
      }
      // Verify the credentials match the token's client
      if (clientCredentials.clientId !== tokenMetadata.clientId) {
        throw new AuthenticationError('Client ID mismatch');
      }
    }

    await this.offlineAccess.revokeRefreshToken(token, {
      clientId: tokenMetadata.clientId,
    });
  }

  /**
   * Checks if client_id is a CIMD URL and validates it against configuration.
   * Returns true if it's a valid CIMD client, false if it's not a CIMD URL.
   * Throws AuthenticationError if it's a CIMD URL but invalid or not allowed.
   */
  #validateCimdClientId(clientId: string): boolean {
    if (!isCimdUrl(clientId)) {
      return false;
    }

    const cimdEnabled = this.config.getOptionalBoolean(
      'auth.experimentalClientIdMetadataDocuments.enabled',
    );

    if (!cimdEnabled) {
      throw new AuthenticationError('Client ID metadata documents not enabled');
    }

    const allowedClientIdPatterns = this.config.getOptionalStringArray(
      'auth.experimentalClientIdMetadataDocuments.allowedClientIdPatterns',
    ) ?? ['*'];

    if (
      !allowedClientIdPatterns.some(pattern =>
        matcher.isMatch(clientId, pattern),
      )
    ) {
      throw new AuthenticationError('Invalid client_id');
    }

    return true;
  }

  /**
   * Verifies client credentials against the registered OIDC clients
   */
  async #verifyClientCredentials(clientCredentials: {
    clientId: string;
    clientSecret: string;
  }): Promise<boolean> {
    const client = await this.oidc.getClient({
      clientId: clientCredentials.clientId,
    });
    return Boolean(
      client && client.clientSecret === clientCredentials.clientSecret,
    );
  }

  #verifyPkceChallenge(
    codeChallenge: string,
    codeVerifier: string,
    method?: string,
  ): boolean {
    if (!method || method === 'plain') {
      return codeChallenge === codeVerifier;
    }

    if (method === 'S256') {
      const hash = crypto.createHash('sha256').update(codeVerifier).digest();
      const base64urlHash = hash.toString('base64url');
      return codeChallenge === base64urlHash;
    }

    return false;
  }
}
