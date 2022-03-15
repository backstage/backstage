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

import {
  PluginConfig,
  BackstagePlugin,
  Extension,
  AnyRoutes,
  AnyExternalRoutes,
  PluginFeatureFlagConfig,
  PluginInfo,
  ExtendMetadata,
} from './types';
import { AnyApiFactory } from '../apis';
import { getPluginMetadata } from './plugin-metadata';

/**
 * @internal
 */
export class PluginImpl<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
  PluginInputOptions extends {},
> implements BackstagePlugin<Routes, ExternalRoutes, PluginInputOptions>
{
  constructor(
    private readonly config: PluginConfig<
      Routes,
      ExternalRoutes,
      PluginInputOptions
    >,
  ) {}

  private deferredInfo: Promise<PluginInfo> | undefined = undefined;
  private metadataExtender: ExtendMetadata | undefined = undefined;
  private options: {} | undefined = undefined;

  getId(): string {
    return this.config.id;
  }

  getApis(): Iterable<AnyApiFactory> {
    return this.config.apis ?? [];
  }

  getFeatureFlags(): Iterable<PluginFeatureFlagConfig> {
    return this.config.featureFlags?.slice() ?? [];
  }

  getInfo(): Promise<PluginInfo> {
    this.deferredInfo ??= getPluginMetadata(
      this.config.info,
      this.config.id,
      this.metadataExtender,
    );
    return this.deferredInfo;
  }

  setMetadataExtender(extender: ExtendMetadata) {
    this.metadataExtender = extender;
  }

  get routes(): Routes {
    return this.config.routes ?? ({} as Routes);
  }

  get externalRoutes(): ExternalRoutes {
    return this.config.externalRoutes ?? ({} as ExternalRoutes);
  }

  provide<T>(extension: Extension<T>): T {
    return extension.expose(this);
  }

  __experimentalReconfigure(options: PluginInputOptions): void {
    if (this.config.__experimentalConfigure) {
      this.options = this.config.__experimentalConfigure(options);
    }
  }

  getPluginOptions(): {} {
    if (this.config.__experimentalConfigure && !this.options) {
      this.options = this.config.__experimentalConfigure();
    }
    return this.options ?? {};
  }

  toString() {
    return `plugin{${this.config.id}}`;
  }
}

/**
 * Creates Backstage Plugin from config.
 *
 * @param config - Plugin configuration.
 * @public
 */
export function createPlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {},
  PluginInputOptions extends {} = {},
>(
  config: PluginConfig<Routes, ExternalRoutes, PluginInputOptions>,
): BackstagePlugin<Routes, ExternalRoutes, PluginInputOptions> {
  return new PluginImpl(config);
}
