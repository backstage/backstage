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

import { PluginInfo, ExtendMetadata, PluginConfigInfo } from './types';

export async function getPluginMetadata(
  infoConfig: PluginConfigInfo | undefined = {},
  pluginId: string,
  metadataExtender: ExtendMetadata | undefined,
) {
  const info = await getInitialInfo(infoConfig);

  // Extract fields from package.json to fill in the PluginInfo if possible
  parseMetadata(info);

  // Defer further metadata handling to the app
  await metadataExtender?.(info, pluginId);

  return info;
}

/**
 * Takes the info object as configured (with maybe lazy-loaded package.json
 * content) and turns into a PluginInfo object
 */
async function getInitialInfo(
  infoConfig: PluginConfigInfo,
): Promise<PluginInfo> {
  if (typeof infoConfig === 'function') {
    return {
      packageJson: await infoConfig().then(m => m.default),
      links: [],
    };
  } else if (!infoConfig) {
    return { links: [] };
  }

  infoConfig.links ??= [];

  if (typeof infoConfig.packageJson === 'function') {
    infoConfig.packageJson = await infoConfig
      .packageJson()
      .then(m => m.default);
  }

  return infoConfig as PluginInfo;
}

function parseMetadata(info: PluginInfo): void {
  const pkgJson = (info.packageJson as any) ?? {};

  const pkgDescription = pkgJson?.description
    ? `${pkgJson.description}`
    : undefined;
  const pkgVersion = pkgJson?.version ? `${pkgJson.version}` : undefined;

  if (!info.description) {
    info.description = pkgDescription;
  }
  if (!info.version) {
    info.version = pkgVersion;
  }

  if (!info.role && pkgJson.backstage?.role) {
    info.role = pkgJson.backstage.role;
  }
  if (typeof pkgJson.homepage === 'string') {
    info.links.push({
      title: 'Package homepage',
      url: pkgJson.homepage,
    });
  }
  if (typeof pkgJson.repository === 'string') {
    try {
      const url = new URL(pkgJson.repository);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        url.protocol = 'https:';
      }
      info.links.push({
        title: 'Package repository',
        url: url.toString(),
      });
    } catch (_err) {
      // not critical
    }
  }
  if (typeof pkgJson.repository?.url === 'string') {
    try {
      const url = new URL(pkgJson.repository?.url);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        url.protocol = 'https:';
      }
      if (
        url.hostname.endsWith('github.com') &&
        typeof pkgJson.repository.directory === 'string'
      ) {
        const slash = url.pathname.endsWith('/') ? '' : '/';
        const { directory } = pkgJson.repository;
        url.pathname = `${url.pathname}${slash}tree/master/${directory}`;
      }
      info.links.push({
        title: 'Package repository',
        url: url.toString(),
      });
    } catch (_err) {
      // not critical
    }
  }
}
