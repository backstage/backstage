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
  InputError,
  AuthenticationError,
  NotFoundError,
} from '@backstage/errors';
import { decodeJwt } from 'jose';
import crypto from 'crypto';
import { OidcDatabase } from '../database/OidcDatabase';
import { DateTime } from 'luxon';
import matcher from 'matcher';

export class OidcService {
  private constructor(
    private readonly auth: AuthService,
    private readonly tokenIssuer: TokenIssuer,
    private readonly baseUrl: string,
    private readonly userInfo: UserInfoDatabase,
    private readonly oidc: OidcDatabase,
    private readonly config: RootConfigService,
  ) {}

  static create(options: {
    auth: AuthService;
    tokenIssuer: TokenIssuer;
    baseUrl: string;
    userInfo: UserInfoDatabase;
    oidc: OidcDatabase;
    config: RootConfigService;
  }) {
    return new OidcService(
      options.auth,
      options.tokenIssuer,
      options.baseUrl,
      options.userInfo,
      options.oidc,
      options.config,
    );
  }

  public getConfiguration() {
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
      scopes_supported: ['openid'],
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
      ],
      claims_supported: ['sub', 'ent'],
      grant_types_supported: ['authorization_code'],
      authorization_endpoint: `${this.baseUrl}/v1/authorize`,
      registration_endpoint: `${this.baseUrl}/v1/register`,
      code_challenge_methods_supported: ['S256', 'plain'],
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

    const client = await this.oidc.getClient({ clientId });
    if (!client) {
      throw new InputError('Invalid client_id');
    }

    if (!client.redirectUris.includes(redirectUri)) {
      throw new InputError('Invalid redirect_uri');
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

  public async approveAuthorizationSession(opts: {
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

  public async getAuthorizationSession(opts: { sessionId: string }) {
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

    const client = await this.oidc.getClient({ clientId: session.clientId });
    if (!client) {
      throw new InputError('Invalid client_id');
    }

    return {
      id: session.id,
      clientId: session.clientId,
      clientName: client.clientName,
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
        !this.verifyPkce(
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

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      idToken: token,
      scope: session.scope || 'openid',
    };
  }

  private verifyPkce(
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
