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
import {
  createExternalTokenHandler,
  readAccessRestrictionsFromConfig,
  readStringOrStringArrayFromConfig,
} from './helpers';
import { AccessRestrictionsMap } from './types';
import { Config } from '@backstage/config';

/**
 * Reads the `subjectPattern` option, which can be a single regular expression
 * or a list of them. Unlike the other options, patterns are not split on
 * commas or spaces since those are meaningful in regular expressions. Each
 * pattern is anchored so that it must match the entire `sub` claim.
 */
function readSubjectPatternsFromConfig(options: Config): RegExp[] | undefined {
  if (!options.has('subjectPattern')) {
    return undefined;
  }

  const rawPatterns = Array.isArray(options.get('subjectPattern'))
    ? options.getStringArray('subjectPattern')
    : [options.getString('subjectPattern')];

  if (!rawPatterns.length || rawPatterns.some(p => !p)) {
    throw new Error('Illegal subjectPattern, must be a non-empty string');
  }

  return rawPatterns.map(pattern => {
    try {
      // Compile the pattern on its own before wrapping it. Otherwise an
      // unbalanced pattern such as `a)|(?:b` would close the wrapping group
      // early and produce a valid but only partially anchored expression.
      const compiled = new RegExp(pattern);
      return new RegExp(`^(?:${compiled.source})$`);
    } catch (error) {
      throw new Error(
        `Illegal subjectPattern '${pattern}', must be a valid regular expression: ${error}`,
      );
    }
  });
}

type JWKSTokenContext = {
  algorithms?: string[];
  audiences?: string[];
  issuers?: string[];
  subjectPatterns?: RegExp[];
  subjectPrefix?: string;
  url: URL;
  jwks: JWTVerifyGetKey;
  allAccessRestrictions?: AccessRestrictionsMap;
};

export const jwksTokenHandler = createExternalTokenHandler<JWKSTokenContext>({
  type: 'jwks',
  initialize({ options }): JWKSTokenContext {
    if (!options.getString('url').match(/^\S+$/)) {
      throw new Error(
        'Illegal JWKS URL, must be a set of non-space characters',
      );
    }

    const algorithms = readStringOrStringArrayFromConfig(options, 'algorithm');
    const issuers = readStringOrStringArrayFromConfig(options, 'issuer');
    const audiences = readStringOrStringArrayFromConfig(options, 'audience');
    const subjectPatterns = readSubjectPatternsFromConfig(options);
    const subjectPrefix = options.getOptionalString('subjectPrefix');
    const url = new URL(options.getString('url'));
    const jwks = createRemoteJWKSet(url);
    const allAccessRestrictions = readAccessRestrictionsFromConfig(options);
    return {
      algorithms,
      audiences,
      issuers,
      jwks,
      subjectPatterns,
      subjectPrefix,
      url,
      allAccessRestrictions,
    };
  },

  async verifyToken(token: string, context: JWKSTokenContext) {
    try {
      const {
        payload: { sub },
      } = await jwtVerify(token, context.jwks, {
        algorithms: context.algorithms,
        issuer: context.issuers,
        audience: context.audiences,
      });

      if (
        context.subjectPatterns &&
        !context.subjectPatterns.some(pattern => sub && pattern.test(sub))
      ) {
        return undefined;
      }

      if (sub) {
        const prefix = context.subjectPrefix
          ? `external:${context.subjectPrefix}:`
          : 'external:';
        return {
          subject: `${prefix}${sub}`,
        };
      }
    } catch {
      return undefined;
    }
    return undefined;
  },
});
