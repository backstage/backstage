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

import { jwtVerify, createRemoteJWKSet } from 'jose';
import { Config } from '@backstage/config';
import { TokenHandler } from './types';

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
  }> = [];

  add(options: Config) {
    const algorithms = options.getOptionalStringArray('algorithms');
    const issuers = options.getOptionalStringArray('issuers');
    const audiences = options.getOptionalStringArray('audiences');
    const subjectPrefix = options.getOptionalString('subjectPrefix');
    const url = new URL(options.getString('url'));

    if (!options.getString('url').match(/^\S+$/)) {
      throw new Error('Illegal URL, must be a set of non-space characters');
    }

    this.#entries.push({ algorithms, audiences, issuers, subjectPrefix, url });
  }

  async verifyToken(token: string) {
    for (const entry of this.#entries) {
      try {
        const jwks = createRemoteJWKSet(entry.url);
        const {
          payload: { sub },
        } = await jwtVerify(token, jwks, {
          algorithms: entry.algorithms,
          issuer: entry.issuers,
          audience: entry.audiences,
        });

        if (sub) {
          if (entry.subjectPrefix) {
            return { subject: `external:${entry.subjectPrefix}:${sub}` };
          }

          return { subject: `external:${sub}` };
        }
      } catch {
        continue;
      }
    }
    return undefined;
  }
}
