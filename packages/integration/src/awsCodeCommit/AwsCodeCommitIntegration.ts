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
import {
  AwsCodeCommitIntegrationConfig,
  readAwsCodeCommitIntegrationConfigs,
} from './config';

/**
 * Integrates with AWS CodeCommit.
 *
 * @public
 */
export class AwsCodeCommitIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<AwsCodeCommitIntegration> = ({
    config,
  }) => {
    const configs = readAwsCodeCommitIntegrationConfigs(
      config.getOptionalConfigArray('integrations.awsCodeCommit') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new AwsCodeCommitIntegration(c)),
      i => i.config.host,
    );
  };

  get type(): string {
    return 'awsCodeCommit';
  }

  get config(): AwsCodeCommitIntegrationConfig {
    return this.integrationConfig;
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  constructor(
    private readonly integrationConfig: AwsCodeCommitIntegrationConfig,
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
    const parsedUrl = new URL(url);
    const pathMatch = parsedUrl.pathname.match(
      /^\/codesuite\/codecommit\/repositories\/([^\/]+)\//,
    );
    if (!pathMatch) {
      throw new Error(``);
    }
    const [, repositoryName] = pathMatch;
    return replaceCodeCommitUrlType(url, repositoryName, 'edit');
  }
}

/**
 * Takes a CodeCommit URL and replaces the type part (blob, tree etc).
 *
 * @param url - The original URL
 * @param type - The desired type, e.g. 'blob', 'edit'
 * @public
 */
export function replaceCodeCommitUrlType(
  url: string,
  repositoryName: string,
  type: 'browse' | 'edit',
): string {
  const newString = type === 'edit' ? `files/edit` : type;
  return url.replace(
    new RegExp(
      `\/codesuite\/codecommit\/repositories\/${repositoryName}\/(browse|files\/edit)\/`,
    ),
    `/codesuite/codecommit/repositories/${repositoryName}/${newString}/`,
  );
}
