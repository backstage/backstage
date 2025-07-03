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
import { Knex } from 'knex';
import { AuthDatabase } from './AuthDatabase';

type OidcClientRow = {
  client_id: string;
  client_secret: string;
  client_name: string;
  expires_at: string | null;
  response_types: string;
  grant_types: string;
  redirect_uris: string;
  scope: string | null;
  metadata: string | null;
};

type OAuthAuthorizationSessionRow = {
  id: string;
  client_id: string;
  user_entity_ref: string | null;
  redirect_uri: string;
  scope: string | null;
  state: string | null;
  response_type: string;
  code_challenge: string | null;
  code_challenge_method: string | null;
  nonce: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  expires_at: string;
};

type OidcConsentRequestRow = {
  id: string;
  session_id: string;
  expires_at: string;
};

type OidcAuthorizationCodeRow = {
  code: string;
  session_id: string;
  expires_at: string;
  used: boolean;
};

type OidcAccessTokenRow = {
  token_id: string;
  session_id: string;
  expires_at: string;
};

export type Client = {
  clientId: string;
  clientName: string;
  clientSecret: string;
  redirectUris: string[];
  responseTypes: string[];
  grantTypes: string[];
  scope?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
};

export type AuthorizationSession = {
  id: string;
  clientId: string;
  userEntityRef?: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  responseType: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  nonce?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  expiresAt: string;
};

export type ConsentRequest = {
  id: string;
  sessionId: string;
  expiresAt: string;
};

export type AuthorizationCode = {
  code: string;
  sessionId: string;
  expiresAt: string;
  used: boolean;
};

export type AccessToken = {
  tokenId: string;
  sessionId: string;
  expiresAt: string;
};

/**
 * This class provides database operations for OpenID Connect (OIDC) authentication flows.
 * It manages OIDC clients, authorization codes, and access tokens in the database.
 */
export class OidcDatabase {
  private constructor(private readonly db: Knex) {}

  static async create(options: { database: AuthDatabase }) {
    const client = await options.database.get();
    return new OidcDatabase(client);
  }

  async createClient(client: Client) {
    await this.db<OidcClientRow>('oidc_clients').insert({
      client_id: client.clientId,
      client_secret: client.clientSecret,
      client_name: client.clientName,
      expires_at: client.expiresAt,
      response_types: JSON.stringify(client.responseTypes),
      grant_types: JSON.stringify(client.grantTypes),
      redirect_uris: JSON.stringify(client.redirectUris),
      scope: client.scope,
      metadata: JSON.stringify(client.metadata),
    });

    return client;
  }

  async getClient({ clientId }: { clientId: string }) {
    const client = await this.db<OidcClientRow>('oidc_clients')
      .where('client_id', clientId)
      .first();

    if (!client) {
      return null;
    }

    return this.rowToClient(client) as Client;
  }

  async createAuthorizationSession(
    session: Omit<AuthorizationSession, 'status'>,
  ) {
    await this.db<OAuthAuthorizationSessionRow>(
      'oauth_authorization_sessions',
    ).insert({
      id: session.id,
      client_id: session.clientId,
      user_entity_ref: session.userEntityRef,
      redirect_uri: session.redirectUri,
      scope: session.scope,
      state: session.state,
      response_type: session.responseType,
      code_challenge: session.codeChallenge,
      code_challenge_method: session.codeChallengeMethod,
      nonce: session.nonce,
      status: 'pending',
      expires_at: session.expiresAt,
    });

    return {
      ...session,
      status: 'pending',
    };
  }

  async updateAuthorizationSession(
    session: Partial<AuthorizationSession> & { id: string },
  ) {
    const row = this.authorizationSessionToRow(session);
    const updatedFields = Object.fromEntries(
      Object.entries(row).filter(([_, value]) => value !== undefined),
    );

    const [updated] = await this.db<OAuthAuthorizationSessionRow>(
      'oauth_authorization_sessions',
    )
      .where('id', session.id)
      .update(updatedFields)
      .returning('*');

    return this.rowToAuthorizationSession(updated) as AuthorizationSession;
  }

  async createConsentRequest(consentRequest: ConsentRequest) {
    await this.db<OidcConsentRequestRow>('oidc_consent_requests').insert({
      id: consentRequest.id,
      session_id: consentRequest.sessionId,
      expires_at: consentRequest.expiresAt,
    });

    return consentRequest;
  }

  async getConsentRequest({ id }: { id: string }) {
    const consentRequest = await this.db<OidcConsentRequestRow>(
      'oidc_consent_requests',
    )
      .where('id', id)
      .first();

    if (!consentRequest) {
      return null;
    }

    return this.rowToConsentRequest(consentRequest) as ConsentRequest;
  }

  async getAuthorizationSession({ id }: { id: string }) {
    const session = await this.db<OAuthAuthorizationSessionRow>(
      'oauth_authorization_sessions',
    )
      .where('id', id)
      .first();

    if (!session) {
      return null;
    }

    return this.rowToAuthorizationSession(session) as AuthorizationSession;
  }

  async deleteConsentRequest({ id }: { id: string }) {
    await this.db<OidcConsentRequestRow>('oidc_consent_requests')
      .where('id', id)
      .delete();
  }

  async createAuthorizationCode(
    authorizationCode: Omit<AuthorizationCode, 'used'>,
  ) {
    await this.db<OidcAuthorizationCodeRow>('oidc_authorization_codes').insert({
      code: authorizationCode.code,
      session_id: authorizationCode.sessionId,
      expires_at: authorizationCode.expiresAt,
      used: false,
    });

    return {
      ...authorizationCode,
      used: false,
    };
  }

  async getAuthorizationCode({ code }: { code: string }) {
    const authCode = await this.db<OidcAuthorizationCodeRow>(
      'oidc_authorization_codes',
    )
      .where('code', code)
      .first();

    if (!authCode) {
      return null;
    }

    return this.rowToAuthorizationCode(authCode) as AuthorizationCode;
  }

  async updateAuthorizationCode(
    authorizationCode: Partial<AuthorizationCode> & { code: string },
  ) {
    const row = this.authorizationCodeToRow(authorizationCode);
    const updatedFields = Object.fromEntries(
      Object.entries(row).filter(([_, value]) => value !== undefined),
    );

    const [updated] = await this.db<OidcAuthorizationCodeRow>(
      'oidc_authorization_codes',
    )
      .where('code', authorizationCode.code)
      .update(updatedFields)
      .returning('*');

    return this.rowToAuthorizationCode(updated) as AuthorizationCode;
  }

  async createAccessToken(accessToken: AccessToken) {
    await this.db<OidcAccessTokenRow>('oidc_access_tokens').insert({
      token_id: accessToken.tokenId,
      session_id: accessToken.sessionId,
      expires_at: accessToken.expiresAt,
    });

    return accessToken;
  }

  private rowToClient(row: Partial<OidcClientRow>): Partial<Client> {
    return {
      clientId: row.client_id,
      clientName: row.client_name,
      clientSecret: row.client_secret,
      redirectUris: row.redirect_uris
        ? JSON.parse(row.redirect_uris)
        : undefined,
      responseTypes: row.response_types
        ? JSON.parse(row.response_types)
        : undefined,
      grantTypes: row.grant_types ? JSON.parse(row.grant_types) : undefined,
      scope: row.scope ?? undefined,
      expiresAt: row.expires_at ?? undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    };
  }

  private authorizationSessionToRow(
    session: Partial<AuthorizationSession>,
  ): Partial<OAuthAuthorizationSessionRow> {
    return {
      id: session.id,
      client_id: session.clientId,
      user_entity_ref: session.userEntityRef,
      redirect_uri: session.redirectUri,
      scope: session.scope,
      state: session.state,
      response_type: session.responseType,
      code_challenge: session.codeChallenge,
      code_challenge_method: session.codeChallengeMethod,
      nonce: session.nonce,
      status: session.status,
      expires_at: session.expiresAt,
    };
  }

  private rowToAuthorizationSession(
    row: Partial<OAuthAuthorizationSessionRow>,
  ): Partial<AuthorizationSession> {
    return {
      id: row.id,
      clientId: row.client_id,
      userEntityRef: row.user_entity_ref ?? undefined,
      redirectUri: row.redirect_uri,
      scope: row.scope ?? undefined,
      state: row.state ?? undefined,
      responseType: row.response_type,
      codeChallenge: row.code_challenge ?? undefined,
      codeChallengeMethod: row.code_challenge_method ?? undefined,
      nonce: row.nonce ?? undefined,
      status: row.status,
      expiresAt: row.expires_at,
    };
  }

  private rowToConsentRequest(
    row: Partial<OidcConsentRequestRow>,
  ): Partial<ConsentRequest> {
    return {
      id: row.id,
      sessionId: row.session_id,
      expiresAt: row.expires_at,
    };
  }

  private authorizationCodeToRow(
    authorizationCode: Partial<AuthorizationCode>,
  ): Partial<OidcAuthorizationCodeRow> {
    return {
      code: authorizationCode.code,
      session_id: authorizationCode.sessionId,
      expires_at: authorizationCode.expiresAt,
      used: authorizationCode.used,
    };
  }

  private rowToAuthorizationCode(
    row: Partial<OidcAuthorizationCodeRow>,
  ): Partial<AuthorizationCode> {
    return {
      code: row.code,
      sessionId: row.session_id,
      expiresAt: row.expires_at,
      used: Boolean(row.used),
    };
  }
}
