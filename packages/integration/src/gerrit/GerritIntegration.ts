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

import { basicIntegrations } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import {
  GerritIntegrationConfig,
  readGerritIntegrationConfigs,
} from './config';

/**
 * A Gerrit based integration.
 *
 * @public
 */
export class GerritIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<GerritIntegration> = ({ config }) => {
    const configs = readGerritIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gerrit') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new GerritIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(private readonly integrationConfig: GerritIntegrationConfig) {}

  get type(): string {
    return 'gerrit';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): GerritIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    const { url, base, lineNumber } = options;
    let updated;
    if (url) {
      updated = new URL(url, base);
    } else {
      updated = new URL(base);
    }
    if (lineNumber) {
      updated.hash = lineNumber.toString();
    }
    return updated.toString();
  }

  resolveEditUrl(url: string): string {
    // Not applicable for gerrit.
    return url;
  }
}
