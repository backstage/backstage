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

import { PluginConfig, PluginOutput, BackstagePlugin } from './types';
import { validateBrowserCompat, validateFlagName } from '../app/FeatureFlags';
import { AnyApiFactory } from '../apis';

export class PluginImpl {
  private storedOutput?: PluginOutput[];

  constructor(private readonly config: PluginConfig) {}

  getId(): string {
    return this.config.id;
  }

  getApis(): Iterable<AnyApiFactory> {
    return this.config.apis ?? [];
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
        registerRoute(path, component, options) {
          outputs.push({ type: 'legacy-route', path, component, options });
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
