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
  BitbucketIntegrationConfig,
  readBitbucketIntegrationConfigs,
} from './config';

/**
 * A Bitbucket based integration.
 *
 * @public
 * @deprecated replaced by the integrations bitbucketCloud and bitbucketServer.
 */
export class BitbucketIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<BitbucketIntegration> = ({
    config,
  }) => {
    const configs = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [
        // if integrations.bitbucket was not used assume the use was migrated to the new configs
        // and backport for the deprecated integration to be usable for other parts of the system
        // until these got migrated
        ...(config.getOptionalConfigArray('integrations.bitbucketCloud') ?? []),
        ...(config.getOptionalConfigArray('integrations.bitbucketServer') ??
          []),
      ],
    );
    return basicIntegrations(
      configs.map(c => new BitbucketIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(private readonly integrationConfig: BitbucketIntegrationConfig) {}

  get type(): string {
    return 'bitbucket';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): BitbucketIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    const resolved = defaultScmResolveUrl(options);
    if (!options.lineNumber) {
      return resolved;
    }

    const url = new URL(resolved);

    if (this.integrationConfig.host === 'bitbucket.org') {
      // Bitbucket Cloud uses the syntax #lines-{start}[:{end}][,...]
      url.hash = `lines-${options.lineNumber}`;
    } else {
      // Bitbucket Server uses the syntax #{start}[-{end}][,...]
      url.hash = `${options.lineNumber}`;
    }

    return url.toString();
  }

  resolveEditUrl(url: string): string {
    const urlData = parseGitUrl(url);
    const editUrl = new URL(url);

    editUrl.searchParams.set('mode', 'edit');
    // TODO: Not sure what spa=0 does, at least bitbucket.org doesn't support it
    // but this is taken over from the initial implementation.
    editUrl.searchParams.set('spa', '0');
    editUrl.searchParams.set('at', urlData.ref);
    return editUrl.toString();
  }
}
