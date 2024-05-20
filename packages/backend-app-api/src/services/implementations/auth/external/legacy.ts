/*
 * Copyright 2024 The Backstage Authors
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

import { Config } from '@backstage/config';
import { base64url, decodeJwt, decodeProtectedHeader, jwtVerify } from 'jose';
import { readAccessRestrictionsFromConfig } from './helpers';
import { AccessRestriptionsMap, TokenHandler } from './types';

/**
 * Handles `type: legacy` access.
 *
 * @internal
 */
export class LegacyTokenHandler implements TokenHandler {
  #entries = new Array<{
    key: Uint8Array;
    result: {
      subject: string;
      allAccessRestrictions?: AccessRestriptionsMap;
    };
  }>();

  add(config: Config) {
    const allAccessRestrictions = readAccessRestrictionsFromConfig(config);
    this.#doAdd(
      config.getString('options.secret'),
      config.getString('options.subject'),
      allAccessRestrictions,
    );
  }

  // used only for the old backend.auth.keys array
  addOld(config: Config) {
    // This choice of subject is for compatibility reasons
    this.#doAdd(config.getString('secret'), 'external:backstage-plugin');
  }

  #doAdd(
    secret: string,
    subject: string,
    allAccessRestrictions?: AccessRestriptionsMap,
  ) {
    if (!secret.match(/^\S+$/)) {
      throw new Error('Illegal secret, must be a valid base64 string');
    } else if (!subject.match(/^\S+$/)) {
      throw new Error('Illegal subject, must be a set of non-space characters');
    }

    let key: Uint8Array;
    try {
      key = base64url.decode(secret);
    } catch {
      throw new Error('Illegal secret, must be a valid base64 string');
    }

    this.#entries.push({
      key,
      result: {
        subject,
        allAccessRestrictions,
      },
    });
  }

  async verifyToken(token: string) {
    // First do a duck typing check to see if it remotely looks like a legacy token
    try {
      // We do a fair amount of checking upfront here. Since we aren't certain
      // that it's even the right type of key that we're looking at, we can't
      // defer eg the alg check to jwtVerify, because it won't be possible to
      // discern different reasons for key verification failures from each other
      // easily
      const { alg } = decodeProtectedHeader(token);
      if (alg !== 'HS256') {
        return undefined;
      }
      const { sub, aud } = decodeJwt(token);
      if (sub !== 'backstage-server' || aud) {
        return undefined;
      }
    } catch (e) {
      // Doesn't look like a jwt at all
      return undefined;
    }

    for (const { key, result } of this.#entries) {
      try {
        await jwtVerify(token, key);
        return result;
      } catch (e) {
        if (e.code !== 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
          throw e;
        }
        // Otherwise continue to try the next key
      }
    }

    // None of the signing keys matched
    return undefined;
  }
}
