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

import { ExternalTokenHandler } from './types';

export type LegacyConfigWrapper = {
  legacy: boolean;
  config: Config;
};

type LegacyTokenHandlerContext = {
  key: Uint8Array;

  subject: string;
};

type LegacyTokenHandlerOverloaded =
  ExternalTokenHandler<LegacyTokenHandlerContext> & {
    initialize(ctx: {
      options: Config;
      legacy: true;
    }): LegacyTokenHandlerContext;
  };

export const legacyTokenHandler: LegacyTokenHandlerOverloaded = {
  type: 'legacy',
  initialize(ctx: {
    options: Config;
    legacy?: true;
  }): LegacyTokenHandlerContext {
    const secret = ctx.options.getString('secret');
    const subject = ctx.legacy
      ? 'external:backstage-plugin'
      : ctx.options.getString('subject');

    if (!secret.match(/^\S+$/)) {
      throw new Error('Illegal secret, must be a valid base64 string');
    } else if (!subject.match(/^\S+$/)) {
      throw new Error('Illegal subject, must be a set of non-space characters');
    }

    try {
      return {
        key: base64url.decode(secret),
        subject,
      };
    } catch {
      throw new Error('Illegal secret, must be a valid base64 string');
    }
  },

  async verifyToken(token: string, context: LegacyTokenHandlerContext) {
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

    try {
      await jwtVerify(token, context.key);
      return {
        subject: context.subject,
      };
    } catch (error) {
      if (error.code !== 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        throw error;
      }
    }

    // None of the signing keys matched
    return undefined;
  },
};
