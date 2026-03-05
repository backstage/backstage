/*
 * Copyright 2023 The Backstage Authors
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
import { decodeJwt } from 'jose';

type Claims = { aud: string; scp: string };

export class FakeMicrosoftAPI {
  generateAccessToken(scope: string): string {
    return this.tokenWithClaims(this.allClaimsForScope(scope)).access_token;
  }

  generateAuthCode(scope: string): string {
    return this.encodeClaims(this.allClaimsForScope(scope));
  }

  generateRefreshToken(scope: string): string {
    return this.encodeClaims(this.allClaimsForScope(scope));
  }

  token(formData: URLSearchParams): {
    access_token: string;
    scope: string;
    refresh_token?: string;
    id_token?: string;
  } {
    const scopeParameter = formData.get('scope');
    const claims =
      (scopeParameter && this.allClaimsForScope(scopeParameter)) ??
      formData.get('grant_type') === 'refresh_token'
        ? this.decodeClaims(formData.get('refresh_token')!)
        : this.decodeClaims(formData.get('code')!);
    return {
      ...this.tokenWithClaims(claims),
      ...(this.hasScope(claims, 'offline_access') && {
        refresh_token: this.encodeClaims(claims),
      }),
      ...(this.hasScope(claims, 'openid') && {
        id_token: 'header.e30K.microsoft',
      }),
    };
  }

  tokenHasScope(token: string, scope: string): boolean {
    const { aud, scp } = decodeJwt(token);
    return this.hasScope({ aud: aud as string, scp: scp as string }, scope);
  }

  private tokenWithClaims(claims: Claims): {
    access_token: string;
    scope: string;
  } {
    const filteredClaims = {
      ...claims,
      scp: claims.scp
        .split(' ')
        .filter(s => s !== 'offline_access')
        .join(' '),
    };
    return {
      access_token: `header.${Buffer.from(
        JSON.stringify(filteredClaims),
      ).toString('base64')}.signature`,
      scope: this.scopeFromClaims(filteredClaims),
    };
  }

  private allClaimsForScope(scope: string): Claims {
    const scopes = scope.split(' ').map(this.parseScope);
    const firstAudience = scopes
      .map(({ aud }) => aud)
      .find(aud => aud !== 'openid');
    return {
      aud: firstAudience ?? '00000003-0000-0000-c000-000000000000',
      scp: scopes
        .filter(({ aud }) => aud === 'openid' || aud === firstAudience)
        .map(({ scp }) => scp)
        .join(' '),
    };
  }

  // auth codes and refresh tokens in this fake system are base64-encoded JSON
  // strings of claims
  private encodeClaims(claims: Claims): string {
    return Buffer.from(JSON.stringify(claims)).toString('base64');
  }

  private decodeClaims(encoded: string): Claims {
    return JSON.parse(Buffer.from(encoded, 'base64').toString());
  }

  private hasScope(claims: Claims, scope: string): boolean {
    return this.scopeFromClaims(claims).includes(scope);
  }

  private parseScope(s: string): Claims {
    if (s.includes('/')) {
      const [aud, scp] = s.split('/');
      return { aud, scp };
    }
    switch (s) {
      case 'email':
      case 'openid':
      case 'offline_access':
      case 'profile': {
        return { aud: 'openid', scp: s };
      }
      default:
        return { aud: '00000003-0000-0000-c000-000000000000', scp: s };
    }
  }

  private scopeFromClaims(claims: Claims): string {
    return claims.scp
      .split(' ')
      .map(this.parseScope)
      .map(({ aud, scp }) =>
        aud === 'openid' ||
        claims.aud === '00000003-0000-0000-c000-000000000000'
          ? scp
          : `${claims.aud}/${scp}`,
      )
      .join(' ');
  }
}
