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

import { jwtVerify, createRemoteJWKSet, JWTVerifyGetKey } from 'jose';
import { Config } from '@backstage/config';
import {
  readAccessRestrictionsFromConfig,
  readStringOrStringArrayFromConfig,
} from './helpers';
import { AccessRestriptionsMap, TokenHandler } from './types';

/**
 * Handles `type: jwks` access.
 *
 * @internal
 */
export class JWKSHandler implements TokenHandler {
  #entries: Array<{
    algorithms?: string[];
    audiences?: string[];
    issuers?: string[];
    subjectPrefix?: string;
    url: URL;
    jwks: JWTVerifyGetKey;
    allAccessRestrictions?: AccessRestriptionsMap;
  }> = [];

  add(config: Config) {
    if (!config.getString('options.url').match(/^\S+$/)) {
      throw new Error(
        'Illegal JWKS URL, must be a set of non-space characters',
      );
    }

    const algorithms = readStringOrStringArrayFromConfig(
      config,
      'options.algorithm',
    );
    const issuers = readStringOrStringArrayFromConfig(config, 'options.issuer');
    const audiences = readStringOrStringArrayFromConfig(
      config,
      'options.audience',
    );
    const subjectPrefix = config.getOptionalString('options.subjectPrefix');
    const url = new URL(config.getString('options.url'));
    const jwks = createRemoteJWKSet(url);
    const allAccessRestrictions = readAccessRestrictionsFromConfig(config);

    this.#entries.push({
      algorithms,
      audiences,
      issuers,
      jwks,
      subjectPrefix,
      url,
      allAccessRestrictions,
    });
  }

  async verifyToken(token: string) {
    for (const entry of this.#entries) {
      try {
        const {
          payload: { sub },
        } = await jwtVerify(token, entry.jwks, {
          algorithms: entry.algorithms,
          issuer: entry.issuers,
          audience: entry.audiences,
        });

        if (sub) {
          const prefix = entry.subjectPrefix
            ? `external:${entry.subjectPrefix}:`
            : 'external:';
          return {
            subject: `${prefix}${sub}`,
            allAccessRestrictions: entry.allAccessRestrictions,
          };
        }
      } catch {
        continue;
      }
    }
    return undefined;
  }
}
