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

import { Minimatch } from 'minimatch';

import { ExtendMetadata } from '@backstage/core-plugin-api';

import { AppOptions } from './types';

export type PluginDecorationOptions = Pick<
  AppOptions,
  'pluginOwners' | 'pluginInfoDecorator'
>;

/**
 * Extends plugin metadata with app-level configurations for setting owners
 * (based on package name), and custom decorators to set/change metadata fields
 */
export class PluginMetadataExtender {
  private readonly matchers: ReadonlyArray<readonly [Minimatch, string]>;

  constructor(private options: PluginDecorationOptions) {
    const { pluginOwners = [] } = this.options;

    this.matchers = pluginOwners.flatMap(rec =>
      Object.entries(rec).map(
        ([pkgNamePattern, owner]) =>
          [new Minimatch(pkgNamePattern), owner] as const,
      ),
    );
  }

  public extend: ExtendMetadata = (info, pluginId) => {
    const pkgJson = (info.packageJson as any) ?? {};

    const pkgName = pkgJson?.name ? `${pkgJson.name}` : undefined;

    if (pkgName && !info.ownerEntityRef) {
      info.ownerEntityRef =
        this.matchOwner(pkgName) ?? pkgJson.backstage?.owner;
    }

    this.options.pluginInfoDecorator?.(info, pluginId);
  };

  private matchOwner(pkgName: string): string | undefined {
    const match = this.matchers.find(([matcher]) => matcher.match(pkgName));
    return match?.[1];
  }
}
