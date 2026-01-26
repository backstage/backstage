/*
 * Copyright 2025 The Backstage Authors
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

import { ConfigApi } from '@backstage/core-plugin-api';
import {
  FrontendFeature,
  FrontendPluginInfo,
} from '@backstage/frontend-plugin-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';
import { JsonObject, JsonValue } from '@backstage/types';
import once from 'lodash/once';
// Avoid full dependency on catalog-model
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  parseEntityRef,
  stringifyEntityRef,
} from '../../../catalog-model/src/entity/ref';

/**
 * A function that resolves plugin info from a plugin manifest and package.json.
 *
 * @public
 */
export type FrontendPluginInfoResolver = (ctx: {
  packageJson(): Promise<JsonObject | undefined>;
  manifest(): Promise<JsonObject | undefined>;
  defaultResolver(sources: {
    packageJson: JsonObject | undefined;
    manifest: JsonObject | undefined;
  }): Promise<{ info: FrontendPluginInfo }>;
}) => Promise<{ info: FrontendPluginInfo }>;

export function createPluginInfoAttacher(
  config: ConfigApi,
  infoResolver: FrontendPluginInfoResolver = async ctx =>
    ctx.defaultResolver({
      packageJson: await ctx.packageJson(),
      manifest: await ctx.manifest(),
    }),
): (feature: FrontendFeature) => FrontendFeature {
  const applyInfoOverrides = createPluginInfoOverrider(config);

  return (feature: FrontendFeature) => {
    if (!OpaqueFrontendPlugin.isType(feature)) {
      return feature;
    }

    const plugin = OpaqueFrontendPlugin.toInternal(feature);

    return {
      ...plugin,
      info: once(async () => {
        const manifestLoader = plugin.infoOptions?.manifest;
        const packageJsonLoader = plugin.infoOptions?.packageJson;

        const { info: resolvedInfo } = await infoResolver({
          manifest: async () => manifestLoader?.(),
          packageJson: async () => packageJsonLoader?.(),
          defaultResolver: async sources => ({
            info: {
              ...resolvePackageInfo(sources.packageJson),
              ...resolveManifestInfo(sources.manifest),
            },
          }),
        });

        const infoWithOverrides = applyInfoOverrides(
          plugin.pluginId ?? plugin.id,
          resolvedInfo,
        );
        return normalizePluginInfo(infoWithOverrides);
      }),
    };
  };
}

function normalizePluginInfo(info: FrontendPluginInfo) {
  return {
    ...info,
    ownerEntityRefs: info.ownerEntityRefs?.map(ref =>
      stringifyEntityRef(
        parseEntityRef(ref, {
          defaultKind: 'Group',
        }),
      ),
    ),
  };
}

function createPluginInfoOverrider(config: ConfigApi) {
  const overrideConfigs =
    config.getOptionalConfigArray('app.pluginOverrides') ?? [];

  const overrideMatchers = overrideConfigs.map(overrideConfig => {
    const pluginIdMatcher = makeStringMatcher(
      overrideConfig.getOptionalString('match.pluginId'),
    );
    const packageNameMatcher = makeStringMatcher(
      overrideConfig.getOptionalString('match.packageName'),
    );
    const description = overrideConfig.getOptionalString('info.description');
    const ownerEntityRefs = overrideConfig.getOptionalStringArray(
      'info.ownerEntityRefs',
    );
    const links = overrideConfig
      .getOptionalConfigArray('info.links')
      ?.map(linkConfig => ({
        title: linkConfig.getString('title'),
        url: linkConfig.getString('url'),
      }));

    return {
      test(pluginId: string, packageName?: string) {
        return packageNameMatcher(packageName) && pluginIdMatcher(pluginId);
      },
      info: {
        description,
        ownerEntityRefs,
        links,
      },
    };
  });

  return (pluginId: string, info: FrontendPluginInfo) => {
    const { packageName } = info;
    for (const matcher of overrideMatchers) {
      if (matcher.test(pluginId, packageName)) {
        if (matcher.info.description) {
          info.description = matcher.info.description;
        }
        if (matcher.info.ownerEntityRefs) {
          info.ownerEntityRefs = matcher.info.ownerEntityRefs;
        }
        if (matcher.info.links) {
          info.links = matcher.info.links;
        }
      }
    }
    return info;
  };
}

function resolveManifestInfo(manifest?: JsonValue) {
  if (!isJsonObject(manifest) || !isJsonObject(manifest.metadata)) {
    return undefined;
  }

  const info: FrontendPluginInfo = {};

  if (isJsonObject(manifest.spec) && typeof manifest.spec.owner === 'string') {
    info.ownerEntityRefs = [
      stringifyEntityRef(
        parseEntityRef(manifest.spec.owner, {
          defaultKind: 'Group',
          defaultNamespace: manifest.metadata.namespace?.toString(),
        }),
      ),
    ];
  }

  if (Array.isArray(manifest.metadata.links)) {
    info.links = manifest.metadata.links.filter(isJsonObject).map(link => ({
      title: String(link.title),
      url: String(link.url),
    }));
  }

  return info;
}

function resolvePackageInfo(packageJson?: JsonObject) {
  if (!packageJson) {
    return undefined;
  }

  const info: FrontendPluginInfo = {
    packageName: packageJson?.name?.toString(),
    version: packageJson?.version?.toString(),
    description: packageJson?.description?.toString(),
  };

  const links: { title: string; url: string }[] = [];

  if (typeof packageJson.homepage === 'string') {
    links.push({
      title: 'Homepage',
      url: packageJson.homepage,
    });
  }

  if (
    isJsonObject(packageJson.repository) &&
    typeof packageJson.repository?.url === 'string'
  ) {
    try {
      const url = new URL(packageJson.repository?.url);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        // TODO(Rugvip): Support more variants
        if (
          url.hostname === 'github.com' &&
          typeof packageJson.repository.directory === 'string'
        ) {
          const path = `${url.pathname}/tree/-/${packageJson.repository.directory}`;
          url.pathname = path.replaceAll('//', '/');
        }

        links.push({
          title: 'Repository',
          url: url.toString(),
        });
      }
    } catch {
      /* ignored */
    }
  }

  if (links.length > 0) {
    info.links = links;
  }
  return info;
}

function makeStringMatcher(pattern: string | undefined) {
  if (!pattern) {
    return () => true;
  }
  if (pattern.startsWith('/') && pattern.endsWith('/') && pattern.length > 2) {
    const regex = new RegExp(pattern.slice(1, -1));
    return (str?: string) => (str ? regex.test(str) : false);
  }

  return (str?: string) => str === pattern;
}

function isJsonObject(value?: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
