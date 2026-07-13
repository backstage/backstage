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

type JWKSTokenContext = {
  algorithms?: string[];
  audiences?: string[];
  issuers?: string[];
  subjectPrefix?: string;
  url: URL;
  jwks: JWTVerifyGetKey;
  allAccessRestrictions?: AccessRestrictionsMap;
  claims: Array<{ claim: string; anyOf: string[] }>;
};

// Normalizes a configured `claims` value into a deduped list of allowed
// string values. Each string/number/boolean is one exact allowed value; use
// an array for multiple. Works off an already-extracted raw value rather
// than a `Config` key lookup (see the call site in `initialize`).
const readClaimAllowedValues = (value: unknown): string[] | undefined => {
  const rawValues = Array.isArray(value) ? value : [value];

  const values: string[] = [];
  for (const rawValue of rawValues) {
    if (typeof rawValue === 'string') {
      if (rawValue.length === 0) {
        return undefined;
      }
      values.push(rawValue);
      continue;
    }

    if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
      values.push(String(rawValue));
      continue;
    }

    return undefined;
  }

  const deduped = [...new Set(values)];
  return deduped.length ? deduped : undefined;
};

// Normalizes a verified JWT claim value into the set of values it satisfies:
// the value itself, plus - for a space-delimited string (e.g. OAuth `scope`)
// or an array - each of its entries, all by their string form.
const claimValues = (claimValue: unknown): Set<string> => {
  let values: unknown[];
  if (Array.isArray(claimValue)) {
    values = claimValue;
  } else if (typeof claimValue === 'string') {
    values = [claimValue, ...claimValue.split(' ')];
  } else {
    values = [claimValue];
  }

  return new Set(
    values
      .filter(
        value =>
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean',
      )
      .map(String),
  );
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

    // Claim names are arbitrary strings and commonly namespaced with dots or
    // slashes (e.g. `example.com/team` or an Auth0-style
    // `https://example.com/claim`). They therefore can't be looked up via
    // `Config.get(key)`, which always splits `key` on `.` as a path and rejects
    // `/`. Reading the whole `claims` block once as a raw value (a no-argument
    // `.get()` skips path splitting) and iterating it with plain property
    // access avoids that.
    const claimsConfig = options.getOptionalConfig('claims');
    const claims = claimsConfig
      ? Object.entries(claimsConfig.get<Record<string, unknown>>()).map(
          ([claim, value]) => {
            const anyOf = readClaimAllowedValues(value);
            if (!anyOf) {
              throw new Error(
                `Invalid value for 'claims.${claim}' in JWKS external access config, expected a non-empty string, number, boolean, or array of those`,
              );
            }

            return { claim, anyOf };
          },
        )
      : [];

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
        const allClaimsMatch = context.claims.every(({ claim, anyOf }) => {
          const actual = claimValues(payload[claim]);
          return anyOf.some(required => actual.has(required));
        });
        if (!allClaimsMatch) {
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
