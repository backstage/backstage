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

import { DateTime } from 'luxon';

type OidcClientRow = {
  client_id: string;
  client_secret: string;
  client_name: string;
  created_at: string;
  expires_at: string | null;
  response_types: string;
  grant_types: string;
  redirect_uris: string;
  scope: string | null;
  metadata: string | null;
};

type OidcAuthorizationCodeRow = {
  code: string;
  client_id: string;
  user_entity_ref: string;
  redirect_uri: string;
  scope: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
  nonce: string | null;
  created_at: string;
  expires_at: string;
  used?: boolean;
};

type OidcAccessTokenRow = {
  token_id: string;
  client_id: string;
  user_entity_ref: string;
  scope: string | null;
  created_at: string;
  expires_at: string;
  revoked?: boolean;
};

type Client = {
  clientId: string;
  clientName: string;
  clientSecret: string;
  redirectUris: string[];
  responseTypes: string[];
  grantTypes: string[];
  scope?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type AuthorizationCode = {
  code: string;
  clientId: string;
  userEntityRef: string;
  redirectUri: string;
  scope?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  nonce?: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
};

type AccessToken = {
  tokenId: string;
  clientId: string;
  userEntityRef: string;
  scope?: string;
  createdAt: string;
  expiresAt: string;
  revoked?: boolean;
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

  async createClient(client: Omit<Client, 'createdAt'>) {
    const now = DateTime.now().toString();
    console.log({
      client_id: client.clientId,
      client_secret: client.clientSecret,
      client_name: client.clientName,
      created_at: now,
      expires_at: client.expiresAt,
      response_types: JSON.stringify(client.responseTypes),
      grant_types: JSON.stringify(client.grantTypes),
      redirect_uris: JSON.stringify(client.redirectUris),
      scope: client.scope,
      metadata: JSON.stringify(client.metadata),
    });
    await this.db<OidcClientRow>('oidc_clients').insert({
      client_id: client.clientId,
      client_secret: client.clientSecret,
      client_name: client.clientName,
      created_at: now,
      expires_at: client.expiresAt,
      response_types: JSON.stringify(client.responseTypes),
      grant_types: JSON.stringify(client.grantTypes),
      redirect_uris: JSON.stringify(client.redirectUris),
      scope: client.scope,
      metadata: JSON.stringify(client.metadata),
    });

    return {
      ...client,
      createdAt: now,
    };
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

  async createAuthorizationCode(
    authorizationCode: Omit<AuthorizationCode, 'createdAt' | 'used'>,
  ) {
    const now = DateTime.now().toString();

    await this.db<OidcAuthorizationCodeRow>('oidc_authorization_codes').insert({
      code: authorizationCode.code,
      client_id: authorizationCode.clientId,
      user_entity_ref: authorizationCode.userEntityRef,
      redirect_uri: authorizationCode.redirectUri,
      scope: authorizationCode.scope,
      code_challenge: authorizationCode.codeChallenge,
      code_challenge_method: authorizationCode.codeChallengeMethod,
      nonce: authorizationCode.nonce,
      expires_at: authorizationCode.expiresAt,
      created_at: now,
      used: false,
    });

    return {
      ...authorizationCode,
      createdAt: now,
      used: false,
    };
  }

  async getAuthorizationCode({ code }: { code: string }) {
    const authorizationCode = await this.db<OidcAuthorizationCodeRow>(
      'oidc_authorization_codes',
    )
      .where('code', code)
      .first();

    if (!authorizationCode) {
      return null;
    }

    return this.rowToAuthorizationCode(authorizationCode) as AuthorizationCode;
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

  async createAccessToken(accessToken: Omit<AccessToken, 'createdAt'>) {
    const now = DateTime.now().toString();

    await this.db<OidcAccessTokenRow>('oidc_access_tokens').insert({
      token_id: accessToken.tokenId,
      client_id: accessToken.clientId,
      user_entity_ref: accessToken.userEntityRef,
      scope: accessToken.scope,
      created_at: now,
      expires_at: accessToken.expiresAt,
      revoked: accessToken.revoked ?? false,
    });

    return {
      ...accessToken,
      createdAt: now,
    };
  }

  async getAccessToken({ tokenId }: { tokenId: string }) {
    const accessToken = await this.db<OidcAccessTokenRow>('oidc_access_tokens')
      .where('token_id', tokenId)
      .first();

    if (!accessToken) {
      return null;
    }

    return this.rowToAccessToken(accessToken) as AccessToken;
  }

  async updateAccessToken(
    accessToken: Partial<AccessToken> & { tokenId: string },
  ) {
    const row = this.accessTokenToRow(accessToken);
    const updatedFields = Object.fromEntries(
      Object.entries(row).filter(([_, value]) => value !== undefined),
    );
    const [updated] = await this.db<OidcAccessTokenRow>('oidc_access_tokens')
      .where('token_id', accessToken.tokenId)
      .update(updatedFields)
      .returning('*');

    return this.rowToAccessToken(updated) as AccessToken;
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
      createdAt: row.created_at,
    };
  }

  private authorizationCodeToRow(
    authorizationCode: Partial<AuthorizationCode>,
  ): Partial<OidcAuthorizationCodeRow> {
    return {
      code: authorizationCode.code,
      client_id: authorizationCode.clientId,
      user_entity_ref: authorizationCode.userEntityRef,
      redirect_uri: authorizationCode.redirectUri,
      scope: authorizationCode.scope,
      code_challenge: authorizationCode.codeChallenge,
      code_challenge_method: authorizationCode.codeChallengeMethod,
      nonce: authorizationCode.nonce,
      created_at: authorizationCode.createdAt,
      expires_at: authorizationCode.expiresAt,
      used: authorizationCode.used,
    };
  }

  private rowToAuthorizationCode(
    row: Partial<OidcAuthorizationCodeRow>,
  ): Partial<AuthorizationCode> {
    return {
      code: row.code,
      clientId: row.client_id,
      userEntityRef: row.user_entity_ref,
      redirectUri: row.redirect_uri,
      scope: row.scope ?? undefined,
      codeChallenge: row.code_challenge ?? undefined,
      codeChallengeMethod: row.code_challenge_method ?? undefined,
      nonce: row.nonce ?? undefined,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      used: Boolean(row.used),
    };
  }

  private accessTokenToRow(
    accessToken: Partial<AccessToken>,
  ): Partial<OidcAccessTokenRow> {
    return {
      token_id: accessToken.tokenId,
      client_id: accessToken.clientId,
      user_entity_ref: accessToken.userEntityRef,
      scope: accessToken.scope,
      created_at: accessToken.createdAt,
      expires_at: accessToken.expiresAt,
      revoked: accessToken.revoked,
    };
  }

  private rowToAccessToken(
    row: Partial<OidcAccessTokenRow>,
  ): Partial<AccessToken> {
    return {
      tokenId: row.token_id,
      clientId: row.client_id,
      userEntityRef: row.user_entity_ref,
      scope: row.scope ?? undefined,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      revoked: Boolean(row.revoked),
    };
  }
}
