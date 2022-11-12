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
} from './types';
import { AnyApiFactory } from '../apis';
import { ComponentAdaptation } from '../adaptable-components/types';

type ExtensionType<T extends Extension<any>> = T extends Extension<infer U>
  ? U
  : never;

type ExtractExtensions<T extends Record<string, Extension<any>>> = {
  [K in keyof T]: ExtensionType<T[K]>;
};

/**
 * @internal
 */
export class PluginImpl<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
  PluginInputOptions extends {},
  ComponentAdaptations extends Record<
    string,
    Extension<ComponentAdaptation<any, any>>
  > = {},
> implements
    BackstagePlugin<
      Routes,
      ExternalRoutes,
      PluginInputOptions,
      ExtractExtensions<ComponentAdaptations>
    >
{
  #_adaptations: ExtractExtensions<ComponentAdaptations>;

  constructor(
    private readonly config: PluginConfig<
      Routes,
      ExternalRoutes,
      PluginInputOptions,
      ComponentAdaptations
    >,
  ) {
    this.#_adaptations = Object.fromEntries(
      Object.entries(config.adaptations ?? {}).map(([name, adaptation]) => [
        name,
        adaptation.expose(this),
      ]),
    ) as ExtractExtensions<ComponentAdaptations>;
  }

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

  get routes(): Routes {
    return this.config.routes ?? ({} as Routes);
  }

  get adaptations(): ExtractExtensions<ComponentAdaptations> {
    return this.#_adaptations;
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
  ComponentAdaptations extends Record<string, Extension<any>> = {},
>(
  config: PluginConfig<
    Routes,
    ExternalRoutes,
    PluginInputOptions,
    ComponentAdaptations
  >,
): BackstagePlugin<
  Routes,
  ExternalRoutes,
  PluginInputOptions,
  ExtractExtensions<ComponentAdaptations>
> {
  return new PluginImpl(config);
}
