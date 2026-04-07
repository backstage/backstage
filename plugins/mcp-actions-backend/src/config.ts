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

import { Config } from '@backstage/config';
import { Minimatch } from 'minimatch';

export type FilterRule = {
  idMatcher?: Minimatch;
  attributes?: Partial<
    Record<'destructive' | 'readOnly' | 'idempotent', boolean>
  >;
};

export type McpServerConfig = {
  name: string;
  description?: string;
  includeRules: FilterRule[];
  excludeRules: FilterRule[];
};

const SERVER_KEY_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export function parseFilterRules(configArray: Config[]): FilterRule[] {
  return configArray.map(ruleConfig => {
    const idPattern = ruleConfig.getOptionalString('id');
    const attributesConfig = ruleConfig.getOptionalConfig('attributes');

    const rule: FilterRule = {};

    if (idPattern) {
      rule.idMatcher = new Minimatch(idPattern);
    }

    if (attributesConfig) {
      rule.attributes = {};
      for (const key of ['destructive', 'readOnly', 'idempotent'] as const) {
        const value = attributesConfig.getOptionalBoolean(key);
        if (value !== undefined) {
          rule.attributes[key] = value;
        }
      }
    }

    return rule;
  });
}

export function parseServerConfigs(
  config: Config,
): Map<string, McpServerConfig> | undefined {
  const serversConfig = config.getOptionalConfig('mcpActions.servers');
  if (!serversConfig) {
    return undefined;
  }

  const servers = new Map<string, McpServerConfig>();

  for (const key of serversConfig.keys()) {
    if (!SERVER_KEY_PATTERN.test(key)) {
      throw new Error(
        `Invalid MCP server key "${key}": must be lowercase alphanumeric with hyphens`,
      );
    }

    const serverConfig = serversConfig.getConfig(key);

    const filterConfig = serverConfig.getOptionalConfig('filter');
    const includeRules = parseFilterRules(
      filterConfig?.getOptionalConfigArray('include') ?? [],
    );
    const excludeRules = parseFilterRules(
      filterConfig?.getOptionalConfigArray('exclude') ?? [],
    );

    servers.set(key, {
      name: serverConfig.getString('name'),
      description: serverConfig.getOptionalString('description'),
      includeRules,
      excludeRules,
    });
  }

  return servers;
}
