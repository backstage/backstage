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

import parseGitUrl from 'git-url-parse';
import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import {
  BitbucketCloudIntegrationConfig,
  readBitbucketCloudIntegrationConfigs,
} from './config';

/**
 * A Bitbucket Cloud based integration.
 *
 * @public
 */
export class BitbucketCloudIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<BitbucketCloudIntegration> = ({
    config,
  }) => {
    const configs = readBitbucketCloudIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucketCloud') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new BitbucketCloudIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(
    private readonly integrationConfig: BitbucketCloudIntegrationConfig,
  ) {}

  get type(): string {
    return 'bitbucketCloud';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): BitbucketCloudIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    const resolved = defaultScmResolveUrl(options);

    // Bitbucket Cloud line numbers use the syntax #lines-42, rather than #L42
    if (options.lineNumber) {
      const url = new URL(resolved);

      url.hash = `lines-${options.lineNumber}`;
      return url.toString();
    }

    return resolved;
  }

  resolveEditUrl(url: string): string {
    const urlData = parseGitUrl(url);
    const editUrl = new URL(url);

    editUrl.searchParams.set('mode', 'edit');
    editUrl.searchParams.set('at', urlData.ref);
    return editUrl.toString();
  }
}
