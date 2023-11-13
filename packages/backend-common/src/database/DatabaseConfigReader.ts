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

import { Config } from '@backstage/config';
import { Knex } from 'knex';
import { merge } from 'lodash';

/**
 * Wraps the reading of config and per-plugin overrides to that config. Does NOT
 * do any database-specific logic; it only deals with the raw config values
 * themselves, and their database-agnostic default values.
 */
export class PluginDatabaseSettings {
  constructor(
    private readonly plugin: string,
    private readonly baseConfig: Config,
    private readonly pluginOverridesConfig?: Config,
  ) {}

  subscribe(onChange: () => void): {
    unsubscribe: () => void;
  } {
    return (
      this.baseConfig.subscribe?.(onChange) ?? {
        unsubscribe() {},
      }
    );
  }

  get pluginId(): string {
    return this.plugin;
  }

  get client(): string {
    const pluginValue = this.pluginOverridesConfig?.getOptionalString('client');
    const baseValue = this.baseConfig.getString('client');
    return pluginValue ?? baseValue;
  }

  get clientWasOverridden(): boolean {
    return this.client !== this.baseConfig.getString('client');
  }

  get connection(): string | Knex.StaticConnectionConfig {
    const pluginValue = this.pluginOverridesConfig?.getOptional<
      string | Knex.StaticConnectionConfig
    >('client');
    const baseValue = this.baseConfig.get<string | Knex.StaticConnectionConfig>(
      'client',
    );
    return pluginValue ?? baseValue;
  }

  get prefix(): string {
    return this.baseConfig.getOptionalString('prefix') ?? 'backstage_plugin_';
  }

  get ensureExists(): boolean {
    const pluginValue =
      this.pluginOverridesConfig?.getOptionalBoolean('ensureExists');
    const baseValue = this.baseConfig.getOptionalBoolean('ensureExists');
    return pluginValue ?? baseValue ?? true;
  }

  get pluginDivisionMode(): 'database' | 'schema' {
    return (this.baseConfig.getOptionalString('pluginDivisionMode') ??
      'database') as 'database' | 'schema';
  }

  get role(): string | undefined {
    const pluginValue = this.pluginOverridesConfig?.getOptionalString('role');
    const baseValue = this.baseConfig.getString('role');
    return pluginValue ?? baseValue;
  }

  get knexConfig(): Knex.Config | undefined {
    const pluginValue = this.pluginOverridesConfig
      ?.getOptionalConfig('knexConfig')
      ?.get<Partial<Knex.Config>>();
    const baseValue = this.baseConfig
      .getOptionalConfig('knexConfig')
      ?.get<Partial<Knex.Config>>();
    return merge(baseValue, pluginValue);
  }
}

/**
 * Wraps the reading of config and per-plugin overrides to that config. Does NOT
 * do any database-specific logic; it only deals with the raw config values
 * themselves.
 */
export class DatabaseConfigReader {
  static fromConfig(rootConfig: Config): DatabaseConfigReader {
    return new DatabaseConfigReader(rootConfig.getConfig('backend.database'));
  }

  private constructor(private readonly config: Config) {}

  forPlugin(pluginId: string): PluginDatabaseSettings {
    return new PluginDatabaseSettings(
      pluginId,
      this.config,
      this.config.getOptionalConfig(`plugin.${pluginId}`),
    );
  }
}
