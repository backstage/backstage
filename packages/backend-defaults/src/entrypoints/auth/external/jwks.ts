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

import {
  evaluateFilterPredicate,
  FilterPredicate,
  readOptionalFilterPredicateFromConfig,
} from '@backstage/filter-predicates';
import {
  jwtVerify,
  createRemoteJWKSet,
  JWTPayload,
  JWTVerifyGetKey,
} from 'jose';
import {
  createExternalTokenHandler,
  readAccessRestrictionsFromConfig,
  readStringOrStringArrayFromConfig,
} from './helpers';
import { AccessRestrictionsMap } from './types';

type JWKSTokenContext = {
  algorithms?: string[];
  audiences?: string[];
  issuers?: string[];
  subjectPrefix?: string;
  url: URL;
  jwks: JWTVerifyGetKey;
  allAccessRestrictions?: AccessRestrictionsMap;
  claims?: FilterPredicate;
};

// Prepares a verified JWT payload for evaluation against the `claims` filter
// predicate.
//
// `scope` is the only claim the OAuth2/JWT RFCs (RFC 6749 §3.3, RFC 8693 §4.2,
// RFC 9068 §2.2.3) define as a space-delimited string, so it is split into an
// array to allow matching individual scopes using `$contains`.
const toClaimsFilterValue = (payload: JWTPayload): JWTPayload => {
  const { scope } = payload;
  if (typeof scope !== 'string') {
    return payload;
  }
  return { ...payload, scope: scope.split(' ').filter(Boolean) };
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
    const subjectPrefix = options.getOptionalString('subjectPrefix');
    const url = new URL(options.getString('url'));
    const jwks = createRemoteJWKSet(url);
    const allAccessRestrictions = readAccessRestrictionsFromConfig(options);

    const claims = readOptionalFilterPredicateFromConfig(options, {
      key: 'claims',
    });

    return {
      algorithms,
      audiences,
      issuers,
      jwks,
      subjectPrefix,
      url,
      allAccessRestrictions,
      claims,
    };
  },

  async verifyToken(token: string, context: JWKSTokenContext) {
    try {
      const { payload } = await jwtVerify(token, context.jwks, {
        algorithms: context.algorithms,
        issuer: context.issuers,
        audience: context.audiences,
      });

      const { sub } = payload;
      if (sub) {
        if (
          context.claims &&
          !evaluateFilterPredicate(context.claims, toClaimsFilterValue(payload))
        ) {
          return undefined;
        }

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
