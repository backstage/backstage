/*
 * Copyright 2026 The Backstage Authors
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

import type { ActionsServiceAction } from '@backstage/backend-plugin-api/alpha';
import type { RootConfigService } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import { Minimatch } from 'minimatch';

interface ActionFilterTarget {
  id: string;
  attributes: ActionsServiceAction['attributes'];
}

const ACTION_ATTRIBUTE_KEYS = [
  'destructive',
  'readOnly',
  'idempotent',
] as const;

interface ActionFilterRule {
  idMatcher?: Minimatch;
  attributes?: Partial<Record<(typeof ACTION_ATTRIBUTE_KEYS)[number], boolean>>;
}

function parseFilterRules(configArray: Array<Config>): Array<ActionFilterRule> {
  return configArray.map(ruleConfig => {
    const idPattern = ruleConfig.getOptionalString('id');
    const attributesConfig = ruleConfig.getOptionalConfig('attributes');
    const rule: ActionFilterRule = {};

    if (idPattern) {
      rule.idMatcher = new Minimatch(idPattern);
    }

    if (attributesConfig) {
      rule.attributes = {};
      for (const key of ACTION_ATTRIBUTE_KEYS) {
        const value = attributesConfig.getOptionalBoolean(key);
        if (value !== undefined) {
          rule.attributes[key] = value;
        }
      }
    }

    return rule;
  });
}

function matchesRule(
  action: ActionFilterTarget,
  rule: ActionFilterRule,
): boolean {
  if (rule.idMatcher && !rule.idMatcher.match(action.id)) {
    return false;
  }

  if (rule.attributes) {
    for (const key of ACTION_ATTRIBUTE_KEYS) {
      const value = rule.attributes[key];
      if (value !== undefined && action.attributes[key] !== value) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Applies the configured action include and exclude rules.
 *
 * @param config - Root configuration containing the action filters
 * @param actions - Actions with resolved attributes to filter
 * @returns The actions permitted by the configured filters
 *
 * @remarks
 * Exclude rules take precedence. Without include rules, every action that is
 * not excluded is permitted.
 */
export function filterActions<TAction extends ActionFilterTarget>(
  config: RootConfigService,
  actions: Array<TAction>,
): Array<TAction> {
  const filterConfig = config.getOptionalConfig('backend.actions.filter');

  if (!filterConfig) {
    return actions;
  }

  const includeRules = parseFilterRules(
    filterConfig.getOptionalConfigArray('include') ?? [],
  );
  const excludeRules = parseFilterRules(
    filterConfig.getOptionalConfigArray('exclude') ?? [],
  );

  return actions.filter(action => {
    if (excludeRules.some(rule => matchesRule(action, rule))) {
      return false;
    }

    if (includeRules.length === 0) {
      return true;
    }

    return includeRules.some(rule => matchesRule(action, rule));
  });
}
