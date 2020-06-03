/*
 * Copyright 2020 Spotify AB
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

import { ComponentType } from 'react';
import {
  PluginOutput,
  RoutePath,
  RouteOptions,
  FeatureFlagName,
  BackstagePlugin,
} from './types';
import { validateBrowserCompat, validateFlagName } from '../app/FeatureFlags';
import { RouteRef } from '../routing';

export type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

export type PluginHooks = {
  router: RouterHooks;
  featureFlags: FeatureFlagsHooks;
};

export type RouterHooks = {
  addRoute(
    target: RouteRef,
    Component: ComponentType<any>,
    options?: RouteOptions,
  ): void;

  addRedirect(from: RouteRef, to: RouteRef, options?: RouteOptions): void;

  /**
   * @deprecated See the `addRoute` method
   */
  registerRoute(
    path: RoutePath,
    Component: ComponentType<any>,
    options?: RouteOptions,
  ): void;

  /**
   * @deprecated See the `addRedirect` method
   */
  registerRedirect(
    path: RoutePath,
    target: RoutePath,
    options?: RouteOptions,
  ): void;
};

export type FeatureFlagsHooks = {
  register(name: FeatureFlagName): void;
};

export class PluginImpl {
  private storedOutput?: PluginOutput[];

  constructor(private readonly config: PluginConfig) {}

  getId(): string {
    return this.config.id;
  }

  output(): PluginOutput[] {
    if (this.storedOutput) {
      return this.storedOutput;
    }
    if (!this.config.register) {
      return [];
    }

    const outputs = new Array<PluginOutput>();

    this.config.register({
      router: {
        addRoute(target, component, options) {
          outputs.push({
            type: 'route',
            target,
            component,
            options,
          });
        },
        addRedirect(from, to, options) {
          outputs.push({
            type: 'redirect-route',
            from,
            to,
            options,
          });
        },
        registerRoute(path, component, options) {
          outputs.push({ type: 'legacy-route', path, component, options });
        },
        registerRedirect(path, target, options) {
          outputs.push({
            type: 'legacy-redirect-route',
            path,
            target,
            options,
          });
        },
      },
      featureFlags: {
        register(name) {
          validateBrowserCompat();
          validateFlagName(name);
          outputs.push({ type: 'feature-flag', name });
        },
      },
    });

    this.storedOutput = outputs;
    return this.storedOutput;
  }

  toString() {
    return `plugin{${this.config.id}}`;
  }
}

export function createPlugin(config: PluginConfig): BackstagePlugin {
  return new PluginImpl(config);
}
