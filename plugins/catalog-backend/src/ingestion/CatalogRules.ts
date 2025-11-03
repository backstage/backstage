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
import path from 'path';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { minimatch } from 'minimatch';
import { z } from 'zod';

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
          const exact = resolveTarget(type, locConf.getString('target'));

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

    for (const matcher of matchers) {
      if (matcher.type !== location?.type) {
        continue;
      }
      if (matcher.exact && matcher.exact !== location?.target) {
        continue;
      }
      if (
        matcher.pattern &&
        !minimatch(location?.target, matcher.pattern, {
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
