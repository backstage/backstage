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
import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { GiteaIntegrationConfig, readGiteaConfig } from './config';
import { getGiteaEditContentsUrl } from './core';

/**
 * A Gitea based integration.
 *
 * @public
 */
export class GiteaIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<GiteaIntegration> = ({ config }) => {
    const configs = config.getOptionalConfigArray('integrations.gitea') ?? [];
    const giteaConfigs = configs.map(c => readGiteaConfig(c));

    return basicIntegrations(
      giteaConfigs.map(c => new GiteaIntegration(c)),
      (gitea: GiteaIntegration) => gitea.config.host,
    );
  };

  constructor(readonly config: GiteaIntegrationConfig) {}

  get type(): string {
    return 'gitea';
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
    return getGiteaEditContentsUrl(this.config, url);
  }
}
