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

import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import path from 'node:path';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { minimatch } from 'minimatch';
import { z } from 'zod/v3';

/**
 * Rules to apply to catalog entities.
 *
 * An undefined list of matchers means match all, an empty list of matchers means match none.
 */
export type CatalogRule = {
  allow: CatalogRuleAllow[];
  locations?: Array<{
    exact?: string;
    type: string;
    pattern?: string;
  }>;
};

type CatalogRuleAllow = {
  kind: string;
  'spec.type'?: string;
};

/**
 * Decides whether an entity from a given location is allowed to enter the
 * catalog, according to some rule set.
 */
export type CatalogRulesEnforcer = {
  isAllowed(entity: Entity, location: LocationSpec): boolean;
};

const allowRuleParser = z.array(
  z
    .object({
      kind: z.string(),
      'spec.type': z.string().optional(),
    })
    .or(z.string())
    .transform(val => (typeof val === 'string' ? { kind: val } : val)),
);

/**
 * Implements the default catalog rule set, consuming the config keys
 * `catalog.rules` and `catalog.locations.[].rules`.
 */
export class DefaultCatalogRulesEnforcer implements CatalogRulesEnforcer {
  /**
   * Default rules used by the catalog.
   *
   * Denies any location from specifying user or group entities.
   */
  static readonly defaultRules: CatalogRule[] = [
    {
      allow: ['Component', 'API', 'Location'].map(kind => ({ kind })),
    },
  ];

  /**
   * Loads catalog rules from config.
   *
   * This reads `catalog.rules` and defaults to the default rules if no value is present.
   * The value of the config should be a list of config objects, each with a single `allow`
   * field which in turn is a list of entity kinds to allow.
   *
   * If there is no matching rule to allow an ingested entity, it will be rejected by the catalog.
   *
   * It also reads in rules from `catalog.locations`, where each location can have a list
   * of rules for that specific location, specified in a `rules` field.
   *
   * For example:
   *
   * ```yaml
   * catalog:
   *   rules:
   *   - allow: [Component, API]
   *   - allow:
   *     - kind: Resource
   *       'spec.type': database
   *   - allow: [Template]
   *     locations:
   *       - type: url
   *         pattern: https://github.com/org/*\/blob/master/template.yaml
   *   - allow: [Location]
   *     locations:
   *       - type: url
   *         pattern: https://github.com/org/repo/blob/master/location.yaml
   *
   *   locations:
   *   - type: url
   *     target: https://github.com/org/repo/blob/master/users.yaml
   *     rules:
   *       - allow: [User, Group]
   *   - type: url
   *     target: https://github.com/org/repo/blob/master/systems.yaml
   *     rules:
   *       - allow: [System]
   * ```
   */
  static fromConfig(config: Config) {
    const rules = new Array<CatalogRule>();

    if (config.has('catalog.rules')) {
      const globalRules = config
        .getConfigArray('catalog.rules')
        .map(ruleConf => ({
          allow: allowRuleParser.parse(ruleConf.get('allow')),
          locations: ruleConf
            .getOptionalConfigArray('locations')
            ?.map(locationConfig => {
              const location = {
                pattern: locationConfig.getOptionalString('pattern'),
                type: locationConfig.getString('type'),
                exact: locationConfig.getOptionalString('exact'),
              };
              if (location.pattern && location.exact) {
                throw new Error(
                  'A catalog rule location cannot have both exact and pattern values',
                );
              }
              if (location.type === 'url' && location.exact) {
                // Match against the canonical form so that exact URL matching
                // compares the same form as the incoming location targets
                location.exact =
                  canonicalUrlTarget(location.exact) ?? location.exact;
              }
              return location;
            }),
        }));
      rules.push(...globalRules);
    } else {
      rules.push(...DefaultCatalogRulesEnforcer.defaultRules);
    }

    if (config.has('catalog.locations')) {
      const locationRules = config
        .getConfigArray('catalog.locations')
        .flatMap(locConf => {
          if (!locConf.has('rules')) {
            return [];
          }
          const type = locConf.getString('type');
          const exact = canonicalTarget(type, locConf.getString('target'));

          return locConf.getConfigArray('rules').map(ruleConf => ({
            allow: ruleConf.getStringArray('allow').map(kind => ({ kind })),
            locations: [{ type, exact }],
          }));
        });

      rules.push(...locationRules);
    }

    return new DefaultCatalogRulesEnforcer(rules);
  }

  private readonly rules: CatalogRule[];

  constructor(rules: CatalogRule[]) {
    this.rules = rules;
  }

  /**
   * Checks whether a specific entity/location combination is allowed
   * according to the configured rules.
   *
   * URL targets are matched in a canonical form derived from the same URL
   * resolution that URL readers use when they fetch the target, with
   * remaining percent-encodings decoded. This ensures that a URL can't be
   * crafted to look like it belongs to one location scope for rule matching
   * purposes, while being resolved to a different scope when its content is
   * fetched.
   */
  isAllowed(entity: Entity, location: LocationSpec) {
    for (const rule of this.rules) {
      if (!this.matchLocation(location, rule.locations)) {
        continue;
      }

      if (this.matchEntity(entity, rule.allow)) {
        return true;
      }
    }

    return false;
  }

  private matchLocation(
    location: LocationSpec,
    matchers?: { exact?: string; type: string; pattern?: string }[],
  ): boolean {
    if (!matchers) {
      return true;
    }

    let target = location?.target;
    if (location?.type === 'url' && typeof target === 'string') {
      const canonical = canonicalUrlTarget(target);
      if (canonical === undefined) {
        // An unparseable URL never matches a URL location matcher
        return false;
      }
      target = canonical;
    }

    for (const matcher of matchers) {
      if (matcher.type !== location?.type) {
        continue;
      }
      if (matcher.exact && matcher.exact !== target) {
        continue;
      }
      if (
        matcher.pattern &&
        !minimatch(target, matcher.pattern, {
          nocase: true,
          dot: true,
        })
      ) {
        continue;
      }
      return true;
    }

    return false;
  }

  private matchEntity(entity: Entity, matchers?: CatalogRuleAllow[]): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (
        entity.kind?.toLocaleLowerCase('en-US') !==
        matcher.kind.toLocaleLowerCase('en-US')
      ) {
        continue;
      }

      if (matcher['spec.type']) {
        if (typeof entity.spec?.type !== 'string') {
          continue;
        }
        if (
          matcher['spec.type'].toLocaleLowerCase('en-US') !==
          entity.spec.type.toLocaleLowerCase('en-US')
        ) {
          continue;
        }
      }

      return true;
    }

    return false;
  }
}

function resolveTarget(type: string, target: string): string {
  if (type !== 'file') {
    return target;
  }

  return path.resolve(target);
}

function canonicalTarget(type: string, target: string): string {
  const resolved = resolveTarget(type, target);
  if (type !== 'url') {
    return resolved;
  }

  // Use the canonical form so that exact matching compares the same URL
  // form as the incoming location targets. Malformed configured URLs are
  // left as-is; they simply won't match.
  return canonicalUrlTarget(resolved) ?? resolved;
}

/**
 * Canonical form used when matching URL targets against catalog rules. The
 * URL is first resolved, collapsing dot segments — including percent-encoded
 * ones like %2e%2e — the same way URL readers resolve the target when
 * fetching it. The canonical string is then rebuilt from the parsed URL
 * parts, without any userinfo, so no component can splice a forged path
 * into the matched string. Within the path, remaining percent-encoded
 * characters are decoded once so matching sees the same human-readable
 * form that configured patterns are written in, and encoded dot and
 * path-separator characters are materialized so that any dot segment a
 * reader or host could resolve is visible to the matcher as real path
 * structure. These steps only add visible structure to the actual host
 * and path, so they can never make an untrusted target look trusted.
 */
function canonicalUrlTarget(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const canonicalPath = decodePathSegments(parsed.pathname)
      .replace(/%2e/gi, '.')
      .replace(/%2f/gi, '/')
      .replace(/%5c|\\/gi, '/');
    return `${parsed.protocol}//${parsed.host}${canonicalPath}${decodeOrKeep(
      parsed.search,
    )}${decodeOrKeep(parsed.hash)}`;
  } catch {
    return undefined;
  }
}

// Escapes that are not valid UTF-8 are legal URL syntax but fail decodeURI;
// keep the encoded form in that case rather than rejecting the target
function decodeOrKeep(value: string): string {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

// Decode the path one segment at a time, keeping only the segments that fail
// encoded, so that an invalid escape in one segment does not stop the decoding
// — and the traversal materialization that follows — of other segments. The
// split runs on every separator form, literal and encoded, before decoding,
// so an invalid escape cannot keep an encoded separator from splitting its
// segment apart
function decodePathSegments(pathname: string): string {
  return pathname
    .split(/\/|%2f|%5c/i)
    .map(decodeOrKeep)
    .join('/');
}
