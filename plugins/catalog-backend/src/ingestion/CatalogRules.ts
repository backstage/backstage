/*
 * Copyright 2020 Spotify AB
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
import { LocationSpec, Entity } from '@backstage/catalog-model';

/**
 * A structure for matching entities to a given rule.
 */
type EntityMatcher = {
  kind: string;
};

/**
 * A structure for matching locations to a given rule.
 */
type LocationMatcher = {
  target?: string;
  type: string;
};

/**
 * Rules to apply to catalog entities
 *
 * An undefined list of matchers means match all, an empty list of matchers means match none
 */
type CatalogRule = {
  deny?: EntityMatcher[];
  allow?: EntityMatcher[];
  locations?: LocationMatcher[];
};

export class CatalogRulesEnforcer {
  /**
   * Default rules used by the catalog.
   *
   * Denies any location from specifying user or group entities.
   */
  static readonly defaultRules: CatalogRule[] = [
    {
      deny: [{ kind: 'User' }, { kind: 'Group' }],
      allow: [],
    },
  ];

  /**
   * Loads catalog rules from config.
   *
   * This reads `catalog.rules` and defaults to the default rules if no value is present.
   * The value of the config should be a list of config objects, each with a single `deny`
   * field which in turn is a list of entity kind to deny.
   *
   * It also reads in rules from `catalog.locations`, where each location can have a list
   * of allowed entity for the location, specified in an `allow` field.
   *
   * For example:
   *
   * ```yaml
   * catalog:
   *   rules:
   *   - deny: [User, Group, System]
   *
   *   locations:
   *   - type: github
   *     target: https://github.com/org/repo/blob/master/users.yaml
   *     allow: [User, Group]
   *   - type: github
   *     target: https://github.com/org/repo/blob/master/systems.yaml
   *     allow: [System]
   * ```
   */
  static fromConfig(config: Config) {
    const rules = new Array<CatalogRule>();

    if (config.has('catalog.rules')) {
      const globalRules = config.getConfigArray('catalog.rules').map(sub => ({
        deny: sub.getStringArray('deny').map(kind => ({ kind })),
        allow: [],
      }));
      rules.push(...globalRules);
    } else {
      rules.push(...CatalogRulesEnforcer.defaultRules);
    }

    if (config.has('catalog.locations')) {
      const locationRules = config
        .getConfigArray('catalog.locations')
        .flatMap(sub => {
          if (!sub.has('allow')) {
            return [];
          }

          return [
            {
              deny: [],
              allow: sub.getStringArray('allow').map(kind => ({ kind })),
              locations: [
                {
                  type: sub.getString('type'),
                  target: sub.getString('target'),
                },
              ],
            },
          ];
        });

      rules.push(...locationRules);
    }

    return new CatalogRulesEnforcer(rules);
  }

  constructor(private readonly rules: CatalogRule[]) {}

  /**
   * Checks wether a specific entity/location combination is allowed
   * according to the configured rules.
   */
  isAllowed(entity: Entity, location: LocationSpec) {
    let result = true;

    for (const rule of this.rules) {
      if (!this.matchLocation(location, rule.locations)) {
        continue;
      }

      if (this.matchEntity(entity, rule.allow)) {
        result = true;
      }
      if (this.matchEntity(entity, rule.deny)) {
        result = false;
      }
    }

    return result;
  }

  private matchLocation(
    location: LocationSpec,
    matchers?: LocationMatcher[],
  ): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (matcher.type !== location.type) {
        continue;
      }
      if (matcher.target && matcher.target !== location.target) {
        continue;
      }
      return true;
    }

    return false;
  }

  private matchEntity(entity: Entity, matchers?: EntityMatcher[]): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (entity.kind.toLowerCase() !== matcher.kind.toLowerCase()) {
        continue;
      }

      return true;
    }

    return false;
  }
}
