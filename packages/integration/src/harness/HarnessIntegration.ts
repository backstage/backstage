/*
 * Copyright 2024 The Backstage Authors
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
import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { HarnessIntegrationConfig, readHarnessConfig } from './config';
import { getHarnessEditContentsUrl } from './core';

/**
 * A Harness Code based integration.
 *
 * @public
 */
export class HarnessIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<HarnessIntegration> = ({ config }) => {
    const configs = config.getOptionalConfigArray('integrations.harness') ?? [];
    const harnessConfigs = configs.map(c => readHarnessConfig(c));

    return basicIntegrations(
      harnessConfigs.map(c => new HarnessIntegration(c)),
      (harness: HarnessIntegration) => harness.config.host,
    );
  };

  constructor(readonly config: HarnessIntegrationConfig) {}

  get type(): string {
    return 'harness';
  }

  get title(): string {
    return this.config.host;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number | undefined;
  }): string {
    return defaultScmResolveUrl(options);
  }

  resolveEditUrl(url: string): string {
    return getHarnessEditContentsUrl(this.config, url);
  }
}
