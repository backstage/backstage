/*
 * Copyright 2023 The Backstage Authors
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

import { Config, ConfigReader } from '@backstage/config';
import { JsonValue } from '@backstage/types';

export class ObservableConfigProxy implements Config {
  private config: Config = new ConfigReader({});

  private readonly subscribers: (() => void)[] = [];

  static create(abortController: AbortController): ObservableConfigProxy {
    return new ObservableConfigProxy(undefined, undefined, abortController);
  }

  private constructor(
    private readonly parent?: ObservableConfigProxy,
    private readonly parentKey?: string,
    private readonly abortController?: AbortController,
  ) {
    if (parent && !parentKey) {
      throw new Error('parentKey is required if parent is set');
    }
  }

  setConfig(config: Config) {
    if (this.parent) {
      throw new Error('immutable');
    }
    this.config = config;
    for (const subscriber of this.subscribers) {
      try {
        subscriber();
      } catch (error) {
        console.error(`Config subscriber threw error, ${error}`);
      }
    }
  }

  close() {
    if (!this.abortController) {
      throw new Error('Only the root config can be closed');
    }
    this.abortController.abort();
  }

  subscribe(onChange: () => void): { unsubscribe: () => void } {
    if (this.parent) {
      return this.parent.subscribe(onChange);
    }

    this.subscribers.push(onChange);
    return {
      unsubscribe: () => {
        const index = this.subscribers.indexOf(onChange);
        if (index >= 0) {
          this.subscribers.splice(index, 1);
        }
      },
    };
  }

  private select(required: true): Config;
  private select(required: false): Config | undefined;
  private select(required: boolean): Config | undefined {
    if (this.parent && this.parentKey) {
      if (required) {
        return this.parent.select(true).getConfig(this.parentKey);
      }
      return this.parent.select(false)?.getOptionalConfig(this.parentKey);
    }

    return this.config;
  }

  has(key: string): boolean {
    return this.select(false)?.has(key) ?? false;
  }
  keys(): string[] {
    return this.select(false)?.keys() ?? [];
  }
  get<T = JsonValue>(key?: string): T {
    return this.select(true).get(key);
  }
  getOptional<T = JsonValue>(key?: string): T | undefined {
    return this.select(false)?.getOptional(key);
  }
  getConfig(key: string): Config {
    return new ObservableConfigProxy(this, key);
  }
  getOptionalConfig(key: string): Config | undefined {
    if (this.select(false)?.has(key)) {
      return new ObservableConfigProxy(this, key);
    }
    return undefined;
  }
  getConfigArray(key: string): Config[] {
    return this.select(true).getConfigArray(key);
  }
  getOptionalConfigArray(key: string): Config[] | undefined {
    return this.select(false)?.getOptionalConfigArray(key);
  }
  getNumber(key: string): number {
    return this.select(true).getNumber(key);
  }
  getOptionalNumber(key: string): number | undefined {
    return this.select(false)?.getOptionalNumber(key);
  }
  getBoolean(key: string): boolean {
    return this.select(true).getBoolean(key);
  }
  getOptionalBoolean(key: string): boolean | undefined {
    return this.select(false)?.getOptionalBoolean(key);
  }
  getString(key: string): string {
    return this.select(true).getString(key);
  }
  getOptionalString(key: string): string | undefined {
    return this.select(false)?.getOptionalString(key);
  }
  getStringArray(key: string): string[] {
    return this.select(true).getStringArray(key);
  }
  getOptionalStringArray(key: string): string[] | undefined {
    return this.select(false)?.getOptionalStringArray(key);
  }
}
