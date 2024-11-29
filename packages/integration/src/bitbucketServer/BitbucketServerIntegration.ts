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
  BitbucketServerIntegrationConfig,
  readBitbucketServerIntegrationConfigs,
} from './config';

/**
 * A Bitbucket Server based integration.
 *
 * @public
 */
export class BitbucketServerIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<BitbucketServerIntegration> = ({
    config,
  }) => {
    const configs = readBitbucketServerIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucketServer') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new BitbucketServerIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(
    private readonly integrationConfig: BitbucketServerIntegrationConfig,
  ) {}

  get type(): string {
    return 'bitbucketServer';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): BitbucketServerIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    const resolved = defaultScmResolveUrl(options);

    // Bitbucket Server line numbers use the syntax #42, rather than #L42
    if (options.lineNumber) {
      const url = new URL(resolved);

      url.hash = options.lineNumber.toString();
      return url.toString();
    }

    return resolved;
  }

  resolveEditUrl(url: string): string {
    // Bitbucket Server doesn't support deep linking to edit mode, therefore there's nothing to do here.
    // We just remove query parameters since they cause issues with TechDocs edit button.
    if (url.includes('?')) {
      return url.substring(0, url.indexOf('?'));
    }
    return url;
  }
}
