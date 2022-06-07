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
import { LocationSpec } from '../api';
import { ScmIntegrations } from '@backstage/integration';

/**
 * Rules to apply to catalog entities.
 *
 * An undefined list of matchers means match all, an empty list of matchers means match none.
 */
export type CatalogRule = {
  allow: Array<{
    kind: string;
  }>;
  locations?: Array<{
    target?: string;
    type: string;
  }>;
};

/**
 * Decides whether an entity from a given location is allowed to enter the
 * catalog, according to some rule set.
 */
export type CatalogRulesEnforcer = {
  isAllowed(entity: Entity, location: LocationSpec): boolean;
};

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
      const globalRules = config.getConfigArray('catalog.rules').map(sub => ({
        allow: sub.getStringArray('allow').map(kind => ({ kind })),
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
          const target = resolveTarget(type, locConf.getString('target'));

          return locConf.getConfigArray('rules').map(ruleConf => ({
            allow: ruleConf.getStringArray('allow').map(kind => ({ kind })),
            locations: [{ type, target }],
          }));
        });

      rules.push(...locationRules);
    }

    if (config.has('catalog.providers')) {
      const providersConf = config.getConfig('catalog.providers');
      const providerList = providersConf.keys();
      providerList.forEach(provider => {
        if (provider === 'gitlab') {
          rules.push(
            ...getGitlabRules(config, providersConf.getConfig(provider)),
          );
        }
      });
    }

    return new DefaultCatalogRulesEnforcer(rules);
  }

  constructor(private readonly rules: CatalogRule[]) {}

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
    matchers?: { target?: string; type: string }[],
  ): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (matcher.type !== location?.type) {
        continue;
      }
      if (matcher.target && matcher.target !== location?.target) {
        continue;
      }
      return true;
    }

    return false;
  }

  private matchEntity(entity: Entity, matchers?: { kind: string }[]): boolean {
    if (!matchers) {
      return true;
    }

    for (const matcher of matchers) {
      if (entity?.kind?.toLowerCase() !== matcher.kind.toLowerCase()) {
        continue;
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

function getGitlabRules(initialConfig: Config, config: Config): CatalogRule[] {
  return config.keys().flatMap(id => {
    const gitlabConf = config.getConfig(id);
    if (!gitlabConf.has('rules')) {
      return [];
    }

    const integrations = ScmIntegrations.fromConfig(initialConfig).gitlab;
    const gitlabHost = gitlabConf.getString('host');
    const integration = integrations.byHost(gitlabHost);
    if (!integration) {
      throw new Error(
        `No gitlab integration found that matches host ${gitlabHost}`,
      );
    }

    const type = `url`;
    const branch = gitlabConf.getOptionalString('branch') ?? 'master';
    const entityFilename =
      gitlabConf.getOptionalString('entityFilename') ?? 'catalog-info.yaml';

    return gitlabConf.getConfigArray('rules').map(ruleConf => {
      const repoName = ruleConf.getString('repository');
      const target = `${integration.config.baseUrl}/${id}/${repoName}/-/blob/${branch}/${entityFilename}`;
      return {
        allow: ruleConf.getStringArray('allow').map(kind => ({ kind })),
        locations: [{ type, target }],
      };
    });
  });
}
