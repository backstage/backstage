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

import type { NavTargetConfig, NavTargetOverrideConfig } from './types';

export class MutableNavTarget {
  private effectiveConfig: NavTargetConfig = this.config;

  constructor(private readonly config: NavTargetConfig) {}

  override(overrideConfig: NavTargetOverrideConfig) {
    this.effectiveConfig = { ...this.config, ...overrideConfig };
  }

  get icon() {
    return this.effectiveConfig.icon;
  }

  get path() {
    return this.effectiveConfig.path;
  }

  get title() {
    return this.effectiveConfig.title;
  }
}

export function createNavTarget(config: NavTargetConfig): MutableNavTarget {
  return new MutableNavTarget(config);
}
