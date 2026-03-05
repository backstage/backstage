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
import { OfflineAccessService } from './OfflineAccessService';
import { validateCimdUrl, fetchCimdMetadata } from './CimdClient';

export class OidcService {
  private readonly auth: AuthService;
  private readonly tokenIssuer: TokenIssuer;
  private readonly baseUrl: string;
  private readonly userInfo: UserInfoDatabase;
  private readonly oidc: OidcDatabase;
  private readonly config: RootConfigService;
  private readonly offlineAccess?: OfflineAccessService;

  private constructor(
    auth: AuthService,
    tokenIssuer: TokenIssuer,
    baseUrl: string,
    userInfo: UserInfoDatabase,
    oidc: OidcDatabase,
    config: RootConfigService,
    offlineAccess?: OfflineAccessService,
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
    offlineAccess?: OfflineAccessService;
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
    const dcrEnabled = this.config.getOptionalBoolean(
      'auth.experimentalDynamicClientRegistration.enabled',
    );
    const { enabled: cimdEnabled } = this.getCimdConfig();

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
      scopes_supported: [
        'openid',
        ...(this.offlineAccess ? ['offline_access'] : []),
      ],
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
        ...(cimdEnabled ? ['none'] : []),
      ],
      claims_supported: ['sub', 'ent'],
      grant_types_supported: [
        'authorization_code',
        ...(this.offlineAccess ? ['refresh_token'] : []),
      ],
      authorization_endpoint: `${this.baseUrl}/v1/authorize`,
      code_challenge_methods_supported: ['S256', 'plain'],
      ...(dcrEnabled && {
        registration_endpoint: `${this.baseUrl}/v1/register`,
        revocation_endpoint: `${this.baseUrl}/v1/revoke`,
      }),
      ...(cimdEnabled && { client_id_metadata_document_supported: true }),
    };
  }

  public async listPublicKeys() {
    return await this.tokenIssuer.listPublicKeys();
  }

  public async getUserInfo({ token }: { token: string }) {
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

  public async registerClient(opts: {
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

  public async createAuthorizationSession(opts: {
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

    const client = await this.resolveClient({ clientId, redirectUri });

    if (client.requiresPkce && !codeChallenge) {
      throw new InputError(
        'PKCE is required for public clients. Provide a code_challenge parameter.',
      );
    }

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

  private getCimdConfig() {
    return {
      enabled:
        this.config.getOptionalBoolean(
          'auth.experimentalClientIdMetadataDocuments.enabled',
        ) ?? false,
      allowedClientIdPatterns: this.config.getOptionalStringArray(
        'auth.experimentalClientIdMetadataDocuments.allowedClientIdPatterns',
      ) ?? ['*'],
      allowedRedirectUriPatterns: this.config.getOptionalStringArray(
        'auth.experimentalClientIdMetadataDocuments.allowedRedirectUriPatterns',
      ) ?? ['*'],
    };
  }

  private async resolveClient(opts: {
    clientId: string;
    redirectUri?: string;
  }) {
    let cimdUrl: URL | undefined;
    try {
      cimdUrl = validateCimdUrl(opts.clientId);
    } catch {
      // Not a valid CIMD URL, fall through to DCR
    }

    if (cimdUrl) {
      return this.resolveCimdClient({ ...opts, cimdUrl });
    }
    return this.resolveDcrClient(opts);
  }

  private async resolveCimdClient(opts: {
    clientId: string;
    cimdUrl: URL;
    redirectUri?: string;
  }) {
    const cimd = this.getCimdConfig();

    if (!cimd.enabled) {
      throw new InputError('Client ID metadata documents not enabled');
    }

    if (
      !cimd.allowedClientIdPatterns.some(pattern =>
        matcher.isMatch(opts.clientId, pattern),
      )
    ) {
      throw new InputError('Invalid client_id');
    }

    const cimdClient = await fetchCimdMetadata({
      clientId: opts.clientId,
      validatedUrl: opts.cimdUrl,
    });

    if (opts.redirectUri) {
      if (
        !cimd.allowedRedirectUriPatterns.some(pattern =>
          matcher.isMatch(opts.redirectUri!, pattern),
        )
      ) {
        throw new InputError('Invalid redirect_uri');
      }

      if (!cimdClient.redirectUris.includes(opts.redirectUri)) {
        throw new InputError('Redirect URI not registered');
      }
    }

    return {
      clientName: cimdClient.clientName,
      redirectUris: cimdClient.redirectUris,
      requiresPkce: true,
    };
  }

  private async resolveDcrClient(opts: {
    clientId: string;
    redirectUri?: string;
  }) {
    const client = await this.oidc.getClient({ clientId: opts.clientId });
    if (!client) {
      throw new InputError('Invalid client_id');
    }

    if (opts.redirectUri && !client.redirectUris.includes(opts.redirectUri)) {
      throw new InputError('Invalid redirect_uri');
    }

    return {
      clientName: client.clientName,
      redirectUris: client.redirectUris,
      requiresPkce: false,
    };
  }

  private async getValidPendingSession(sessionId: string) {
    const session = await this.oidc.getAuthorizationSession({ id: sessionId });

    if (!session) {
      throw new NotFoundError('Invalid authorization session');
    }

    if (DateTime.fromJSDate(session.expiresAt) < DateTime.now()) {
      throw new InputError('Authorization session expired');
    }

    if (session.status !== 'pending') {
      throw new NotFoundError('Authorization session not found or expired');
    }

    return session;
  }

  public async approveAuthorizationSession(opts: {
    sessionId: string;
    userEntityRef: string;
  }) {
    const { sessionId, userEntityRef } = opts;
    const session = await this.getValidPendingSession(sessionId);

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

  public async getAuthorizationSession(opts: { sessionId: string }) {
    const session = await this.getValidPendingSession(opts.sessionId);
    const { clientName } = await this.resolveClient({
      clientId: session.clientId,
    });

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

  public async rejectAuthorizationSession(opts: {
    sessionId: string;
    userEntityRef: string;
  }) {
    const { sessionId, userEntityRef } = opts;
    const session = await this.getValidPendingSession(sessionId);

    await this.oidc.updateAuthorizationSession({
      id: session.id,
      status: 'rejected',
      userEntityRef,
    });
  }

  public async exchangeCodeForToken(params: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
    grantType: string;
  }) {
    const { code, redirectUri, codeVerifier, grantType } = params;

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

    if (session.codeChallenge) {
      if (!codeVerifier) {
        throw new AuthenticationError('Code verifier required for PKCE');
      }

      if (
        !this.verifyPkce({
          codeChallenge: session.codeChallenge,
          codeVerifier,
          method: session.codeChallengeMethod,
        })
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
    const scopes = session.scope?.split(' ') ?? [];
    if (scopes.includes('offline_access') && this.offlineAccess) {
      refreshToken = await this.offlineAccess.issueRefreshToken({
        userEntityRef: session.userEntityRef,
        oidcClientId: session.clientId,
      });
    }

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      idToken: token,
      scope: session.scope || 'openid',
      refreshToken,
    };
  }

  public async refreshAccessToken(params: {
    refreshToken: string;
    clientId?: string;
  }): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
  }> {
    if (!this.offlineAccess) {
      throw new InputError('Refresh tokens are not enabled');
    }

    const { accessToken, refreshToken } =
      await this.offlineAccess.refreshAccessToken({
        refreshToken: params.refreshToken,
        tokenIssuer: this.tokenIssuer,
        clientId: params.clientId,
      });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshToken,
    };
  }

  /**
   * Verifies client credentials against the registered OIDC clients
   */
  public async verifyClientCredentials(options: {
    clientId: string;
    clientSecret: string;
  }): Promise<boolean> {
    const { clientId, clientSecret } = options;
    const client = await this.oidc.getClient({ clientId });
    if (!client?.clientSecret) {
      return false;
    }
    const expected = Buffer.from(client.clientSecret, 'utf8');
    const provided = Buffer.from(clientSecret, 'utf8');
    if (expected.length !== provided.length) {
      return false;
    }
    return crypto.timingSafeEqual(expected, provided);
  }

  /**
   * Revoke a refresh token if offline access is enabled
   */
  public async revokeRefreshToken(token: string): Promise<void> {
    if (!this.offlineAccess) {
      return;
    }
    await this.offlineAccess.revokeRefreshToken(token);
  }

  private verifyPkce(opts: {
    codeChallenge: string;
    codeVerifier: string;
    method?: string;
  }): boolean {
    if (!opts.method || opts.method === 'plain') {
      return opts.codeChallenge === opts.codeVerifier;
    }

    if (opts.method === 'S256') {
      const hash = crypto
        .createHash('sha256')
        .update(opts.codeVerifier)
        .digest('base64url');
      return opts.codeChallenge === hash;
    }

    return false;
  }
}
