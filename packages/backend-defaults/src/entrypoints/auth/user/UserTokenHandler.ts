/*
 * Copyright 2020 The Backstage Authors
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

import { DiscoveryService, LoggerService } from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { tokenTypes } from '@backstage/plugin-auth-node';
import {
  base64url,
  decodeJwt,
  decodeProtectedHeader,
  jwtVerify,
  JWTVerifyOptions,
} from 'jose';
import { JwksClient } from '../JwksClient';

/**
 * An identity client to interact with auth-backend and authenticate Backstage
 * tokens
 *
 * @internal
 */
export class UserTokenHandler {
  static create(options: {
    discovery: DiscoveryService;
    logger: LoggerService;
  }): UserTokenHandler {
    const jwksClient = new JwksClient(async () => {
      const url = await options.discovery.getBaseUrl('auth');
      return new URL(`${url}/.well-known/jwks.json`);
    });
    return new UserTokenHandler(jwksClient, options.logger);
  }

  constructor(
    private readonly jwksClient: JwksClient,
    private readonly logger: LoggerService,
  ) {}

  async verifyToken(token: string) {
    const verifyOpts = this.#getTokenVerificationOptions(token);
    if (!verifyOpts) {
      return undefined;
    }

    await this.jwksClient.refreshKeyStore(token);

    // Verify a limited token, ensuring the necessarily claims are present and token type is correct
    const { payload } = await jwtVerify(
      token,
      this.jwksClient.getKey,
      verifyOpts,
    ).catch(e => {
      this.logger.warn('Failed to verify incoming user token', e);
      throw new AuthenticationError('Failed user token verification');
    });

    const userEntityRef = payload.sub;

    if (!userEntityRef) {
      throw new AuthenticationError('No user sub found in token');
    }

    return { userEntityRef };
  }

  #getTokenVerificationOptions(token: string): JWTVerifyOptions | undefined {
    try {
      const { typ } = decodeProtectedHeader(token);

      if (typ === tokenTypes.user.typParam) {
        return {
          requiredClaims: ['iat', 'exp', 'sub'],
          typ: tokenTypes.user.typParam,
        };
      }

      if (typ === tokenTypes.limitedUser.typParam) {
        return {
          requiredClaims: ['iat', 'exp', 'sub'],
          typ: tokenTypes.limitedUser.typParam,
        };
      }

      const { aud } = decodeJwt(token);
      if (aud === tokenTypes.user.audClaim) {
        return {
          audience: tokenTypes.user.audClaim,
        };
      }
    } catch {
      /* ignore */
    }

    return undefined;
  }

  createLimitedUserToken(backstageToken: string) {
    const [headerRaw, payloadRaw] = backstageToken.split('.');
    const header = JSON.parse(
      new TextDecoder().decode(base64url.decode(headerRaw)),
    );
    const payload = JSON.parse(
      new TextDecoder().decode(base64url.decode(payloadRaw)),
    );

    const tokenType = header.typ;

    // Only new user tokens can be used to create a limited user token. If we
    // can't create a limited token, or the token is already a limited one, we
    // return the original token
    if (!tokenType || tokenType === tokenTypes.limitedUser.typParam) {
      return { token: backstageToken, expiresAt: new Date(payload.exp * 1000) };
    }

    if (tokenType !== tokenTypes.user.typParam) {
      throw new AuthenticationError(
        'Failed to create limited user token, invalid token type',
      );
    }

    // NOTE: The order and properties in both the header and payload must match
    //       the usage in plugins/auth-backend/src/identity/TokenFactory.ts
    const limitedUserToken = [
      base64url.encode(
        JSON.stringify({
          typ: tokenTypes.limitedUser.typParam,
          alg: header.alg,
          kid: header.kid,
        }),
      ),
      base64url.encode(
        JSON.stringify({
          sub: payload.sub,
          iat: payload.iat,
          exp: payload.exp,
        }),
      ),
      payload.uip,
    ].join('.');

    return { token: limitedUserToken, expiresAt: new Date(payload.exp * 1000) };
  }

  isLimitedUserToken(token: string): boolean {
    try {
      const { typ } = decodeProtectedHeader(token);
      return typ === tokenTypes.limitedUser.typParam;
    } catch {
      return false;
    }
  }
}
