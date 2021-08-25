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

import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { AwsS3IntegrationConfig, readAwsS3IntegrationConfigs } from './config';

export class AwsS3Integration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<AwsS3Integration> = ({ config }) => {
    const configs = readAwsS3IntegrationConfigs(
      config.getOptionalConfigArray('integrations.awsS3') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new AwsS3Integration(c)),
      i => i.config.host,
    );
  };

  get type(): string {
    return 'awsS3';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): AwsS3IntegrationConfig {
    return this.integrationConfig;
  }

  constructor(private readonly integrationConfig: AwsS3IntegrationConfig) {}
  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number | undefined;
  }): string {
    const resolved = defaultScmResolveUrl(options);
    return resolved;
  }

  resolveEditUrl(url: string): string {
    // TODO: Implement edit URL for awsS3
    return url;
  }
}
