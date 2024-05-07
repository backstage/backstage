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
import { readAccessRestrictionsFromConfig } from './helpers';
import { AccessRestriptionsMap, TokenHandler } from './types';

const MIN_TOKEN_LENGTH = 8;

/**
 * Handles `type: static` access.
 *
 * @internal
 */
export class StaticTokenHandler implements TokenHandler {
  #entries = new Array<{
    token: string;
    subject: string;
    accessRestrictions?: AccessRestriptionsMap;
  }>();

  add(config: Config) {
    const token = config.getString('options.token');
    if (!token.match(/^\S+$/)) {
      throw new Error('Illegal token, must be a set of non-space characters');
    }
    if (token.length < MIN_TOKEN_LENGTH) {
      throw new Error(
        `Illegal token, must be at least ${MIN_TOKEN_LENGTH} characters length`,
      );
    }

    const subject = config.getString('options.subject');
    if (!subject.match(/^\S+$/)) {
      throw new Error('Illegal subject, must be a set of non-space characters');
    }

    const accessRestrictions = readAccessRestrictionsFromConfig(config);

    this.#entries.push({
      token,
      subject,
      accessRestrictions,
    });
  }

  async verifyToken(token: string) {
    const entry = this.#entries.find(e => e.token === token);
    if (!entry) {
      return undefined;
    }

    return {
      subject: entry.subject,
      accessRestrictions: entry.accessRestrictions,
    };
  }
}
