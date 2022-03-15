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

import { Minimatch, IMinimatch } from 'minimatch';

import { AppOptions, CompatiblePlugin } from './types';

export type PluginDecorationOptions = Pick<
  AppOptions,
  'pluginOwners' | 'pluginInfoDecorator'
>;

export class PluginDecoration {
  private readonly matchers: ReadonlyArray<readonly [IMinimatch, string]>;
  private knownPluginIds = new Set<string>();

  constructor(private options: PluginDecorationOptions) {
    const { pluginOwners = [] } = this.options;

    this.matchers = pluginOwners.flatMap(rec =>
      Object.entries(rec).map(
        ([pkgNamePattern, owner]) =>
          [new Minimatch(pkgNamePattern), owner] as const,
      ),
    );
  }

  public matchOwner = (pkgName: string): string | undefined => {
    const match = this.matchers.find(([matcher]) => matcher.match(pkgName));
    return match?.[1];
  };

  public decoratePlugin = <Plugin extends CompatiblePlugin>(plugin: Plugin) => {
    if (this.knownPluginIds.has(plugin.getId())) {
      return plugin;
    }

    const { pluginInfoDecorator = () => {} } = this.options;

    if (!plugin.info) {
      // Plugin with an older core-plugin-api dependency
      plugin.info = { links: [] };
    }

    const pkgJson = (plugin.info.packageJson as any) ?? {};

    const pkgName = pkgJson?.name ? `${pkgJson.name}` : undefined;
    const pkgDescription = pkgJson?.description
      ? `${pkgJson.description}`
      : undefined;
    const pkgVersion = pkgJson?.version ? `${pkgJson.version}` : undefined;

    if (!plugin.info.ownerEntityRef && pkgName) {
      plugin.info.ownerEntityRef =
        this.matchOwner(pkgName) ?? pkgJson.backstage?.owner;
    }
    if (!plugin.info.description) {
      plugin.info.description = pkgDescription;
    }
    if (!plugin.info.version) {
      plugin.info.version = pkgVersion;
    }
    if (!plugin.info.name && pkgJson.backstage?.name) {
      plugin.info.name = pkgJson.backstage.name;
    }
    if (!plugin.info.role && pkgJson.backstage?.role) {
      plugin.info.role = pkgJson.backstage.role;
    }
    if (typeof pkgJson.homepage === 'string') {
      plugin.info.links.push({
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
        plugin.info.links.push({
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
        plugin.info.links.push({
          title: 'Package repository',
          url: url.toString(),
        });
      } catch (_err) {
        // not critical
      }
    }

    pluginInfoDecorator(plugin.info, plugin.getId());

    this.knownPluginIds.add(plugin.getId());

    return plugin;
  };

  public decoratePlugins = <Plugin extends CompatiblePlugin>(
    plugins: Plugin[],
  ): Plugin[] => {
    plugins.forEach(plugin => {
      this.decoratePlugin(plugin);
    });

    return plugins;
  };
}
