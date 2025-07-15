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
import { AuthService } from '@backstage/backend-plugin-api';
import { TokenIssuer } from '../identity/types';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { InputError } from '@backstage/errors';
import { decodeJwt } from 'jose';

export class OidcService {
  private constructor(
    private readonly auth: AuthService,
    private readonly tokenIssuer: TokenIssuer,
    private readonly baseUrl: string,
    private readonly userInfo: UserInfoDatabase,
  ) {}

  static create(options: {
    auth: AuthService;
    tokenIssuer: TokenIssuer;
    baseUrl: string;
    userInfo: UserInfoDatabase;
  }) {
    return new OidcService(
      options.auth,
      options.tokenIssuer,
      options.baseUrl,
      options.userInfo,
    );
  }

  public getConfiguration() {
    return {
      issuer: this.baseUrl,
      token_endpoint: `${this.baseUrl}/v1/token`,
      userinfo_endpoint: `${this.baseUrl}/v1/userinfo`,
      jwks_uri: `${this.baseUrl}/.well-known/jwks.json`,
      response_types_supported: ['id_token'],
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
      token_endpoint_auth_methods_supported: [],
      claims_supported: ['sub', 'ent'],
      grant_types_supported: [],
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
}
