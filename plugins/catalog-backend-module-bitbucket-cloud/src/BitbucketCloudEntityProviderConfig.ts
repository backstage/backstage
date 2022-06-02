/*
 * Copyright 2022 The Backstage Authors
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

const DEFAULT_CATALOG_PATH = '/catalog-info.yaml';
const DEFAULT_PROVIDER_ID = 'default';

export type BitbucketCloudEntityProviderConfig = {
  id: string;
  catalogPath: string;
  workspace: string;
  filters?: {
    projectKey?: RegExp;
    repoSlug?: RegExp;
  };
};

export function readProviderConfigs(
  config: Config,
): BitbucketCloudEntityProviderConfig[] {
  const providersConfig = config.getOptionalConfig(
    'catalog.providers.bitbucketCloud',
  );
  if (!providersConfig) {
    return [];
  }

  if (providersConfig.has('workspace')) {
    // simple/single config variant
    return [readProviderConfig(DEFAULT_PROVIDER_ID, providersConfig)];
  }

  return providersConfig.keys().map(id => {
    const providerConfig = providersConfig.getConfig(id);

    return readProviderConfig(id, providerConfig);
  });
}

function readProviderConfig(
  id: string,
  config: Config,
): BitbucketCloudEntityProviderConfig {
  const workspace = config.getString('workspace');
  const catalogPath =
    config.getOptionalString('catalogPath') ?? DEFAULT_CATALOG_PATH;
  const projectKeyPattern = config.getOptionalString('filters.projectKey');
  const repoSlugPattern = config.getOptionalString('filters.repoSlug');

  return {
    id,
    catalogPath,
    workspace,
    filters: {
      projectKey: projectKeyPattern
        ? compileRegExp(projectKeyPattern)
        : undefined,
      repoSlug: repoSlugPattern ? compileRegExp(repoSlugPattern) : undefined,
    },
  };
}

/**
 * Compiles a RegExp while enforcing the pattern to contain
 * the start-of-line and end-of-line anchors.
 *
 * @param pattern
 */
function compileRegExp(pattern: string): RegExp {
  let fullLinePattern = pattern;
  if (!fullLinePattern.startsWith('^')) {
    fullLinePattern = `^${fullLinePattern}`;
  }
  if (!fullLinePattern.endsWith('$')) {
    fullLinePattern = `${fullLinePattern}$`;
  }

  return new RegExp(fullLinePattern);
}
