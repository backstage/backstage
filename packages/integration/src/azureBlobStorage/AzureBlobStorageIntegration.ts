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
import {
  AzureBlobStorageIntegrationConfig,
  readAzureBlobStorageIntegrationConfigs,
} from './config';

/**
 * Microsoft Azure Blob storage based integration.
 *
 * @public
 */
export class AzureBlobStorageIntergation implements ScmIntegration {
  static factory: ScmIntegrationsFactory<AzureBlobStorageIntergation> = ({
    config,
  }) => {
    const configs = readAzureBlobStorageIntegrationConfigs(
      config.getOptionalConfigArray('integrations.azureBlobStorage') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new AzureBlobStorageIntergation(c)),
      i => i.config.host,
    );
  };

  get type(): string {
    return 'azureBlobStorage';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): AzureBlobStorageIntegrationConfig {
    return this.integrationConfig;
  }

  constructor(
    private readonly integrationConfig: AzureBlobStorageIntegrationConfig,
  ) {}

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number | undefined;
  }): string {
    const resolved = defaultScmResolveUrl(options);
    return resolved;
  }

  resolveEditUrl(url: string): string {
    // TODO: Implement edit URL for azureBlobStorage
    return url;
  }
}
