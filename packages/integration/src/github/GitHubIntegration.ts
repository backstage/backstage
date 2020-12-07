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

import { ScmIntegration, ScmIntegrationFactory } from '../types';
import {
  GitHubIntegrationConfig,
  readGitHubIntegrationConfigs,
} from './config';

export class GitHubIntegration implements ScmIntegration {
  static factory: ScmIntegrationFactory = ({ config }) => {
    const configs = readGitHubIntegrationConfigs(
      config.getOptionalConfigArray('integrations.github') ?? [],
    );
    return configs.map(integration => ({
      predicate: (url: URL) => url.host === integration.host,
      integration: new GitHubIntegration(integration),
    }));
  };

  constructor(private readonly config: GitHubIntegrationConfig) {}

  get type(): string {
    return 'github';
  }

  get title(): string {
    return this.config.host;
  }
}
